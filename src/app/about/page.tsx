import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Layers3, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Nexora",
  description: "Learn about the Nexora digital services platform preview.",
};

const principles = [
  { icon: Layers3, title: "One thoughtful toolkit", text: "A single place to discover browser utilities, application concepts, and developer resources." },
  { icon: ShieldCheck, title: "Honest by design", text: "We label previews and planned capabilities so you can tell what works today." },
  { icon: Compass, title: "Built to grow", text: "The platform is structured to add real services as integrations and operational support become available." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">About Nexora</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Everything digital, connected.</h1>
        <p className="mt-5 text-lg leading-relaxed text-foreground-secondary">Nexora is a product preview for a unified digital services platform. Today, its browser-based utilities work locally; application listings and the developer ecosystem are illustrative previews.</p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {principles.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-border bg-surface p-6"><Icon className="h-6 w-6 text-primary" /><h2 className="mt-4 font-semibold text-foreground">{title}</h2><p className="mt-2 text-sm leading-relaxed text-foreground-secondary">{text}</p></article>)}
      </div>
      <Link href="/tools" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">Explore working tools <ArrowRight className="h-4 w-4" /></Link>
    </div>
  );
}
