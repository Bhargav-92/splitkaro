"use client";

import { CheckCircle2, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCard } from "@/components/qr-card";
import { calculateEqualSplit } from "@/lib/split";
import { formatINR } from "@/lib/format";
import { BillFormValues } from "@/lib/validation";

interface PaymentResultsProps {
  data: BillFormValues;
  onReset: () => void;
}

export function PaymentResults({ data, onReset }: PaymentResultsProps) {
  const validPeople = data.people.filter((p) => p.name.trim());
  const split = calculateEqualSplit(data.totalAmount, validPeople.length);
  const occasion = data.occasion?.trim() || "Shared Bill";

  async function handleShare() {
    const shareText = [
      `💸 ${occasion} Bill Split`,
      `Total: ${formatINR(data.totalAmount)}`,
      `Each person pays: ${formatINR(split.perPersonAmount)}`,
      `Pay to: ${data.receiverName} (${data.receiverUpiId})`,
      `Payers: ${validPeople.map((p) => p.name).join(", ")}`,
    ].join("\n");

    if (navigator.share) {
      try {
        await navigator.share({ title: "UPI Bill Split", text: shareText });
      } catch {
        // User cancelled share — ignore
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        // TODO(security): Consider showing a modal toast instead of alert
        // Using alert is acceptable here as it's non-critical UX
      } catch {
        // Clipboard unavailable — silently ignore
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Success header */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800">
                Split created successfully
              </p>
              <p className="text-xs text-emerald-600">
                {validPeople.length} payment QR code{validPeople.length !== 1 ? "s" : ""} generated
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-1.5 border-slate-200 text-slate-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New Split
            </Button>
          </div>
        </div>

        {/* Summary chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{occasion}</Badge>
          <Badge variant="secondary">
            Total: {formatINR(data.totalAmount)}
          </Badge>
          <Badge variant="secondary">
            {validPeople.length} {validPeople.length === 1 ? "person" : "people"}
          </Badge>
          <Badge variant="success">
            Each pays: {formatINR(split.perPersonAmount)}
          </Badge>
        </div>
      </div>

      {/* QR grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {validPeople.map((person, i) => (
          <QrCard
            key={i}
            index={i}
            payerName={person.name}
            payerPhone={person.phone}
            receiverName={data.receiverName}
            receiverUpiId={data.receiverUpiId}
            amount={split.perPersonAmount}
            occasion={occasion}
          />
        ))}
      </div>

      {/* Print note */}
      <p className="text-center text-xs text-slate-400">
        Share or print these QR codes. Each person scans their own code to pay.
      </p>
    </div>
  );
}
