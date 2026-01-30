import Navigation from "@/components/Navigation";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">About OpenSourceTutor</h1>
        
        <div className="prose dark:prose-invert max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="mb-6">
            OpenSourceTutor aims to democratize music education by providing 
            AI-powered instruction in jazz theory and sight-reading to schools 
            with limited funding for arts programs.
          </p>

          <h2 className="text-2xl font-bold mb-4">Tech for Social Good</h2>
          <p className="mb-6">
            Built with cutting-edge technology (Gemini AI, React, TypeScript, PostgreSQL), 
            this platform makes professional-level music instruction accessible to everyone, 
            regardless of economic background.
          </p>

          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Real-time feedback on jazz harmony and blue note usage</li>
            <li>MIDI keyboard integration for authentic practice</li>
            <li>Browser-based piano for accessibility</li>
            <li>Progress tracking and personalized learning paths</li>
            <li>Free for schools and individual learners</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Open Source</h2>
          <p className="mb-6">
            This project is open source and welcomes contributions from developers, 
            musicians, and educators passionate about music education.
          </p>
        </div>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          OpenSourceTutor - Open Source Music Education Initiative
        </p>
      </footer>
    </div>
  );
}