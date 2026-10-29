"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type CharSet = {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

function calculateStrength(password: string, charSet: CharSet): string {
  if (!password) return "";
  const length = password.length;
  let charPoolSize = 0;
  if (charSet.uppercase) charPoolSize += 26;
  if (charSet.lowercase) charPoolSize += 26;
  if (charSet.numbers) charPoolSize += 10;
  if (charSet.symbols) charPoolSize += 32;

  const entropy = length * Math.log2(charPoolSize);

  if (entropy < 40) return "Weak";
  if (entropy < 60) return "Fair";
  if (entropy < 80) return "Good";
  return "Strong";
}

function getStrengthColor(strength: string): string {
  switch (strength) {
    case "Weak":
      return "text-error";
    case "Fair":
      return "text-warning";
    case "Good":
      return "text-success";
    case "Strong":
      return "text-primary";
    default:
      return "text-foreground-secondary";
  }
}

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [charSet, setCharSet] = useState<CharSet>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = useCallback(() => {
    const chars = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    let charset = "";
    if (charSet.uppercase) charset += chars.uppercase;
    if (charSet.lowercase) charset += chars.lowercase;
    if (charSet.numbers) charset += chars.numbers;
    if (charSet.symbols) charset += chars.symbols;

    if (!charset) {
      setPassword("");
      setError("Select at least one character type to generate a password.");
      return;
    }

    setError("");
    const result: string[] = [];
    const limit = Math.floor(0x1_0000_0000 / charset.length) * charset.length;
    while (result.length < length) {
      const array = new Uint32Array(length - result.length);
      crypto.getRandomValues(array);
      for (const value of array) {
        if (value < limit) result.push(charset[value % charset.length]);
        if (result.length === length) break;
      }
    }
    setPassword(result.join(""));
    setCopied(false);
  }, [length, charSet]);

  const copyPassword = useCallback(async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [password]);

  const strength = calculateStrength(password, charSet);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 text-sm text-foreground-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tools
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Key className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Password Generator
        </h1>
      </div>
      <p className="text-sm text-foreground-secondary mb-6">
        Generate cryptographically secure random passwords. Uses crypto.getRandomValues() for true randomness.
      </p>

      {/* Password Display */}
      {password && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                Generated Password
              </span>
              {strength && (
                <span
                  className={`text-xs font-semibold ${getStrengthColor(
                    strength
                  )}`}
                >
                  {strength}
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={copyPassword}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-success" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4 text-base font-mono text-foreground break-all">
            {password}
          </div>
        </div>
      )}

      {/* Length Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password-length" className="text-sm font-medium text-foreground">Length</label>
          <span className="text-sm font-semibold text-primary">{length}</span>
        </div>
        <input
          type="range"
          min="8"
          max="128"
          id="password-length"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {error && <p role="alert" className="mb-4 rounded-xl border border-error/20 bg-error/10 p-3 text-sm text-error">{error}</p>}

      {/* Character Set Options */}
      <div className="mb-6 space-y-3">
        <label className="text-sm font-medium text-foreground block">
          Include
        </label>
        {(
          [
            { key: "uppercase", label: "Uppercase (A-Z)" },
            { key: "lowercase", label: "Lowercase (a-z)" },
            { key: "numbers", label: "Numbers (0-9)" },
            { key: "symbols", label: "Symbols (!@#$...)" },
          ] as const
        ).map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={charSet[key]}
              onChange={(e) =>
                setCharSet((prev) => ({ ...prev, [key]: e.target.checked }))
              }
              className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
            />
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">
              {label}
            </span>
          </label>
        ))}
      </div>

      {/* Generate Button */}
      <Button variant="primary" size="default" onClick={generate} className="w-full">
        <RefreshCw className="h-4 w-4" /> Generate Password
      </Button>
    </div>
  );
}
