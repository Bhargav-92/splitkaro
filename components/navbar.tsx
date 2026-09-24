import Link from "next/link";
import { SplitSquareVertical } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 hover:text-indigo-600 transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <SplitSquareVertical className="h-4 w-4 text-white" />
          </div>
          <span>UPI Splitter</span>
        </Link>
        <Link
          href="/split"
          className="inline-flex h-8 items-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Create Split
        </Link>
      </div>
    </nav>
  );
}
