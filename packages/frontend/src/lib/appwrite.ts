"use server";

import { Client, Account, Databases, Users } from "node-appwrite";
import { cookies } from "next/headers";
import { useLocale } from "next-intl";
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = cookies().get("appwrite-session");

  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createAdminClient() {
  console.log("Creating admin client");
  console.log("Endpoint:", process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
  console.log("Project:", process.env.NEXT_PUBLIC_APPWRITE_PROJECT);
  console.log("API Key set:", !!process.env.NEXT_APPWRITE_KEY);

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get user() {
      return new Users(client);
    },
  };
}
