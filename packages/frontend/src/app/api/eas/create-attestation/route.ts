// In /api/eas/create-attestation/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

const easContractAddress = "0x4200000000000000000000000000000000000021";
const schemaUID =
  "0x928b034be58f1e4aee7a3d9ca2c6dcdd6d1c8ac0a24e43610a4aecc58d2dc295";
const schemaString =
  "string eas_contract_url,uint32 eas_score,string eas_grade,string total_attested,string loan_amount,uint64 attestation_date,uint64 expirationTime";

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  try {
    // Mock data for example
    const attestationData = {
      eas_contract_url: "https://example.com/contract",
      eas_score: 780,
      eas_grade: "A",
      total_attested: "50000",
      loan_amount: "35000",
      attestation_date: Math.floor(Date.now() / 1000),
      expirationTime: Math.floor(Date.now() / 1000) + 31536000, // 1 year from now
    };

    // Prepare the schema data
    const schemaData = [
      {
        name: "eas_contract_url",
        value: attestationData.eas_contract_url,
        type: "string",
      },
      { name: "eas_score", value: attestationData.eas_score, type: "uint32" },
      { name: "eas_grade", value: attestationData.eas_grade, type: "string" },
      {
        name: "total_attested",
        value: attestationData.total_attested,
        type: "string",
      },
      {
        name: "loan_amount",
        value: attestationData.loan_amount,
        type: "string",
      },
      {
        name: "attestation_date",
        value: attestationData.attestation_date,
        type: "uint64",
      },
      {
        name: "expirationTime",
        value: attestationData.expirationTime,
        type: "uint64",
      },
    ];

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
  } catch (error) {
    console.error("Error preparing attestation data:", error);
    return NextResponse.json(
      { message: "Error preparing attestation data" },
      { status: 500 }
    );
  }
}

// Remove the experimental edge runtime config
