import { neon } from "@neondatabase/serverless";
import { createAdminClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

const { NEON_DATABASE_URL } = process.env;

const sql = neon(NEON_DATABASE_URL!);

export async function initialSync() {
  const { database } = await createAdminClient();

  try {
    // Fetch all verified credentials from Appwrite
    const credentials = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_VERIFIED_CREDENTIALS_COLLECTION_ID!,
      [Query.equal("format", "blockchain"), Query.notEqual("address", "")]
    );

    // Insert or update each record in NeonDB
    for (const document of credentials.documents) {
      const userId = document.users;

      await sql`
        INSERT INTO verified_credentials (user_id, user_wallet, format, address, chain)
        VALUES (${userId}, ${document.address}, ${document.format}, ${document.address}, ${document.chain})
        ON CONFLICT (user_wallet) DO UPDATE
        SET address = EXCLUDED.address,
            chain = EXCLUDED.chain,
            user_id = EXCLUDED.user_id;
      `;
    }

    console.log("Initial sync complete");
  } catch (error) {
    console.error("Error during initial sync:", error);
  }
}
