import { NextResponse } from "next/server";
import { validateJWT } from "@/lib/authHelpers";

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const jwtPayload = await validateJWT(token);
    if (jwtPayload) {
      return NextResponse.json({
        id: jwtPayload.sub || "",
        name: jwtPayload.name || "",
        email: jwtPayload.email || "",
      });
    } else {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error validating token" },
      { status: 500 }
    );
  }
}
