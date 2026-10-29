import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { siteConfig } from '@/lib/config/site';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { MotionConfig } from 'framer-motion';
import { AuthSessionProvider } from '@/components/providers/auth-session-provider';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({ variable: '--font-jetbrains-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: '%s | ' + siteConfig.name },
  description: siteConfig.description,
  keywords: ['web applications', 'online tools', 'developer APIs', 'productivity tools', 'AI tools', 'digital services', 'Nexora'],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable + ' ' + jetbrainsMono.variable + ' font-sans antialiased min-h-screen flex flex-col bg-background text-foreground'}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthSessionProvider>
            <MotionConfig reducedMotion="user">
              <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-foreground">Skip to content</a>
              <Navigation />
              <main id="main-content" className="flex-1">{children}</main>
              <Footer />
              <Toaster position="top-right" richColors />
            </MotionConfig>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
