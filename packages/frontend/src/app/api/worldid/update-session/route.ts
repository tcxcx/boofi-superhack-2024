import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const verificationCheckResponse = await fetch(
      new URL("/api/worldid/check-verification", req.url),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
      }
    );

    if (!verificationCheckResponse.ok) {
      throw new Error("Failed to check World ID verification");
    }

    const { sessionLevel } = await verificationCheckResponse.json();

    // Update the session
    session.sessionLevel = sessionLevel;

    // TODO: Persist this change in your database here

    return NextResponse.json({ success: true, sessionLevel }, { status: 200 });
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
