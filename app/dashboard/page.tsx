'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardStats {
  total_practice_time: number;
  total_sessions: number;
  current_streak: number;
  achievements_count: number;
  overall_progress: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    async function fetchDashboardData() {
      if (!user) return;
      
      try {
        const response = await fetch('/api/dashboard', {
          headers: {
            'x-firebase-uid': user.uid,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        } else {
          const error = await response.json();
          console.error('Dashboard API error:', error);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              OpenSourceTutor
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {user?.displayName || user?.email}
              </span>
              <Link href="/about" className="hover:text-blue-300">
                About
              </Link>
              <Link href="/practice" className="hover:text-blue-300">
                Practice
              </Link>
              <Link href="/dashboard" className="hover:text-blue-300">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-1 container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-8">
            Welcome back, {user?.displayName || 'Student'}! 👋
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading your progress...</p>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold mb-2">
                    {stats?.total_sessions || 0}
                  </div>
                  <div className="text-sm opacity-90">Practice Sessions</div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold mb-2">
                    {stats ? formatTime(stats.total_practice_time) : '0m'}
                  </div>
                  <div className="text-sm opacity-90">Practice Time</div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold mb-2">
                    {stats?.current_streak || 0} 🔥
                  </div>
                  <div className="text-sm opacity-90">Day Streak</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold mb-2">
                    {stats?.achievements_count || 0} 🏆
                  </div>
                  <div className="text-sm opacity-90">Achievements</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <Link
                  href="/practice"
                  className="border-2 border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 p-8 rounded-lg transition group"
                >
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-blue-600">
                    🎹 Start Practice Session
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Jump into a new practice session and improve your jazz harmony skills
                  </p>
                </Link>

                <div className="border p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4">📊 Your Progress</h2>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{stats?.overall_progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${stats?.overall_progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Areas */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4">🎵 Blue Notes</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Master the use of blue notes in jazz improvisation
                  </p>
                  <div className="text-sm text-gray-500">Level 1</div>
                </div>

                <div className="border p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4">🎼 Functional Harmony</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Understand chord functions and progressions
                  </p>
                  <div className="text-sm text-gray-500">Level 1</div>
                </div>

                <div className="border p-6 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4">👁️ Sight Reading</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Improve your ability to read music at first sight
                  </p>
                  <div className="text-sm text-gray-500">Level 1</div>
                </div>
              </div>
            </>
          )}
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            OpenSourceTutor - Open Source Music Education Initiative
          </p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
