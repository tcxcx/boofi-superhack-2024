import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch"; // Use node-fetch for making HTTP requests

// Define the expected type of the response data
type ResponseData = {
  userId: string;
  defiPotentialScore: number;
  maxLoanAmount: number;
  rationale: string;
  totalAttested: number;
  timestamp: string;
  error?: string;
};

export async function POST(req: NextRequest): Promise<Response> {
  const { userId, cryptoBalances } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  console.log("Received userId:", userId);
  console.log("Received cryptoBalances:", cryptoBalances);

  try {
    const response = await fetch(process.env.APPWRITE_FUNCTION_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": process.env.APPWRITE_FUNCTION_PROJECT_ID!,
        "X-Appwrite-Key": process.env.NEXT_APPWRITE_KEY!,
      },
      body: JSON.stringify({
        userId,
        cryptoBalances: JSON.stringify(
          cryptoBalances || { totalBalanceUSD: 0 }
        ),
      }),
    });

    const responseData = (await response.json()) as ResponseData;

    if (!response.ok) {
      console.error("Serverless function error:", responseData);
      return NextResponse.json(
        {
          error: "Error executing serverless function",
          details: responseData,
        },
        { status: 500 }
      );
    }

    console.log("Function output:", responseData);

    // Validate the output format
    const expectedFields = [
      "userId",
      "defiPotentialScore",
      "maxLoanAmount",
      "rationale",
      "timestamp",
    ];
    for (const field of expectedFields) {
      if (!(field in responseData)) {
        throw new Error(`Missing expected field: ${field}`);
      }
    }

    // Return the correctly formatted JSON response
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Error communicating with serverless function:", error);
    return NextResponse.json(
      {
        error: "Error communicating with serverless function",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
