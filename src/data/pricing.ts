import type { PricingPlan } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for individuals getting started",
    features: [
      "Access to basic applications",
      "All online tools included",
      "Community support",
      "5 GB storage",
      "Basic API access (1,000 requests/month)",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$19",
    description: "For professionals and power users",
    features: [
      "All Free features",
      "Access to premium applications",
      "Priority support",
      "50 GB storage",
      "Advanced API access (50,000 requests/month)",
      "AI-powered tools",
      "Custom integrations",
      "No ads",
    ],
    highlighted: true,
    cta: "Start Free Trial",
  },
  {
    name: "Team",
    price: "$49",
    description: "For teams and organizations",
    features: [
      "All Pro features",
      "Unlimited team members",
      "Team workspace",
      "500 GB shared storage",
      "Enterprise API access (500,000 requests/month)",
      "Advanced analytics",
      "Custom branding",
      "Dedicated support",
      "SSO integration",
    ],
    cta: "Contact Sales",
  },
];
