"use client";

import { formatINR } from "@/lib/format";
import { calculateEqualSplit } from "@/lib/split";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard } from "lucide-react";

interface SplitSummaryProps {
  receiverName: string;
  receiverUpiId: string;
  occasion: string;
  totalAmount: number;
  people: { name: string }[];
}

export function SplitSummary({
  receiverName,
  receiverUpiId,
  occasion,
  totalAmount,
  people,
}: SplitSummaryProps) {
  const validPeople = people.filter((p) => p.name.trim());
  const count = validPeople.length;
  const split = count > 0 && totalAmount > 0
    ? calculateEqualSplit(totalAmount, count)
    : null;

  const isEmpty = !receiverName && !totalAmount && count === 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100">
          <LayoutDashboard className="h-4 w-4 text-slate-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Bill Summary</h3>
      </div>

      {isEmpty ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-slate-400">
            Fill in your bill details to see the summary here.
          </p>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-3">
          {occasion && (
            <div className="flex items-start justify-between">
              <span className="text-xs text-slate-500">Occasion</span>
              <Badge variant="secondary" className="text-xs">
                {occasion || "Shared Bill"}
              </Badge>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Total Bill</span>
            <span className="text-sm font-bold text-slate-900">
              {totalAmount > 0 ? formatINR(totalAmount) : "—"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">People</span>
            <span className="text-sm font-semibold text-slate-800">
              {count > 0 ? count : "—"}
            </span>
          </div>

          {split && (
            <>
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2.5 border border-emerald-100">
                <span className="text-xs font-medium text-emerald-700">Per person</span>
                <span className="text-base font-bold text-emerald-700">
                  {formatINR(split.perPersonAmount)}
                </span>
              </div>
            </>
          )}

          {(receiverName || receiverUpiId) && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Receiving to
                </p>
                {receiverName && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Name</span>
                    <span className="text-sm font-semibold text-slate-800">{receiverName}</span>
                  </div>
                )}
                {receiverUpiId && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-500 shrink-0">UPI ID</span>
                    <span className="text-xs font-mono text-indigo-600 text-right break-all">
                      {receiverUpiId}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {count > 0 && validPeople.length > 0 && (
            <>
              <Separator />
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Payers
                </p>
                {validPeople.map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">{p.name}</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {split ? formatINR(split.perPersonAmount) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
