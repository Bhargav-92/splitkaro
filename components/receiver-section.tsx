"use client";

import { UseFormReturn } from "react-hook-form";
import { User, CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BillFormValues } from "@/lib/validation";

interface ReceiverSectionProps {
  form: UseFormReturn<BillFormValues>;
}

export function ReceiverSection({ form }: ReceiverSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50">
          <User className="h-4 w-4 text-indigo-600" />
        </div>
        <h2 className="text-base font-semibold text-slate-800">
          Your Details
        </h2>
        <span className="ml-auto text-xs text-slate-400">
          Money comes to you
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="receiverName">Your Name</Label>
          <Input
            id="receiverName"
            placeholder="e.g., Amit"
            {...register("receiverName")}
            aria-describedby={errors.receiverName ? "receiverName-error" : undefined}
            aria-invalid={!!errors.receiverName}
          />
          {errors.receiverName && (
            <p id="receiverName-error" className="text-xs text-red-500" role="alert">
              {errors.receiverName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="receiverUpiId">
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-slate-500" />
              Your UPI ID
            </span>
          </Label>
          <Input
            id="receiverUpiId"
            placeholder="name@upi, mobile@paytm…"
            autoComplete="off"
            {...register("receiverUpiId")}
            aria-describedby={errors.receiverUpiId ? "receiverUpiId-error" : undefined}
            aria-invalid={!!errors.receiverUpiId}
          />
          {errors.receiverUpiId ? (
            <p id="receiverUpiId-error" className="text-xs text-red-500" role="alert">
              {errors.receiverUpiId.message}
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              People will scan a QR that sends money to this ID
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
