import { ID, Query, Databases } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { createDwollaCustomer } from "./dwolla.actions";
import { extractCustomerIdFromUrl } from "@/utils"; // Ensure you have this utility function
import { createOrUpdateAppwriteAuthUser } from "./user.actions";
import { CombinedUserProfile } from "@/lib/types/dynamic";
import { parseStringify } from "@/utils";
const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USERS_COLLECTION_ID: USERS_COLLECTION_ID,
  APPWRITE_VERIFIED_CREDENTIALS_COLLECTION_ID:
    VERIFIED_CREDENTIALS_COLLECTION_ID,
} = process.env;

async function upsertDocument(
  database: Databases,
  databaseId: string,
  collectionId: string,
  documentId: string,
  data: any
) {
  try {
    await database.getDocument(databaseId, collectionId, documentId);
    return await database.updateDocument(
      databaseId,
      collectionId,
      documentId,
      data
    );
  } catch (error: any) {
    if (error.code === 404) {
      return await database.createDocument(
        databaseId,
        collectionId,
        documentId,
        data
      );
    }
    throw error;
  }
}

export async function createUserOrUpdate(userData: DynamicUser) {
  const { database } = await createAdminClient();

  let newUserAccount;

  try {
    await createOrUpdateAppwriteAuthUser(userData);

    newUserAccount = await upsertDocument(
      database,
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      userData.id,
      {
        email: userData.email || "vitalik@example.com",
        firstName: userData.firstName || "Vitalik",
        lastName: userData.lastName || "Buterin",
        phoneNumber: userData.phoneNumber || "+1(555)555-5555",
        firstVisit: userData.firstVisit,
        lastVisit: userData.lastVisit,
        newUser: userData.newUser || false,
        updatedAt: new Date().toISOString(),
      }
    );

    if (!newUserAccount) throw new Error("Error creating user");

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
      address1: "123 Main St",
      city: "Anytown",
      state: "FL",
      postalCode: "12345",
      dateOfBirth: "1970-01-01",
      ssn: "1234",
    });

    if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    newUserAccount = await upsertDocument(
      database,
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      userData.id,
      {
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );

    for (const credential of userData.verifiedCredentials) {
      await upsertDocument(
        database,
        DATABASE_ID!,
        VERIFIED_CREDENTIALS_COLLECTION_ID!,
        credential.id,
        {
          users: userData.id,
          address: credential.address,
          chain: credential.chain,
          format: credential.format,
          publicIdentifier: credential.publicIdentifier,
          lastSelectedAt: credential.lastSelectedAt,
          walletName: credential.walletName,
          walletProvider: credential.walletProvider,
          oauthProvider: credential.oauthProvider,
          oauthUsername: credential.oauthUsername,
          oauthDisplayName: credential.oauthDisplayName,
          oauthAccountId: credential.oauthAccountId,
        }
      );
    }

    return newUserAccount;
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error;
  }
}

export async function getUser(userId: string) {
  const { database } = await createAdminClient();

  const user = await database.getDocument(
    DATABASE_ID!,
    USERS_COLLECTION_ID!,
    userId
  );
  const credentials = await database.listDocuments(
    DATABASE_ID!,
    VERIFIED_CREDENTIALS_COLLECTION_ID!,
    [Query.equal("users", userId)]
  );

  // Fetch wallet properties for each credential
  const credentialsWithProperties = await Promise.all(
    credentials.documents.map(async (credential) => {
      return {
        ...credential,
        walletProperties: credential.walletProperties || {},
      };
    })
  );

  return {
    ...user,
    verifiedCredentials: credentialsWithProperties,
    worldIdVerified: user.worldIdVerified,
  };
}

export async function getUserFromAppwrite(userId: string) {
  const { database } = await createAdminClient();

  try {
    const user = await database.getDocument(
      DATABASE_ID!,
      USERS_COLLECTION_ID!,
      userId
    );

    const parsedUser = parseStringify(user);

    return parsedUser;
  } catch (error: any) {
    console.error("Error fetching user from Appwrite:", error);
    if (error.code) {
      console.error("Error code:", error.code);
    }
    return null;
  }
}

// Queue to hold pending user actions
const userActionQueue: Map<string, DynamicUser> = new Map();
let processingQueue = false;

export const queueUserAction = (userData: DynamicUser) => {
  userActionQueue.set(userData.id, userData);
  processQueue();
};

const processQueue = () => {
  if (processingQueue) return;

  processingQueue = true;

  setTimeout(async () => {
    for (const [userId, userData] of userActionQueue) {
      try {
        await createUserOrUpdate(userData);
        userActionQueue.delete(userId);
      } catch (error) {
        console.error(`Failed to process user ${userId}:`, error);
      }
    }

    processingQueue = false;
  }, 1000); // Adjust timeout duration as needed
};
