import { NextRequest, NextResponse } from "next/server";
import {
  getAttestationStatus,
  updateAttestationStep,
  getLatestAttestation,
  getUnfinishedAttestationWithWorldIdValid,
} from "@/lib/actions/attestation.actions";

export async function POST(request: NextRequest) {
  const { userId, action, step, data } = await request.json();

  try {
    if (action === "getStatus") {
      const status = await getAttestationStatus(userId);
      return NextResponse.json(status);
    } else if (action === "updateStep") {
      const updatedStatus = await updateAttestationStep(userId, step, data);
      return NextResponse.json(updatedStatus);
    } else if (action === "getLatestAttestation") {
      const latestAttestation = await getLatestAttestation(userId);
      return NextResponse.json(latestAttestation);
    } else if (action === "getUnfinishedAttestationWithWorldIdValid") {
      const attestation = await getUnfinishedAttestationWithWorldIdValid(
        userId
      );
      return NextResponse.json(attestation);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
