'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-text-muted hover:text-red-600 transition-colors"
    >
      Sign out
    </button>
  );
}
