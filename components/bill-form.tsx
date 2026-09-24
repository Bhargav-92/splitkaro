"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QrCode, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ReceiverSection } from "@/components/receiver-section";
import { BillDetailsSection } from "@/components/bill-details-section";
import { PeopleList } from "@/components/people-list";
import { SplitSummary } from "@/components/split-summary";
import { EmptyState } from "@/components/empty-state";
import { PaymentResults } from "@/components/payment-results";
import { BillFormValues, billFormSchema } from "@/lib/validation";
import { saveFormToStorage, loadFormFromStorage, clearFormStorage } from "@/lib/storage";

const DEFAULT_VALUES: BillFormValues = {
  receiverName: "",
  receiverUpiId: "",
  occasion: "",
  totalAmount: 0,
  people: [{ name: "", phone: "" }],
};

export function BillForm() {
  const [results, setResults] = useState<BillFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BillFormValues>({
    // Cast resolver to any to satisfy TypeScript generic constraints
    resolver: zodResolver(billFormSchema) as any,
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const { watch, handleSubmit, reset, formState: { errors } } = form;
  const watched = watch();

  // Load persisted form on mount
  useEffect(() => {
    const saved = loadFormFromStorage();
    if (saved) {
      reset({ ...DEFAULT_VALUES, ...saved });
    }
  }, [reset]);

  // Persist form to localStorage on every change
  useEffect(() => {
    const subscription = watch((values) => {
      saveFormToStorage(values as Partial<BillFormValues>);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = useCallback(
    async (data: BillFormValues) => {
      setIsSubmitting(true);
      // Small delay to show loading state
      await new Promise((r) => setTimeout(r, 300));
      setResults(data);
      setIsSubmitting(false);
      // Scroll to results
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    },
    []
  );

  const handleReset = useCallback(() => {
    setResults(null);
    reset(DEFAULT_VALUES);
    clearFormStorage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [reset]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
      {/* LEFT: Form */}
      <div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Bill split form">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
            {/* Receiver */}
            <div className="p-6">
              <ReceiverSection form={form} />
            </div>

            {/* Bill Details */}
            <div className="p-6">
              <BillDetailsSection form={form} />
            </div>

            {/* People */}
            <div className="p-6">
              <PeopleList form={form} />
            </div>

            {/* Submit */}
            <div className="p-6 bg-slate-50/50">
              {Object.keys(errors).length > 0 && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    Please fix the errors above before generating QR codes.
                  </p>
                </div>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 text-base font-bold"
                disabled={isSubmitting}
                aria-label="Generate payment QR codes"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4" />
                    Generate Payment QR Codes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* RIGHT: Summary sidebar */}
      <div className="space-y-4">
        <SplitSummary
          receiverName={watched.receiverName}
          receiverUpiId={watched.receiverUpiId}
          occasion={watched.occasion || ""}
          totalAmount={watched.totalAmount || 0}
          people={watched.people || []}
        />

        {/* Info card */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
          <p className="text-xs font-semibold text-blue-700 mb-1.5">How it works</p>
          <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
            <li>Enter your UPI ID (you receive money)</li>
            <li>Add how much the bill is and for what</li>
            <li>Add the names of people splitting with you</li>
            <li>Generate — each person gets a unique QR</li>
            <li>They scan → UPI opens with amount pre-filled</li>
          </ol>
        </div>
      </div>

      {/* RESULTS */}
      {results && (
        <div id="results-section" className="lg:col-span-2">
          <Separator className="mb-8" />
          <PaymentResults data={results} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
