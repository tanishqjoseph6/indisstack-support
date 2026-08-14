import type { Metadata } from "next";
import SupportInbox from "@/components/SupportInbox";

export const metadata: Metadata = {
  title: "Support Inbox — IndisStack",
  description:
    "Demo workspace for reviewing Hindi, Hinglish, and English customer support conversations.",
};

export default function InboxPage() {
  return <SupportInbox />;
}
