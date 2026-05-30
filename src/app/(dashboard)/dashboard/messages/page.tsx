import type { Metadata } from "next";
import { MessagingPanel } from "@/components/messaging/messaging-panel";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <div className="space-y-6 h-[calc(100vh-12rem)]">
      <h1 className="font-display text-2xl font-bold uppercase">Messages</h1>
      <MessagingPanel />
    </div>
  );
}
