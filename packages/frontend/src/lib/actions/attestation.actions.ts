import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USERS_COLLECTION_ID: USERS_COLLECTION_ID,
  APPWRITE_VERIFIED_ATTESTATIONS_COLLECTION_ID: ATTESTATIONS_COLLECTION_ID,
} = process.env;

interface AttestationData {
  consent?: boolean;
  attestation_status?: boolean;
  world_id_valid?: boolean;
  eas_contract_url?: string;
  eas_score?: number;
  eas_grade?: string;
  total_attested?: string;
  max_loan_amount?: string;
  attestation_date?: string;
}

export async function getOrCreateAttestation(
  userId: string
): Promise<{ id: string; data: AttestationData }> {
  const { database } = await createAdminClient();

  try {
    const existingAttestations = await database.listDocuments(
      DATABASE_ID!,
      ATTESTATIONS_COLLECTION_ID!,
      [Query.equal("users", userId)]
    );

    if (existingAttestations.total > 0) {
      const attestation = existingAttestations.documents[0];
      return { id: attestation.$id, data: attestation as AttestationData };
    } else {
      const newAttestation = await database.createDocument(
        DATABASE_ID!,
        ATTESTATIONS_COLLECTION_ID!,
        ID.unique(),
        {
          users: userId,
          attestation_date: new Date().toISOString(),
          consent: false,
          attestation_status: false,
          world_id_valid: false,
        }
      );
      return {
        id: newAttestation.$id,
        data: newAttestation as AttestationData,
      };
    }
  } catch (error) {
    console.error("Error getting or creating attestation:", error);
    throw error;
  }
}

export async function updateAttestationStep(
  userId: string,
  step: "consent" | "worldId" | "eas",
  data: Partial<AttestationData>
): Promise<AttestationData> {
  const { database } = await createAdminClient();

  try {
    const { id, data: existingData } = await getOrCreateAttestation(userId);

    const updatedData: AttestationData = {
      ...existingData,
      ...data,
      attestation_date: new Date().toISOString(),
    };

    switch (step) {
      case "consent":
        updatedData.consent = true;
        break;
      case "worldId":
        updatedData.world_id_valid = true;
        break;
      case "eas":
        updatedData.attestation_status = true;
        break;
    }

    const updated = await database.updateDocument(
      DATABASE_ID!,
      ATTESTATIONS_COLLECTION_ID!,
      id,
      updatedData
    );

    return updated as AttestationData;
  } catch (error) {
    console.error(`Error updating attestation step ${step}:`, error);
    throw error;
  }
}

export async function getAttestationStatus(
  userId: string
): Promise<AttestationData | null> {
  try {
    const { data } = await getOrCreateAttestation(userId);
    return data;
  } catch (error) {
    console.error("Error getting attestation status:", error);
    return null;
  }
}
