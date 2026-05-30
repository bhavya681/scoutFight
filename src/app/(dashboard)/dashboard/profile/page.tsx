import type { Metadata } from "next";
import { ProfileEditor } from "@/components/dashboard/profile-editor";

export const metadata: Metadata = { title: "Edit Profile" };

export default function ProfilePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold uppercase">Edit Profile</h1>
      <ProfileEditor />
    </div>
  );
}
