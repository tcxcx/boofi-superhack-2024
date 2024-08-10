import type { NextApiRequest, NextApiResponse } from "next";
import { initialSync } from "@/lib/actions/sync-db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await initialSync();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Sync failed:", error);
    res.status(500).json({ error: "Sync failed" });
  }
}
