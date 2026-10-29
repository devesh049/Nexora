"use client";

import { useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { ArrowLeft, Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QrGeneratorPage() {
  const [value, setValue] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const generate = async () => {
    if (!value.trim()) {
      setError("Enter a URL or text to create a QR code.");
      setImage("");
      return;
    }

    try {
      const dataUrl = await QRCode.toDataURL(value.trim(), {
        width: 512,
        margin: 2,
        errorCorrectionLevel: "M",
        color: { dark: "#111827", light: "#ffffff" },
      });
      setImage(dataUrl);
      setError("");
    } catch {
      setImage("");
      setError("Could not generate a QR code. Try shorter text.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/tools" className="mb-6 inline-flex items-center gap-1 text-sm text-foreground-secondary transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Tools
      </Link>

      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <QrCode className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">QR Code Generator</h1>
      </div>
      <p className="mb-6 text-sm text-foreground-secondary">Create a downloadable QR code for text or a link. Generation happens in your browser.</p>

      <label htmlFor="qr-content" className="mb-2 block text-sm font-medium text-foreground">Text or URL</label>
      <textarea
        id="qr-content"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={2000}
        placeholder="https://example.com or any short text"
        className="h-36 w-full resize-y rounded-xl border border-border bg-surface p-4 text-sm text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <p className="mt-1 text-right text-xs text-foreground-muted">{value.length}/2,000</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={generate}>Generate QR code</Button>
        <Button variant="outline" onClick={() => { setValue(""); setImage(""); setError(""); }}>Clear</Button>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl border border-error/20 bg-error/10 p-3 text-sm text-error">{error}</p>}
      {image && (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-6">
          {/* This image is generated locally from the entered value. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Generated QR code" width={256} height={256} className="h-64 w-64 rounded-lg bg-white p-2" />
          <a href={image} download="nexora-qr-code.png" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <Download className="h-4 w-4" /> Download PNG
          </a>
        </div>
      )}
    </div>
  );
}
