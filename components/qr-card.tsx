"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Smartphone, AlertTriangle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateUpiUri } from "@/lib/upi";
import { formatINR } from "@/lib/format";

// WhatsApp SVG icon (inline, no external CDN)
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface QrCardProps {
  /** Name of the person who needs to pay */
  payerName: string;
  /** Payer's WhatsApp phone number (10 digits, Indian) — optional */
  payerPhone?: string;
  /** Name of the person who will receive the money */
  receiverName: string;
  /** Receiver's UPI ID — this is what gets embedded in the QR */
  receiverUpiId: string;
  /** Amount this payer owes */
  amount: number;
  /** Occasion/note for the transaction */
  occasion: string;
  /** Animation delay index */
  index?: number;
}

/**
 * Builds a WhatsApp chat URL with a pre-filled payment reminder message.
 * Uses wa.me deep link — opens WhatsApp directly to the contact.
 * Security: all text is encoded via encodeURIComponent, no HTML injection possible.
 */
function buildWhatsAppUrl({
  phone,
  payerName,
  receiverName,
  receiverUpiId,
  amount,
  occasion,
  upiUri,
}: {
  phone: string;
  payerName: string;
  receiverName: string;
  receiverUpiId: string;
  amount: number;
  occasion: string;
  upiUri: string;
}) {
  // Normalise to E.164 — strip spaces, prepend +91 for 10-digit Indian numbers
  const digits = phone.replace(/\D/g, "");
  const e164 = digits.length === 10 ? `91${digits}` : digits;

  const message = [
    `Hi ${payerName}! 👋`,
    ``,
    `Please pay *${formatINR(amount)}* for *${occasion}*.`,
    ``,
    `📲 Scan the QR code or tap the link below to pay directly:`,
    upiUri,
    ``,
    `Pay to: *${receiverName}* (${receiverUpiId})`,
    ``,
    `_Please verify the receiver name and amount before paying._`,
  ].join("\n");

  return `https://wa.me/${e164}?text=${encodeURIComponent(message)}`;
}

