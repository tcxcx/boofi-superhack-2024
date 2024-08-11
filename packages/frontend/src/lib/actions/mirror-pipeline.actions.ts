"use server";
import { neon } from "@neondatabase/serverless";
import { createAdminClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

const {
  NEON_DATABASE_URL: DATABASE_URL,
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_WALLETS_COLLECTION_ID: WALLET_COLLECTION_ID,
  APPWRITE_VERIFIED_CREDENTIALS_COLLECTION_ID:
    VERIFIED_CREDENTIALS_COLLECTION_ID,
} = process.env;
const sql = neon(DATABASE_URL!);

export const getUserWallets = async (userId: string) => {
  try {
    const { database } = await createAdminClient();

    const wallets = await database.listDocuments(
      DATABASE_ID!,
      WALLET_COLLECTION_ID!,
      [Query.equal("key", userId)]
    );

    const verifiedCredentials = await database.listDocuments(
      DATABASE_ID!,
      VERIFIED_CREDENTIALS_COLLECTION_ID!,
      [Query.equal("users", userId), Query.equal("format", "blockchain")]
    );

    const walletAddresses = [
      ...wallets.documents.map((wallet) => wallet.wallet_address),
      ...verifiedCredentials.documents.map((cred) => cred.address),
    ];

    return walletAddresses;
  } catch (error) {
    console.error("Error fetching user wallets:", error);
    throw error;
  }
};

export const getUserTransactions = async (wallets: string[]) => {
  try {
    const walletsList = wallets.map((wallet) => `'${wallet}'`).join(", ");

    const query = `
      SELECT from_address, to_address, value, block_timestamp
      FROM (
        SELECT from_address, to_address, value, block_timestamp FROM base_receipt_transactions
        WHERE from_address IN (${walletsList}) 
        OR to_address IN (${walletsList})
        UNION ALL
        SELECT from_address, to_address, value, block_timestamp FROM optimism_receipt_transactions
        WHERE from_address IN (${walletsList}) 
        OR to_address IN (${walletsList})
      ) AS all_transactions
      ORDER BY block_timestamp DESC;
    `;

    const transactions = await sql(query);

    return transactions;
  } catch (error) {
    console.error("Error fetching user transactions from NeonDB:", error);
    throw error;
  }
};
