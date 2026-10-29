import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact options for the Nexora product preview.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><MessageCircle className="h-6 w-6 text-primary" /></div>
      <h1 className="text-4xl font-bold text-foreground">Contact Nexora</h1>
      <p className="mt-4 text-foreground-secondary">Nexora is a product preview. A verified support address or contact service has not been configured, so this site does not collect or send support requests.</p>
      <p className="mt-3 text-sm text-foreground-muted">For technical setup, see the project README. Add a verified support channel before publishing this page as a customer contact route.</p>
      <Link href="/about" className="mt-7 inline-flex"><Button variant="outline" className="gap-2">About the project <ArrowRight className="h-4 w-4" /></Button></Link>
    </div>
  );
}
