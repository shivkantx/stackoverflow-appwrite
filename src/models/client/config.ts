import env from "@/app/env";
import { Client, Account, Avatars, Databases, Storage } from "appwrite";

// Initialize client
const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // from env.ts
  .setProject(env.appwrite.projectId); // from env.ts

// Initialize services
const account = new Account(client);
const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export default { client, databases, account, avatars, storage };
