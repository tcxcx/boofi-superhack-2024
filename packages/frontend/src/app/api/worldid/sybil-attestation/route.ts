import { NextRequest, NextResponse } from "next/server";
import { updateAttestationStep } from "@/lib/actions/attestation.actions";

const verifyEndpoint = `${process.env.NEXT_PUBLIC_WLD_API_BASE_URL}/${process.env.NEXT_PUBLIC_WLD_APP_ID}`;

export async function POST(req: NextRequest) {
  try {
    const {
      nullifier_hash,
      merkle_root,
      proof,
      verification_level,
      action,
      signal,
      userId,
    } = await req.json();

    console.log("Received data:", {
      nullifier_hash,
      merkle_root,
      proof,
      verification_level,
      action,
      signal,
      userId,
    });

    if (
      !nullifier_hash ||
      !merkle_root ||
      !proof ||
      !verification_level ||
      !action ||
      !userId
    ) {
      console.error("Missing required fields in the request body.");
      return NextResponse.json(
        {
          code: "bad_request",
          detail: "Missing required fields in the request body.",
        },
        { status: 400 }
      );
    }

    const reqBody = {
      nullifier_hash,
      merkle_root,
      proof,
      verification_level,
      action,
      signal,
    };

    console.log("Sending request to World ID /verify endpoint:", reqBody);

    const verifyRes = await fetch(verifyEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    const wldResponse = await verifyRes.json();

    console.log(
      `Received ${verifyRes.status} response from World ID /verify endpoint:`,
      wldResponse
    );

    if (verifyRes.status === 200) {
      console.log(
        "Credential verified! This user's nullifier hash is: ",
        wldResponse.nullifier_hash
      );

      // Update the attestations table
      const updatedAttestation = await updateAttestationStep(
        userId,
        "worldId",
        {
          world_id_valid: true,
        }
      );

      return NextResponse.json(
        {
          code: "success",
          detail: "This action verified correctly!",
          verification_level: verification_level,
          attestation: updatedAttestation,
        },
        { status: 200 }
      );
    } else {
      console.error(
        `Verification failed with status ${verifyRes.status}:`,
        wldResponse
      );
      return NextResponse.json(
        {
          code: wldResponse.code,
          detail: wldResponse.detail,
        },
        { status: verifyRes.status }
      );
    }
  } catch (error) {
    console.error("Error verifying credential:", error);
    return NextResponse.json(
      {
        code: "internal_server_error",
        detail: "An error occurred while verifying the credential.",
      },
      { status: 500 }
    );
  }
}
