import { SplitSquareVertical } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <SplitSquareVertical className="h-4 w-4 text-indigo-600" />
            UPI Splitter
          </div>
          <p className="text-sm text-slate-500">
            Simple bill splitting for everyday payments.
          </p>
          <p className="max-w-md text-xs text-slate-400">
            UPI payment handling is performed by your UPI app. This application
            only generates a payment request QR code. Always verify the
            receiver name and amount before authorizing any transaction.
          </p>
        </div>
      </div>
    </footer>
  );
}
