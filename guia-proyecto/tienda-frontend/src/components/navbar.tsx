'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { CartIcon } from './icons';
import { getCart } from '@/app/cart/cart.api';

interface User {
  name: string;
  email: string;
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const updateUserAndCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      setUser(JSON.parse(userStr));
      try {
        const cart = await getCart();
        setCartItemsCount(cart.items.length);
      } catch (error) {
        console.error('Failed to load cart:', error);
        setCartItemsCount(0);
      }
    } else {
      setUser(null);
      setCartItemsCount(0);
    }
  }, []);

  useEffect(() => {
    updateUserAndCart();
    window.addEventListener('storage', updateUserAndCart);

    return () => {
      window.removeEventListener('storage', updateUserAndCart);
    };
  }, [updateUserAndCart]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setCartItemsCount(0);
    router.push('/auth/login');
  };

  // No mostrar la navbar en las páginas de autenticación
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Tienda Online</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Welcome, {user.name}</span>
                <Link href="/cart" className="relative">
                  <Button variant="ghost" className="p-2">
                    <CartIcon className="w-6 h-6" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="default">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
