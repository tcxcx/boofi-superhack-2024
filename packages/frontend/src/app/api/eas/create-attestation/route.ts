import { NextRequest, NextResponse } from "next/server";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

const easContractAddress = "0x4200000000000000000000000000000000000021";
const schemaUID =
  "0x928b034be58f1e4aee7a3d9ca2c6dcdd6d1c8ac0a24e43610a4aecc58d2dc295";
const schemaString =
  "string eas_contract_url,uint32 eas_score,string eas_grade,string total_attested,string loan_amount,uint64 attestation_date,uint64 expirationTime";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    throw new Error("User ID is required");
  }
  console.log("User ID in create-attestation:", userId); // Add this line for debugging

  try {
    // Fetch DeFi potential data from the Jupyter Notebook
    const potentialResponse = await fetch(
      `${req.nextUrl.origin}/api/eas/potential-index`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      }
    );

    if (!potentialResponse.ok) {
      throw new Error("Failed to fetch DeFi potential data");
    }

    const potentialData = await potentialResponse.json();
    console.log("Potential Data:", potentialData);

    if (
      !potentialData ||
      typeof potentialData.defiPotentialScore === "undefined"
    ) {
      throw new Error("Invalid DeFi potential data received");
    }

    // Debug: Log the received data
    console.log("Received DeFi potential data:", potentialData);

    // Use potentialData.maxLoanAmount instead of maxParticipationAmount
    const attestationData = {
      eas_contract_url:
        "https://base-sepolia.easscan.org/attestation/view/{attestationUID}",
      eas_score: potentialData.defiPotentialScore,
      eas_grade: getGrade(potentialData.defiPotentialScore),
      total_attested: potentialData.totalAttested.toString(),
      loan_amount: potentialData.maxLoanAmount, // 70% of max loan amount, rounded to 2 decimal places
      attestation_date: Math.floor(Date.now() / 1000),
      expirationTime: Math.floor(Date.now() / 1000) + 31536000, // 1 year from now
    };

    // Debug: Log the prepared attestation data
    console.log("Prepared attestation data:", attestationData);

    // Prepare the schema data
    const schemaData = Object.entries(attestationData).map(([name, value]) => ({
      name,
      value: value.toString(), // Ensure all values are strings
      type:
        name.includes("Time") || name === "attestation_date"
          ? "uint64"
          : name === "eas_score"
          ? "uint32"
          : "string",
    }));

    // Initialize SchemaEncoder and encode the data
    const schemaEncoder = new SchemaEncoder(schemaString);
    const encodedData = schemaEncoder.encodeData(schemaData);

    // Prepare the response
    const response = {
      easContractAddress,
      schemaUID,
      schemaString,
      schemaData,
      encodedData,
      recipient: "0x0000000000000000000000000000000000000000",
      expirationTime: attestationData.expirationTime,
      revocable: true,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error preparing attestation data:", error);
    return NextResponse.json(
      { message: "Error preparing attestation data", error: error.message },
      { status: 500 }
    );
  }
}

function getGrade(score: number): string {
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  if (score >= 600) return "Poor";
  return "Very Poor";
}
