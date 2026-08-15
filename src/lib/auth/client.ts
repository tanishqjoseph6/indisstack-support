export type SessionInfo = {
  email: string;
  workspaceName: string | null;
};

export async function fetchSession(): Promise<SessionInfo | null> {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      user?: { email?: string };
      workspace?: { name?: string } | null;
      demo?: boolean;
    };

    if (data.demo) return null;

    return {
      email: data.user?.email ?? "",
      workspaceName: data.workspace?.name ?? null,
    };
  } catch {
    return null;
  }
}

export async function setupWorkspaceAfterAuth(): Promise<void> {
  const response = await fetch("/api/auth/setup-workspace", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Unable to set up workspace.");
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
}
