import env from "@/app/env";
import { Client, Databases, Users, Storage, Avatars } from "node-appwrite";

/**
 * Initializes the Appwrite client for server-side SDK usage.
 * Uses the API key (server key) for full access.
 */
const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // Example: https://fra.cloud.appwrite.io/v1
  .setProject(env.appwrite.projectId)
  .setKey(env.appwrite.apikey);

// Export initialized Appwrite services
export const databases = new Databases(client);
export const users = new Users(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export default client;
