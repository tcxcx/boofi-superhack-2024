import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  const { userId, cryptoBalances } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  console.log("Received userId:", userId);
  console.log(
    "Received cryptoBalances:",
    JSON.stringify(cryptoBalances, null, 2)
  );

  // Appwrite function URL
  const appwriteFunctionUrl = process.env.APPWRITE_FUNCTION_URL as string;

  try {
    const response = await fetch(appwriteFunctionUrl, {
      method: "POST",
      body: JSON.stringify({ userId, cryptoBalances }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      "Response from Appwrite function:",
      JSON.stringify(data, null, 2)
    );
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error calling Appwrite function:", error);
    return NextResponse.json(
      { error: "Error calling Appwrite function", details: error.message },
      { status: 500 }
    );
  }
}
