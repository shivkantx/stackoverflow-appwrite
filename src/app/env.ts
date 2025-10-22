// src/app/env.ts
const env = {
  appwrite: {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_HOST_URL!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    apikey: process.env.APPWRITE_API_KEY!, // server key (do not expose to client)
  },
};

export default env;
