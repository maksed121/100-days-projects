"use client";
import path from "path";
import Link from "next/link";
import { Folder } from "lucide-react"; // pretty folder icon
import { fstat } from "fs";

export default function Home() {
  const appDir = path.join(process.cwd(), "app");

  const subDirs = fstat
    .readdirSync(appDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => !name.startsWith("(") && !name.startsWith("_"));

  return (
    <div className="w-full md:w-[50%] mx-auto p-6 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl shadow-2xl border border-zinc-700 mt-4">
      <h1 className="text-3xl font-extrabold text-white mb-6 flex items-center gap-2">
        🚀 Projects
      </h1>

      <div className="grid gap-4">
        {subDirs.map((dir, index) => (
          <Link
            key={dir}
            href={`/${dir}`}
            className="group flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 hover:bg-sky-900/30 hover:border-sky-500 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <Folder className="text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-medium text-white group-hover:text-sky-300">
                {index + 1}. {dir}
              </span>
            </div>
            <span className="text-sm text-zinc-400 group-hover:text-sky-400">
              View →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
