'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import type { UserResponse } from '@/schemas/api';

// ============================================================================
// useRequireAuth Hook
// ============================================================================

/**
 * Hook that ensures the user is authenticated before accessing a page.
 * Redirects to /login if not authenticated.
 * Shows loading state while checking authentication.
 *
 * @returns The current authenticated user
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * export default function ProfilePage() {
 *   const user = useRequireAuth();
 *
 *   if (!user) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return <div>Welcome, {user.full_name}!</div>;
 * }
 * ```
 */
export function useRequireAuth(): UserResponse | null {
  const { user, isAuthenticated, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to initialize
    if (initializing) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, initializing, router]);

  // Return null while initializing or redirecting
  if (initializing || !isAuthenticated) {
    return null;
  }

  return user;
}
