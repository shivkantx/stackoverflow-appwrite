// src/models/server/config.ts
import env from "@/app/env";
import { Client, Databases, Users, Storage, Avatars } from "node-appwrite";

const client = new Client()
  .setEndpoint(env.appwrite.endpoint) // e.g. https://fra.cloud.appwrite.io/v1
  .setProject(env.appwrite.projectId)
  .setKey(env.appwrite.apikey); // server key: APPWRITE_API_KEY

export const databases = new Databases(client);
export const users = new Users(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
