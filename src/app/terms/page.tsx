import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms information for the Nexora product preview.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-warning">Draft notice</p>
      <h1 className="mt-2 text-4xl font-bold text-foreground">Terms of service</h1>
      <p className="mt-4 text-foreground-secondary">Nexora is currently a product demo. Accounts, paid plans, APIs, and hosted application services are not available, and no purchase is offered on this site.</p>
      <h2 className="mt-8 text-xl font-semibold text-foreground">Production terms are not yet published</h2>
      <p className="mt-2 text-foreground-secondary">This page is not a binding or complete terms of service. The operator must replace this notice with terms reviewed for the actual product, jurisdiction, and services before launch.</p>
    </article>
  );
}
