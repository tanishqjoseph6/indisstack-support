/**
 * Phase 2 end-to-end verification (run with dev server on :3000).
 * Usage: node scripts/verify-phase2.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const baseUrl = process.env.VERIFY_BASE_URL ?? "http://localhost:3000";

assert(url && anonKey && serviceKey, "Supabase env vars missing");
assert(env.NEXT_PUBLIC_DEMO_MODE === "false", "NEXT_PUBLIC_DEMO_MODE must be false");

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ts = Date.now();
const password = "E2eVerify123!";
const emailA = `e2e-a-${ts}@example.com`;
const emailB = `e2e-b-${ts}@example.com`;

function createCookieClient() {
  const jar = new Map();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return [...jar.entries()].map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          jar.set(name, value);
        }
      },
    },
  });
  return { supabase, jar };
}

function cookieHeader(jar) {
  return [...jar.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
}

async function fetchWithCookies(path, jar, init = {}) {
  const headers = new Headers(init.headers ?? {});
  const cookies = cookieHeader(jar);
  if (cookies) headers.set("cookie", cookies);
  return fetch(`${baseUrl}${path}`, { ...init, headers, redirect: "manual" });
}

async function createConfirmedUser(email, firstName) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName },
  });
  assert(!error && data.user, `createUser failed for ${email}: ${error?.message}`);
  return data.user;
}

async function signUpUser(email, firstName) {
  try {
    const { supabase, jar } = createCookieClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName } },
    });
    if (!error && data.session && data.user) {
      return { supabase, jar, user: data.user, session: data.session, via: "signup" };
    }
  } catch {
    // Fall back to admin-created user when signup is rate-limited.
  }

  const user = await createConfirmedUser(email, firstName);
  const signedIn = await signInUser(email);
  return { ...signedIn, user, via: "admin-create" };
}

async function signInUser(email) {
  const { supabase, jar } = createCookieClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  assert(!error, `signin failed for ${email}: ${error?.message}`);
  assert(data.session, `no session after signin for ${email}`);
  return { supabase, jar, user: data.user, session: data.session };
}

async function main() {
  console.log("Phase 2 verification starting...\n");

  // 3/4: logged-out /inbox protection
  const inboxAnon = await fetch(`${baseUrl}/inbox`, { redirect: "manual" });
  assert(inboxAnon.status === 307 || inboxAnon.status === 302, "/inbox should redirect when logged out");
  assert(
    inboxAnon.headers.get("location")?.includes("/login"),
    "/inbox should redirect to /login",
  );
  pass("Logged-out /inbox redirects to /login");

  const apiAnon = await fetch(`${baseUrl}/api/inbox/tickets`);
  assert(apiAnon.status === 401, "/api/inbox/tickets should return 401 when logged out");
  pass("Logged-out inbox API returns 401");

  // 11: service role not in client bundles (static grep already done; spot-check page)
  const homeHtml = await (await fetch(`${baseUrl}/`)).text();
  assert(!homeHtml.includes("service_role"), "service role string must not appear in / HTML");
  assert(!homeHtml.includes(serviceKey.slice(0, 20)), "service role key must not appear in / HTML");
  pass("No service-role key exposed in landing HTML");

  // 1/2: signup + workspace bootstrap
  const userA = await signUpUser(emailA, "E2E");
  const setupA = await fetchWithCookies("/api/auth/setup-workspace", userA.jar, {
    method: "POST",
  });
  assert(setupA.status === 200, `setup-workspace failed: ${setupA.status}`);
  const setupBody = await setupA.json();
  assert(setupBody.workspace?.role === "owner", "workspace role should be owner");
  pass("New user workspace created with owner role");

  const { data: membershipsA } = await admin
    .from("workspace_members")
    .select("id, role, workspace_id")
    .eq("user_id", userA.user.id);
  assert(membershipsA?.length === 1, `user A should have exactly 1 membership, got ${membershipsA?.length}`);
  assert(membershipsA[0].role === "owner", "membership role must be owner");

  const { data: workspacesA } = await admin
    .from("workspaces")
    .select("id")
    .in("id", membershipsA.map((m) => m.workspace_id));
  assert(workspacesA?.length === 1, `user A should have exactly 1 workspace, got ${workspacesA?.length}`);
  pass("New user gets exactly one workspace and one owner membership");

  // Idempotent setup
  const setupAgain = await fetchWithCookies("/api/auth/setup-workspace", userA.jar, {
    method: "POST",
  });
  assert(setupAgain.status === 200, "second setup-workspace should succeed");
  const { data: membershipsAgain } = await admin
    .from("workspace_members")
    .select("id")
    .eq("user_id", userA.user.id);
  assert(membershipsAgain?.length === 1, "repeat setup must not create duplicate membership");
  pass("Workspace setup is idempotent");

  // 5/6 + Phase 3A: demo ticket provisioning
  const ticketsA = await fetchWithCookies("/api/inbox/tickets", userA.jar);
  assert(ticketsA.status === 200, "logged-in user should access inbox API");
  const ticketsBody = await ticketsA.json();
  assert(ticketsBody.source === "supabase", "inbox source should be supabase");
  assert(ticketsBody.tickets?.length === 7, `user A should have 7 demo tickets, got ${ticketsBody.tickets?.length}`);
  pass("User A receives 7 workspace demo tickets");

  const ticketsARepeat = await fetchWithCookies("/api/inbox/tickets", userA.jar);
  const ticketsRepeatBody = await ticketsARepeat.json();
  assert(
    ticketsRepeatBody.tickets?.length === 7,
    "repeat provisioning must not duplicate demo tickets",
  );
  pass("Demo ticket provisioning is idempotent");

  const workspaceIdA = membershipsA[0].workspace_id;

  // Seeded global demo tickets (workspace_id null) must not leak
  const { data: seededTickets } = await admin.from("tickets").select("id").is("workspace_id", null);
  if (seededTickets?.length) {
    const visibleIds = new Set((ticketsBody.tickets ?? []).map((t) => t.id));
    for (const seeded of seededTickets) {
      assert(!visibleIds.has(seeded.id), "global seeded ticket leaked to authenticated user");
    }
    pass("Global seeded tickets are not visible to authenticated users");
  } else {
    pass("No null-workspace global seeded tickets present (skip leak check)");
  }

  const rahulA = ticketsBody.tickets.find((t) => t.customerName === "Rahul Mehta");
  assert(rahulA, "Rahul Mehta demo ticket should exist for user A");
  assert(rahulA.analysis?.intent === "payment_debited_order_not_confirmed", "Rahul analysis should be provisioned");

  const escalateRes = await fetchWithCookies(
    `/api/inbox/tickets/${rahulA.id}/status`,
    userA.jar,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "escalated" }),
    },
  );
  assert(escalateRes.status === 200, "user A should escalate Rahul ticket");
  pass("Workspace ticket status updates persist for user A");

  const rahulDetailA = await fetchWithCookies(`/api/inbox/tickets/${rahulA.id}`, userA.jar);
  const rahulDetailBody = await rahulDetailA.json();
  assert(rahulDetailBody.ticket?.status === "escalated", "Rahul should remain escalated for user A");
  pass("Ticket detail reflects escalated status after refresh");

  // User B
  const userB = await signUpUser(emailB, "Other");
  await fetchWithCookies("/api/auth/setup-workspace", userB.jar, { method: "POST" });

  const ticketsB = await fetchWithCookies("/api/inbox/tickets", userB.jar);
  const ticketsBBody = await ticketsB.json();
  assert(ticketsBBody.tickets?.length === 7, `user B should have 7 demo tickets, got ${ticketsBBody.tickets?.length}`);
  const rahulB = ticketsBBody.tickets.find((t) => t.customerName === "Rahul Mehta");
  assert(rahulB, "Rahul Mehta demo ticket should exist for user B");
  assert(rahulB.status === "unresolved", "user B Rahul must remain unresolved");
  assert(rahulB.id !== rahulA.id, "each workspace should have distinct demo ticket IDs");
  pass("User B has isolated demo tickets with independent state");

  const ticketDetailB = await fetchWithCookies(`/api/inbox/tickets/${rahulA.id}`, userB.jar);
  assert(ticketDetailB.status === 404, "user B must not access user A Rahul ticket");
  pass("User cannot access another workspace's tickets");

  const userBClient = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${userB.session.access_token}` } },
  });
  const { data: directLeak } = await userBClient.from("tickets").select("id").eq("id", rahulA.id);
  assert(!directLeak?.length, "RLS must block direct ticket read across workspaces");
  pass("RLS blocks cross-workspace ticket reads");

  const { error: joinError } = await userBClient.from("workspace_members").insert({
    workspace_id: workspaceIdA,
    user_id: userB.user.id,
    role: "owner",
  });
  assert(joinError, "authenticated users must not insert arbitrary workspace memberships");
  pass("RLS blocks workspace membership self-join escalation");

  // messages/analyses scoped through ticket
  const { data: rahulMessages } = await admin
    .from("messages")
    .select("id")
    .eq("ticket_id", rahulA.id)
    .limit(1);
  assert(rahulMessages?.length, "Rahul should have provisioned messages");
  const messageId = rahulMessages[0].id;

  const { data: messageLeak } = await userBClient
    .from("messages")
    .select("id")
    .eq("id", messageId);
  assert(!messageLeak?.length, "RLS must block cross-workspace message reads");

  const { data: rahulAnalysis } = await admin
    .from("analyses")
    .select("id")
    .eq("ticket_id", rahulA.id)
    .maybeSingle();
  assert(rahulAnalysis, "Rahul should have provisioned analysis");

  const { data: analysisLeak } = await userBClient
    .from("analyses")
    .select("id")
    .eq("id", rahulAnalysis.id);
  assert(!analysisLeak?.length, "RLS must block cross-workspace analysis reads");
  pass("Messages and analyses are scoped through ticket workspace membership");

  // 9: logout re-protects inbox
  const logoutRes = await fetchWithCookies("/api/auth/logout", userA.jar, { method: "POST" });
  assert(logoutRes.status === 200, "logout should succeed");
  const inboxAfterLogout = await fetchWithCookies("/inbox", userA.jar, { redirect: "manual" });
  assert(
    inboxAfterLogout.status === 307 || inboxAfterLogout.status === 302,
    "/inbox should redirect after logout",
  );
  pass("Logout works and /inbox becomes protected again");

  // 10: session refresh via sign-in again + /api/auth/me
  const userA2 = await signInUser(emailA);
  const meRes = await fetchWithCookies("/api/auth/me", userA2.jar);
  assert(meRes.status === 200, "/api/auth/me should work after sign-in");
  const meBody = await meRes.json();
  assert(meBody.user?.email === emailA, "session email should match");
  assert(meBody.workspace?.id === workspaceIdA, "session workspace should persist");
  pass("Auth session restores after sign-in (refresh flow)");

  // Cleanup test artifacts (workspaces cascade tickets/messages/analyses)
  const { data: membershipsB } = await admin
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userB.user.id);
  const workspaceIds = [
    workspaceIdA,
    ...(membershipsB ?? []).map((m) => m.workspace_id),
  ];
  if (workspaceIds.length) {
    await admin.from("workspaces").delete().in("id", workspaceIds);
  }

  for (const email of [emailA, emailB]) {
    const { data: users } = await admin.auth.admin.listUsers();
    const match = users.users.find((u) => u.email === email);
    if (match) await admin.auth.admin.deleteUser(match.id);
  }

  console.log("\nAll Phase 2 + Phase 3A verification checks passed.");
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
