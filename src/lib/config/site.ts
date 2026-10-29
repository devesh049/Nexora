export const siteConfig = {
  name: "Nexora",
  tagline: "Everything Digital. One Powerful Platform.",
  description: "Discover powerful applications, simplify everyday tasks, and access developer-friendly services — all from one unified platform.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

export const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "Applications", href: "/apps" },
    { name: "Tools", href: "/tools" },
    { name: "Developer APIs", href: "/developers" },
    { name: "AI Tools", href: "/#ai-tools" },
    { name: "Pricing", href: "/pricing" },
  ],
  footer: {
    product: [
      { name: "Applications", href: "/apps" },
      { name: "Online Tools", href: "/tools" },
      { name: "Developer APIs", href: "/developers" },
      { name: "Pricing", href: "/pricing" },
    ],
    resources: [
      { name: "Documentation", href: "/docs" },
      { name: "API Status", href: "/status" },
      { name: "Guides", href: "/docs" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
} as const;
