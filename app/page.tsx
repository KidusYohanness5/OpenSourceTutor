import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">OpenSourceTutor</h1>
          <div className="space-x-4">
            <Link href="/about" className="hover:text-blue-300">About</Link>
            <Link href="/practice" className="hover:text-blue-300">Practice</Link>
            <Link href="/dashboard" className="hover:text-blue-300">Dashboard</Link>
            <Link href="/auth" className="hover:text-blue-300">Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">
            Master Jazz Theory & Sight-Reading
          </h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            AI-powered music education accessible to everyone. Learn jazz harmony,
            blue notes, and functional harmony with real-time feedback.
          </p>
          
          <div className="space-x-4">
            <Link 
              href="/auth"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started Free
            </Link>
            <Link 
              href="/practice"
              className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            >
              Try Demo
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl font-bold mb-3">🎹 MIDI Support</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect your MIDI keyboard or use our browser piano for practice
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl font-bold mb-3">🎵 Jazz Harmony</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Learn blue notes, chord progressions, and functional harmony
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-2xl font-bold mb-3">📊 Track Progress</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your improvement with detailed analytics
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          OpenSourceTutor - Open Source Music Education Initiative
        </p>
      </footer>
    </div>
  );
}
