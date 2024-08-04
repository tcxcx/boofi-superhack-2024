import { NextRequest, NextResponse } from "next/server";
import { getUserFromAppwrite } from "@/lib/actions/dynamic.user.actions";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    console.log("API route: Fetching user with ID:", id);
    const user = await getUserFromAppwrite(id);
    console.log("API route: User fetched from Appwrite:", user);

    if (!user) {
      console.log("API route: User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch user",
        details: error.message,
        code: error.code,
        response: error.response,
      },
      { status: 500 }
    );
  }
}
