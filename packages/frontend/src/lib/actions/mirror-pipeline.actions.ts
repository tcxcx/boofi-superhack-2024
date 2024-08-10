"use server";
import { neon } from "@neondatabase/serverless";

const { NEON_DATABASE_URL: DATABASE_URL } = process.env;

export async function getUserWallets(userId: string) {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const sql = neon(DATABASE_URL);

  const wallets = await sql`
    SELECT address, chain, format 
    FROM verified_credentials 
    WHERE user_id = ${userId};`;

  return wallets;
}

export async function getUserTransactions(userId: string) {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const sql = neon(DATABASE_URL);

  const transactions = await sql`
      SELECT 
        t.user_wallet,
        u.userId,
        t.from_address,
        t.to_address,
        t.value,
        t.block_timestamp,
        t.blockchain
      FROM user_transaction_superchain_mirror t
      JOIN verified_credentials u ON t.user_wallet = u.user_wallet
      WHERE u.userId = ${userId}
      ORDER BY t.block_timestamp DESC;
    `;

  return transactions;
}
