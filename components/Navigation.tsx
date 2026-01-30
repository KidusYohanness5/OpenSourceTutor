'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          OpenSourceTutor
        </Link>
        <div className="flex items-center space-x-4">
          {/* Show loading state or user info */}
          {loading ? (
            <div className="w-32 h-8 bg-gray-700 animate-pulse rounded"></div>
          ) : (
            <>
              {user && (
                <span className="text-sm hidden md:block">
                  {user.displayName || user.email}
                </span>
              )}
              <Link href="/about" className="hover:text-blue-300">
                About
              </Link>
              <Link href="/practice" className="hover:text-blue-300">
                Practice
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="hover:text-blue-300">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth" className="hover:text-blue-300">
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}