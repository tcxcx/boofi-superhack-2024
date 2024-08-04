"use server";

import { createAdminClient } from "@/lib/appwrite";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USERS_COLLECTION_ID: USERS_COLLECTION_ID,
} = process.env;

export async function verifyWorldId(
  verificationLevel: string,
  dynamicUserId: string
) {
  const { database } = await createAdminClient();

  try {
    let sessionLevel = 1;
    if (verificationLevel === "device" || verificationLevel === "orb") {
      sessionLevel = 2;
    }

    const updatedUser = await database.updateDocument(
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      dynamicUserId,
      {
        worldIdVerified: true,
        verificationLevel: verificationLevel,
        sessionLevel: sessionLevel,
        updatedAt: new Date().toISOString(),
      }
    );

    console.log("WorldID verification status updated in the database");
    return updatedUser;
  } catch (error) {
    console.error("Error updating user WorldID verification:", error);
    throw error;
  }
}

export async function getUserVerificationStatus(userId: string) {
  const { database } = await createAdminClient();

  try {
    const user = await database.getDocument(
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      userId
    );

    return user;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    console.error("Error fetching user verification status:", error);
    throw error;
  }
}
