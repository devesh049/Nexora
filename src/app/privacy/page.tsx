import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for the Nexora product preview.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-warning">Draft notice</p>
      <h1 className="mt-2 text-4xl font-bold text-foreground">Privacy information</h1>
      <p className="mt-4 text-foreground-secondary">This demo does not include user accounts, analytics, payment processing, or a backend that stores tool inputs. The listed browser tools process their inputs on your device. Your hosting provider may independently collect standard request logs.</p>
      <h2 className="mt-8 text-xl font-semibold text-foreground">Before production use</h2>
      <p className="mt-2 text-foreground-secondary">This page is informational and is not a complete legal privacy policy. Before collecting personal data, the operator must publish accurate details about data collected, purposes, retention, processors, user rights, and contact information.</p>
    </article>
  );
}
