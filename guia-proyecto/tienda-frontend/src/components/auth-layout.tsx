'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const publicPaths = ['/auth/login', '/auth/register'];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isPublicPath = publicPaths.includes(pathname);

    if (!token) {
      if (!isPublicPath) {
        router.push('/auth/login');
      }
    } else if (isPublicPath) {
      router.push('/');
    }
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
