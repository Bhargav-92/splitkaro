"use client";

import { UseFormReturn } from "react-hook-form";
import { Receipt } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BillFormValues } from "@/lib/validation";
import { formatINR } from "@/lib/format";
import { calculateEqualSplit } from "@/lib/split";

interface BillDetailsSectionProps {
  form: UseFormReturn<BillFormValues>;
}

export function BillDetailsSection({ form }: BillDetailsSectionProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const totalAmount = watch("totalAmount");
  const people = watch("people");
  const count = people?.filter((p) => p.name.trim()).length || 0;

  const split = count > 0 && totalAmount > 0
    ? calculateEqualSplit(totalAmount, count)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-50">
          <Receipt className="h-4 w-4 text-violet-600" />
        </div>
        <h2 className="text-base font-semibold text-slate-800">Bill Details</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="occasion">Occasion</Label>
          <Input
            id="occasion"
            placeholder="Dinner Party, Trip, Birthday…"
            {...register("occasion")}
          />
          <p className="text-xs text-slate-400">Optional — defaults to "Shared Bill"</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="totalAmount">Total Bill Amount (₹)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium select-none">
              ₹
            </span>
            <Input
              id="totalAmount"
              type="number"
              min="1"
              step="0.01"
              placeholder="4000"
              className="pl-7"
              {...register("totalAmount", { valueAsNumber: true })}
              aria-describedby={errors.totalAmount ? "totalAmount-error" : undefined}
              aria-invalid={!!errors.totalAmount}
            />
          </div>
          {errors.totalAmount && (
            <p id="totalAmount-error" className="text-xs text-red-500" role="alert">
              {errors.totalAmount.message}
            </p>
          )}
        </div>
      </div>

      {/* Live split preview */}
      {split && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-emerald-700">
              <span className="font-medium">{formatINR(totalAmount)}</span>
              {" ÷ "}
              <span className="font-medium">{count}</span>
              {" people"}
            </div>
            <div className="text-right">
              <p className="text-xs text-emerald-600 font-medium">Each person pays</p>
              <p className="text-lg font-bold text-emerald-700">
                {formatINR(split.perPersonAmount)}
              </p>
            </div>
          </div>
          {split.remainderPaise > 0 && (
            <p className="mt-1 text-xs text-emerald-600">
              Note: ₹{(split.remainderPaise / 100).toFixed(2)} remainder due to rounding — individual QR amounts show equal shares.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
