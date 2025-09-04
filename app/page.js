import fs from "fs";
import path from "path";
import Link from "next/link";

const gradients = [
  "from-pink-500 via-red-500 to-yellow-500",
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-green-400 via-blue-500 to-purple-600",
  "from-yellow-400 via-orange-500 to-red-500",
  "from-blue-400 via-teal-500 to-green-500",
  "from-purple-500 via-pink-500 to-red-500",
];

export default function Home() {
  const appDir = path.join(process.cwd(), "app");

  // Read only folders
  const folders = fs
    .readdirSync(appDir)
    .filter(
      (file) =>
        fs.statSync(path.join(appDir, file)).isDirectory() &&
        !["api", "_components", "_lib"].includes(file)
    );

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-6">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800">
        Project List
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {folders.map((folder, index) => (
          <Link
            key={folder}
            href={`/${folder}`}
            className={`group block p-8 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl text-white bg-gradient-to-r ${
              gradients[index % gradients.length]
            }`}
          >
            <h2 className="text-2xl font-bold capitalize">{folder}</h2>
            <p className="opacity-90 mt-2 text-sm">
              Explore the <span className="font-mono">{folder}</span> project.
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
