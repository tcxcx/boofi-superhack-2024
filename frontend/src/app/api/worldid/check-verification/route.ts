"use server";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.worldcoinSub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userInfoEndpoint = "https://id.worldcoin.org/userinfo";
    const accessToken = session.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    const response = await fetch(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await response.json();
    const verificationLevel =
      userInfo["https://id.worldcoin.org/v1"].verification_level;

    let sessionLevel = 1;
    if (verificationLevel === "device" || verificationLevel === "orb") {
      sessionLevel = 2;
    }

    return NextResponse.json({ sessionLevel }, { status: 200 });
  } catch (error) {
    console.error("Error checking World ID verification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