export function QrCard({
  payerName,
  payerPhone,
  receiverName,
  receiverUpiId,
  amount,
  occasion,
  index = 0,
}: QrCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const upiUri = generateUpiUri({
    receiverUpiId,
    receiverName,
    amount,
    paymentNote: `${occasion || "Shared Bill"} - ${payerName}'s share`,
  });

  useEffect(() => {
    let cancelled = false;

    async function generateQr() {
      try {
        const dataUrl = await QRCode.toDataURL(upiUri, {
          width: 240,
          margin: 2,
          color: { dark: "#1e1b4b", light: "#ffffff" },
          errorCorrectionLevel: "M",
        });
        if (!cancelled) setQrDataUrl(dataUrl);
      } catch {
        if (!cancelled) setError("Could not generate QR code.");
      }
    }

    generateQr();
    return () => { cancelled = true; };
  }, [upiUri]);

  async function generateCanvasBlob(): Promise<Blob | null> {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const W = 360;
    const H = 480;
    canvas.width = W;
    canvas.height = H;

    ctx.fillStyle = "#ffffff";
    ctx.roundRect(0, 0, W, H, 16);
    ctx.fill();

    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, "#4f46e5");
    grad.addColorStop(1, "#7c3aed");
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, W, 56, [16, 16, 0, 0]);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(payerName, W / 2, 36);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 32px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(formatINR(amount), W / 2, 100);

    ctx.fillStyle = "#64748b";
    ctx.font = "13px Inter, Arial, sans-serif";
    ctx.fillText("Amount to pay", W / 2, 120);

    if (qrDataUrl) {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = qrDataUrl;
      });
      const qrSize = 200;
      const qrX = (W - qrSize) / 2;
      ctx.drawImage(img, qrX, 136, qrSize, qrSize);
    }

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 350);
    ctx.lineTo(W - 24, 350);
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PAY TO", W / 2, 372);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px Inter, Arial, sans-serif";
    ctx.fillText(receiverName, W / 2, 396);

    ctx.fillStyle = "#6366f1";
    ctx.font = "12px monospace";
    ctx.fillText(receiverUpiId, W / 2, 416);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Inter, Arial, sans-serif";
    ctx.fillText("Verify details before paying", W / 2, 454);

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.roundRect(0.5, 0.5, W - 1, H - 1, 16);
    ctx.stroke();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }

  async function handleDownload() {
    const blob = await generateCanvasBlob();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `UPI-${payerName.replace(/\s+/g, "-")}-${formatINR(amount).replace(/[₹,]/g, "")}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    const blob = await generateCanvasBlob();
    if (!blob) return;

    const file = new File(
      [blob],
      `UPI-${payerName.replace(/\s+/g, "-")}.png`,
      { type: "image/png" }
    );

    const message = [
      `Hi ${payerName}! 👋`,
      ``,
      `Please pay *${formatINR(amount)}* for *${occasion}*.`,
      ``,
      `Pay to: *${receiverName}* (${receiverUpiId})`,
      ``,
      upiUri,
    ].join("\n");

    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Payment Request from ${receiverName}`,
          text: message,
          files: [file],
        });
      } else {
        // Fallback: download the image if sharing isn't supported
        handleDownload();
        alert("Your browser doesn't support sharing images directly. The QR code has been downloaded instead so you can attach it manually.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }

  // WhatsApp URL — only if phone number provided
  const hasPhone = payerPhone && /^[6-9]\d{9}$/.test(payerPhone.replace(/\s+/g, ""));
  const whatsAppUrl = hasPhone
    ? buildWhatsAppUrl({
        phone: payerPhone!,
        payerName,
        receiverName,
        receiverUpiId,
        amount,
        occasion,
        upiUri,
      })
    : null;

  return (
    <div
      className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4">
        <p className="text-lg font-bold text-white">{payerName}</p>
        <p className="text-indigo-200 text-xs mt-0.5">
          {hasPhone ? `+91 ${payerPhone}` : "Scan to pay"}
        </p>
      </div>

      {/* Amount */}
      <div className="px-5 pt-5 pb-4 text-center border-b border-slate-100">
        <p className="text-3xl font-bold text-slate-900 tracking-tight">
          {formatINR(amount)}
        </p>
        <p className="text-xs text-slate-400 mt-1">Amount to pay</p>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center justify-center px-5 py-5 gap-4">
        {error ? (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        ) : qrDataUrl ? (
          <div className="rounded-lg border-2 border-slate-100 p-2 bg-white">
            {/* Security: img src is a data URL generated client-side via qrcode library */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt={`UPI payment QR for ${payerName} — ${formatINR(amount)} to ${receiverName}`}
              width={200}
              height={200}
              className="block"
            />
          </div>
        ) : (
          <div className="h-[216px] w-[216px] animate-pulse rounded-lg bg-slate-100" />
        )}

        {/* Pay to info */}
        <div className="w-full rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">
            Pay to
          </p>
          <p className="text-sm font-bold text-slate-900">{receiverName}</p>
          <p className="text-xs font-mono text-indigo-600 break-all">{receiverUpiId}</p>
        </div>

        {/* Scan instruction */}
        <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-left w-full">
          <Smartphone className="mt-0.5 h-3.5 w-3.5 text-blue-500 shrink-0" />
          <div>
            <p className="text-xs font-medium text-blue-700">Scan with your UPI app</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Amount and receiver are pre-filled. Just enter your UPI PIN.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          ⚠️ Always verify the receiver name and amount before completing the payment.
        </p>

        {/* Action buttons */}
        <div className="flex w-full gap-2">
          {/* Download */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className="flex-1 gap-1.5"
            aria-label={`Download QR code for ${payerName}`}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>

          {/* WhatsApp Text Only Fallback */}
          {whatsAppUrl ? (
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Send text to ${payerName} on WhatsApp`}
              className="flex-[0.5] inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#25D366] bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#20BD5C] hover:border-[#20BD5C] transition-colors"
              title="Send Text Message via WhatsApp"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
            </a>
          ) : null}

          {/* Share Image with Native API */}
          <Button
            variant="default"
            size="sm"
            onClick={handleShare}
            disabled={!qrDataUrl}
            className="flex-1 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            aria-label={`Share QR code image for ${payerName}`}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share Image
          </Button>
        </div>

        {!hasPhone && (
          <p className="text-[10px] text-slate-400 text-center -mt-2">
            Add phone number above to enable WhatsApp text sharing
          </p>
        )}
      </div>

      {/* Hidden canvas for download rendering */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
