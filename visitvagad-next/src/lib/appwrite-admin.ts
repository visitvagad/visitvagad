import { Client, Databases, Storage, Users } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;

const adminClient = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

export const adminDb = new Databases(adminClient);
export const adminStorage = new Storage(adminClient);
export const adminUsers = new Users(adminClient);

export { adminClient };
