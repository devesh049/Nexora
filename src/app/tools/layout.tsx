import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Tools",
  description:
    "Free browser-based productivity and developer tools on Nexora.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
