import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_ATTESTATIONS_COLLECTION_ID: ATTESTATIONS_COLLECTION_ID,
} = process.env;

interface AttestationData {
  consent: boolean;
  attestation_status: boolean;
  world_id_valid: boolean;
  eas_contract_url?: string;
  eas_score: number;
  eas_grade: string;
  total_attested: string;
  max_loan_amount: string;
  attestation_date: string;
  users: string;
}

export async function getOrCreateAttestation(
  userId: string
): Promise<{ id: string; data: AttestationData }> {
  const { database } = await createAdminClient();

  try {
    // Get the latest attestation with attestation_status set to true
    const latestAttestationResponse = await database.listDocuments(
      DATABASE_ID!,
      ATTESTATIONS_COLLECTION_ID!,
      [
        Query.equal("users", userId),
        Query.orderDesc("attestation_date"),
        Query.limit(1),
      ]
    );

    if (
      latestAttestationResponse.total > 0 &&
      latestAttestationResponse.documents[0].attestation_status === true
    ) {
      // If the latest attestation has attestation_status true, create a new one
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
          eas_score: 1,
          eas_grade: "Not Graded",
          total_attested: "0",
          max_loan_amount: "0",
        }
      );
      return {
        id: newAttestation.$id,
        data: newAttestation as unknown as AttestationData,
      };
    } else if (latestAttestationResponse.total > 0) {
      // If there is an existing attestation that is not completed, return it
      const attestation = latestAttestationResponse.documents[0];
      return {
        id: attestation.$id,
        data: attestation as unknown as AttestationData,
      };
    } else {
      // If there are no attestations, create a new one
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
          eas_score: 1,
          eas_grade: "Not Graded",
          total_attested: "0",
          max_loan_amount: "0",
        }
      );
      return {
        id: newAttestation.$id,
        data: newAttestation as unknown as AttestationData,
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

    const updatedData: Partial<AttestationData> = {
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

    const validAttributes: Partial<AttestationData> = {
      consent: updatedData.consent,
      attestation_status: updatedData.attestation_status,
      world_id_valid: updatedData.world_id_valid,
      eas_contract_url: updatedData.eas_contract_url,
      eas_score: updatedData.eas_score,
      eas_grade: updatedData.eas_grade,
      total_attested: updatedData.total_attested,
      max_loan_amount: updatedData.max_loan_amount,
      attestation_date: updatedData.attestation_date,
      users: updatedData.users,
    };

    Object.keys(validAttributes).forEach(
      (key) =>
        validAttributes[key as keyof AttestationData] === undefined &&
        delete validAttributes[key as keyof AttestationData]
    );

    const updated = await database.updateDocument(
      DATABASE_ID!,
      ATTESTATIONS_COLLECTION_ID!,
      id,
      validAttributes
    );

    // Convert the updated document to a plain object
    return JSON.parse(JSON.stringify(updated));
  } catch (error) {
    console.error(`Error updating attestation step ${step}:`, error);
    throw error;
  }
}

export async function getLatestAttestation(
  userId: string
): Promise<AttestationData | null> {
  const { database } = await createAdminClient();

  try {
    const existingAttestations = await database.listDocuments(
      DATABASE_ID!,
      ATTESTATIONS_COLLECTION_ID!,
      [
        Query.equal("users", userId),
        Query.equal("attestation_status", true),
        Query.orderDesc("attestation_date"),
        Query.limit(1),
      ]
    );

    if (existingAttestations.total > 0) {
      return existingAttestations.documents[0] as unknown as AttestationData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting latest attestation:", error);
    throw error;
  }
}

export async function getUnfinishedAttestationWithWorldIdValid(
  userId: string
): Promise<AttestationData | null> {
  const { database } = await createAdminClient();

  try {
    const existingAttestations = await database.listDocuments(
      DATABASE_ID!,
      ATTESTATIONS_COLLECTION_ID!,
      [
        Query.equal("users", userId),
        Query.equal("attestation_status", false),
        Query.equal("world_id_valid", true),
        Query.orderDesc("attestation_date"),
        Query.limit(1),
      ]
    );

    if (existingAttestations.total > 0) {
      return existingAttestations.documents[0] as unknown as AttestationData;
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      "Error getting unfinished attestation with World ID valid:",
      error
    );
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
