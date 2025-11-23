'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import type { UserResponse } from '@/schemas/api';

// ============================================================================
// useRequireAdmin Hook
// ============================================================================

/**
 * Hook that ensures the user is authenticated AND has admin role before accessing a page.
 * Redirects to /login if not authenticated.
 * Redirects to / (home) if authenticated but not an admin.
 * Shows loading state while checking authentication.
 *
 * @returns The current authenticated admin user
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * export default function AdminDashboard() {
 *   const admin = useRequireAdmin();
 *
 *   if (!admin) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   return <div>Admin Dashboard - Welcome, {admin.full_name}!</div>;
 * }
 * ```
 */
export function useRequireAdmin(): UserResponse | null {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to initialize
    if (loading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    // Redirect to home if authenticated but not admin
    if (isAuthenticated && !isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // Return null while loading or redirecting
  if (loading || !isAuthenticated || !isAdmin) {
    return null;
  }

  return user;
}
