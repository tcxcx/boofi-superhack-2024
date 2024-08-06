import { NextRequest, NextResponse } from "next/server";
import { getAccounts } from "@/lib/actions/bank.actions";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  try {
    // Fetching bank accounts
    const accountsData = await getAccounts({ userId });

    // For now, we'll return only bank account data
    // Crypto balances should be handled client-side
    const financialData = {
      bankAccounts: accountsData,
    };

    return NextResponse.json(financialData);
  } catch (error) {
    console.error("Error fetching financial data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
