'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Loading from './Loading';

/**
 * Protected Route Component
 * 인증이 필요한 페이지를 감싸는 컴포넌트
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // 로딩 중
  if (loading) {
    return <Loading fullScreen text="인증 확인 중..." />;
  }

  // 인증되지 않음
  if (!user) {
    return null;
  }

  // 인증됨
  return <>{children}</>;
}
