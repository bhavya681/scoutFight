import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const eventType = payload.type;

  if (eventType !== "user.created" && eventType !== "user.updated") {
    return NextResponse.json({ received: true });
  }

  const user = payload.data;
  const supabase = createServerClient();
  if (!supabase) {
    return NextResponse.json({ received: true, synced: false });
  }

  const email =
    user.email_addresses?.[0]?.email_address ?? user.primary_email_address_id;
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  await supabase.from("profiles").upsert(
    {
      clerk_id: user.id,
      email: email ?? "",
      full_name: fullName || null,
      avatar_url: user.image_url,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "clerk_id" }
  );

  return NextResponse.json({ received: true, synced: true });
}
