import Link from "next/link";
import { ArrowRight, QrCode, Receipt, Smartphone, Users } from "lucide-react";
import { formatINR } from "@/lib/format";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.07) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Left copy */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700">
                <QrCode className="h-3.5 w-3.5" />
                Free · No sign-up needed
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl leading-tight">
                Split bills without the awkward math.
              </h1>

              <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-lg">
                Add the bill, add your people, and generate a personal UPI QR
                code for everyone. They scan — money comes to you. Simple.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/split"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                >
                  Create a Split
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="text-sm text-slate-500">
                  Works with PhonePe, GPay, Paytm, BHIM & more
                </p>
              </div>

              {/* Feature pills */}
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Equal split",
                  "Individual QR per person",
                  "Pre-filled amount",
                  "Download QR",
                  "No bank details collected",
                ].map((feat) => (
                  <span
                    key={feat}
                    className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: preview card */}
            <div className="flex justify-center lg:justify-end">
              <PreviewCard />
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="border-t border-slate-100 bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              How it works
            </h2>
            <p className="mt-2 text-slate-500">Three steps to split any bill</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                icon: Receipt,
                step: "1",
                title: "Enter your bill",
                desc: "Add your UPI ID, the occasion, and the total amount. Your friends send money to you.",
                color: "indigo",
              },
              {
                icon: Users,
                step: "2",
                title: "Add people",
                desc: "Type the names of everyone splitting the bill. No UPI IDs or bank details needed from them.",
                color: "violet",
              },
              {
                icon: Smartphone,
                step: "3",
                title: "Everyone scans",
                desc: "Each person gets a unique QR. They scan → UPI app opens with the exact amount pre-filled. Done.",
                color: "emerald",
              },
            ].map(({ icon: Icon, step, title, desc, color }) => (
              <div
                key={step}
                className="relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-50`}
                >
                  <Icon className={`h-5 w-5 text-${color}-600`} />
                </div>
                <span className="absolute right-5 top-5 text-4xl font-black text-slate-100">
                  {step}
                </span>
                <h3 className="mb-2 text-base font-bold text-slate-900">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="border-t border-slate-100 bg-white py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Ready to split?
          </h2>
          <p className="mt-3 text-slate-500">
            Free, instant, no sign-up. Works on any phone.
          </p>
          <Link
            href="/split"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            Create a Split
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function PreviewCard() {
  const amount = 4000;
  const people = ["Amit", "Rohan"];
  const perPerson = amount / people.length;

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4">
        <p className="text-xs font-medium text-indigo-200">Dinner Party</p>
        <div className="flex items-end justify-between mt-1">
          <p className="text-2xl font-extrabold text-white">
            {formatINR(amount)}
          </p>
          <p className="text-sm text-indigo-200">2 people</p>
        </div>
      </div>

      {/* People */}
      <div className="px-5 py-4 space-y-3">
        {people.map((name) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                {name[0]}
              </div>
              <span className="text-sm font-semibold text-slate-800">{name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">
                {formatINR(perPerson)}
              </p>
              <div className="mt-0.5 flex items-center gap-1">
                <div className="h-4 w-4 rounded-sm bg-slate-800 flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-sm" />
                </div>
                <span className="text-xs text-slate-400">QR ready</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 px-5 py-3 flex items-center justify-between">
        <span className="text-xs text-slate-400">Receive to:</span>
        <span className="text-xs font-mono text-indigo-600">example@upi</span>
      </div>
    </div>
  );
}
