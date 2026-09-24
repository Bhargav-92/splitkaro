import { QrCode } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
        <QrCode className="h-7 w-7 text-slate-400" />
      </div>
      <h3 className="mb-1 text-sm font-semibold text-slate-700">
        Your payment QR codes will appear here
      </h3>
      <p className="max-w-xs text-xs text-slate-400">
        Fill in your details and click{" "}
        <span className="font-medium text-indigo-600">Generate Payment QR Codes</span>{" "}
        to create individual payment QR codes for each person.
      </p>
    </div>
  );
}
