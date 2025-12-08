import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col gap-12 py-16 px-8 bg-white dark:bg-black">
        <div className="flex items-center gap-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={24}
            priority
          />
          <span className="text-2xl text-zinc-400">+</span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-500">MongoDB</span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
            School Management System
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            A Next.js application with MongoDB integration for school management.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Available API Endpoints
          </h2>
          
          <div className="grid gap-4">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                GET /api/health
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Check MongoDB connection health status
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                GET /api/students
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Fetch all students from the database
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="font-mono text-sm font-semibold text-green-600 dark:text-green-400">
                POST /api/students
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Create a new student record
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                GET /api/students/[id]
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Get a specific student by ID
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="font-mono text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                PUT /api/students/[id]
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Update a student by ID
              </p>
            </div>

            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="font-mono text-sm font-semibold text-red-600 dark:text-red-400">
                DELETE /api/students/[id]
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Delete a student by ID
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 p-6">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Getting Started
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>Copy <code className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">.env.example</code> to <code className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">.env.local</code></li>
            <li>Add your MongoDB connection string to <code className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">MONGODB_URI</code></li>
            <li>Run <code className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">npm install</code> to install dependencies</li>
            <li>Run <code className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">npm run dev</code> to start the development server</li>
            <li>Visit <code className="px-1 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">/api/health</code> to verify MongoDB connection</li>
          </ol>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js Docs
          </a>
          <a
            className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            href="https://www.mongodb.com/docs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            MongoDB Docs
          </a>
        </div>
      </main>
    </div>
  );
}
