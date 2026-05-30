import { NextResponse } from "next/server";
import { getAllOrganizations } from "@/lib/data/organization-repository";

export async function GET() {
  const organizations = await getAllOrganizations();
  return NextResponse.json({ organizations, count: organizations.length });
}
