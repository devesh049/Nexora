export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  status: "available" | "coming-soon" | "beta";
  featured?: boolean;
  plan?: "free" | "pro" | "team";
  href: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  href: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}
