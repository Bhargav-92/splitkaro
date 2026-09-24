import Link from "next/link";
import { QrCode } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-slate-900 hover:text-indigo-600 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-sm">
            <QrCode className="h-4 w-4 text-white" />
          </div>
          <span className="text-base">
            Split<span className="text-indigo-600">Karo</span>
          </span>
        </Link>

        <Link
          href="/split"
          className="inline-flex h-8 items-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          Create Split
        </Link>
      </div>
    </nav>
  );
}
