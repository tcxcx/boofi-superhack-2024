import { NextRequest, NextResponse } from "next/server";
import { initialSync } from "@/lib/actions/sync-db";

export async function POST(req: NextRequest) {
  try {
    await initialSync();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Sync failed:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
