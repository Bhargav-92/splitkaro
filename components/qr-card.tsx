"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Smartphone, AlertTriangle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateUpiUri } from "@/lib/upi";
import { formatINR } from "@/lib/format";

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

  const occasionNote = occasion ? `Occasion: ${occasion}` : "Shared Bill";
  const upiUri = generateUpiUri({
    receiverUpiId,
    receiverName,
    amount,
    paymentNote: `${occasionNote} (${payerName})`,
  });

  useEffect(() => {
    let cancelled = false;

    async function generateQr() {
      try {
        const dataUrl = await QRCode.toDataURL(upiUri, {
          width: 240,
          margin: 2,
          color: { dark: "#000000", light: "#ffffff" },
          errorCorrectionLevel: "M",
        });
        if (!cancelled) setQrDataUrl(dataUrl);
      } catch {
        if (!cancelled) setError("Could not generate QR code.");
      }
    }

    generateQr();
    return () => {
      cancelled = true;
    };
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

    // Solid white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Black text for Payer Name
    ctx.fillStyle = "#000000";
    ctx.font = "bold 22px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(payerName, W / 2, 42);

    // Black text for Amount
    ctx.fillStyle = "#000000";
    ctx.font = "bold 32px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(formatINR(amount), W / 2, 92);

    ctx.fillStyle = "#333333";
    ctx.font = "12px Inter, Arial, sans-serif";
    ctx.fillText("Amount to pay", W / 2, 112);

    if (occasion) {
      ctx.fillStyle = "#000000";
      ctx.font = "bold 12px Inter, Arial, sans-serif";
      ctx.fillText(`Occasion: ${occasion}`, W / 2, 130);
    }

    if (qrDataUrl) {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = qrDataUrl;
      });
      const qrSize = 185;
      const qrX = (W - qrSize) / 2;
      const qrY = occasion ? 142 : 132;
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
    }

    // Divider line
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 350);
    ctx.lineTo(W - 24, 350);
    ctx.stroke();

    ctx.fillStyle = "#333333";
    ctx.font = "bold 11px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PAY TO", W / 2, 370);

    ctx.fillStyle = "#000000";
    ctx.font = "bold 16px Inter, Arial, sans-serif";
    ctx.fillText(receiverName, W / 2, 392);

    ctx.fillStyle = "#000000";
    ctx.font = "bold 13px monospace";
    ctx.fillText(receiverUpiId, W / 2, 414);

    ctx.fillStyle = "#444444";
    ctx.font = "10px Inter, Arial, sans-serif";
    ctx.fillText("Verify details before paying", W / 2, 450);

    // Black outer border
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, W - 2, H - 2);

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
      `Please pay *${formatINR(amount)}* for *${occasion || "Shared Bill"}*.`,
      ``,
      `Pay to: *${receiverName}* (${receiverUpiId})`,
      ``,
      upiUri,
    ].join("\n");

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: `Payment Request from ${receiverName}`,
          text: message,
          files: [file],
        });
      } else {
        handleDownload();
        alert(
          "Your browser doesn't support sharing images directly. The QR code has been downloaded instead so you can attach it manually."
        );
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }

  const hasPhone =
    payerPhone && /^[6-9]\d{9}$/.test(payerPhone.replace(/\s+/g, ""));

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
          <p className="text-xs font-mono text-indigo-600 break-all">
            {receiverUpiId}
          </p>
        </div>

        {/* Scan instruction */}
        <div className="flex items-start gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 text-left w-full">
          <Smartphone className="mt-0.5 h-3.5 w-3.5 text-blue-500 shrink-0" />
          <div>
            <p className="text-xs font-medium text-blue-700">
              Scan with your UPI app
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              Occasion note and amount are pre-filled. Just enter your UPI PIN.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 text-center leading-relaxed">
          ⚠️ Always verify the receiver name and amount before completing the
          payment.
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

          {/* Share with Native API */}
          <Button
            variant="default"
            size="sm"
            onClick={handleShare}
            disabled={!qrDataUrl}
            className="flex-1 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            aria-label={`Share QR code image for ${payerName}`}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      </div>

      {/* Hidden canvas for download & share rendering */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
}
