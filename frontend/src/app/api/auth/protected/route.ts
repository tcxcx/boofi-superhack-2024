import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session) {
    return NextResponse.json({ data: "Protected data" });
  } else {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}
