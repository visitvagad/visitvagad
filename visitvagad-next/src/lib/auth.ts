'use server';

import { cookies } from 'next/headers';
import { Client, Account } from 'node-appwrite';
import { adminUsers } from '@/lib/appwrite-admin';
import type { UserRole } from '@/types/cms';

const SESSION_COOKIE = process.env.AUTH_COOKIE_NAME || 'visitvagad_session';

/** Create a server-side Appwrite client using the session cookie */
async function createSessionClient() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setSession(session);

  return { client, account: new Account(client) };
}

/** Get current authenticated user or null */
export async function getUser() {
  try {
    const sessionClient = await createSessionClient();
    if (!sessionClient) return null;
    const user = await sessionClient.account.get();
    return user;
  } catch {
    return null;
  }
}

/** Get user role from Appwrite labels */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await getUser();
  if (!user) return null;

  // Appwrite stores labels as string array on user
  const labels = user.labels || [];
  if (labels.includes('admin')) return 'admin';
  if (labels.includes('editor')) return 'editor';
  return null;
}

/** Require authentication — throws if not authenticated */
export async function requireAuth() {
  const user = await getUser();
  if (!user) throw new Error('UNAUTHORIZED');
  const role = await getUserRole();
  if (!role) throw new Error('FORBIDDEN');
  return { user, role };
}

/** Require specific role */
export async function requireRole(requiredRole: UserRole) {
  const { user, role } = await requireAuth();
  if (requiredRole === 'admin' && role !== 'admin') {
    throw new Error('FORBIDDEN');
  }
  return { user, role };
}

/** Login with email/password — sets session cookie */
export async function login(email: string, password: string) {
  const { Account, Client } = await import('node-appwrite');

  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

  const account = new Account(client);
  const session = await account.createEmailPasswordSession(email, password);

  // Verify user has admin/editor role
  const userClient = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setSession(session.secret);

  const userAccount = new Account(userClient);
  const user = await userAccount.get();
  const labels = user.labels || [];

  if (!labels.includes('admin') && !labels.includes('editor')) {
    // Delete session if user has no valid role
    await userAccount.deleteSession(session.$id);
    throw new Error('FORBIDDEN');
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { userId: user.$id, role: labels.includes('admin') ? 'admin' : 'editor' };
}

/** Logout — clears session cookie and deletes Appwrite session */
export async function logout() {
  try {
    const sessionClient = await createSessionClient();
    if (sessionClient) {
      await sessionClient.account.deleteSession('current');
    }
  } catch {
    // Session may already be expired
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Get session info for middleware (lightweight check) */
export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}
