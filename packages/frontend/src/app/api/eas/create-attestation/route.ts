import type { NextApiRequest, NextApiResponse } from "next";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

const easContractAddress = "0x4200000000000000000000000000000000000021";
const schemaUID =
  "0x928b034be58f1e4aee7a3d9ca2c6dcdd6d1c8ac0a24e43610a4aecc58d2dc295";
const schemaString =
  "string eas_contract_url,uint32 eas_score,string eas_grade,string total_attested,string loan_amount,uint64 attestation_date,uint64 expirationTime";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Here we will fetch data from our Jupyter notebook endpoint
    // where we process the data and prepare it for EAS credit score attestation for a given user
    // For this example, we'll use mock data
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
      recipient: "0x0000000000000000000000000000000000000000", // This should be set to the actual recipient address
      expirationTime: attestationData.expirationTime,
      revocable: true,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error preparing attestation data:", error);
    res.status(500).json({ message: "Error preparing attestation data" });
  }
}
