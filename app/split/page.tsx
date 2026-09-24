import type { Metadata } from "next";
import { BillForm } from "@/components/bill-form";

export const metadata: Metadata = {
  title: "Create a Bill Split — SplitKaro",
  description:
    "Enter your UPI ID, add people, and generate individual payment QR codes instantly.",
};

export default function SplitPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Split the bill.{" "}
          <span className="text-indigo-600">Share the payment.</span>
        </h1>
        <p className="mt-2 text-slate-500">
          Create individual UPI payment QR codes in seconds.
        </p>
      </div>

      <BillForm />
    </div>
  );
}
