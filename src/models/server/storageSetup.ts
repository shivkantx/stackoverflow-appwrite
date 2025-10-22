"use server";

import { storage } from "./config";
import { questionAttachmentBucket } from "../name";
import { Permission, Role } from "node-appwrite";

/**
 * Ensures that the storage bucket for question attachments exists.
 * Creates it if missing, with secure permissions and useful defaults.
 */
export default async function getOrCreateStorage() {
  try {
    // Try to get the existing bucket
    await storage.getBucket(questionAttachmentBucket);
    console.log(
      `✅ Storage bucket "${questionAttachmentBucket}" already exists.`
    );
  } catch {
    try {
      console.log(
        `🚀 Creating new storage bucket: "${questionAttachmentBucket}" ...`
      );

      await storage.createBucket(
        questionAttachmentBucket, // bucketId
        questionAttachmentBucket, // name
        [
          Permission.create(Role.users()), // logged-in users can upload
          Permission.read(Role.any()), // everyone can view
          Permission.update(Role.user("owner")), // owner can update
          Permission.delete(Role.user("owner")), // owner can delete
        ],
        false, // fileSecurity -> false = public files
        undefined,
        undefined,
        ["jpg", "png", "gif", "jpeg", "webp", "heic", "pdf"]
      );

      console.log(
        `✅ Storage bucket "${questionAttachmentBucket}" created successfully.`
      );
    } catch (error) {
      console.error("❌ Error creating storage bucket:", error);
    }
  }
}
