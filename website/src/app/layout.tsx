import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'docu-cli | AI-Powered Documentation Management',
  description:
    'Blazing-fast, AI-powered CLI to fetch, cache, and search developer docs right from your terminal with smart explanations',
  keywords: [
    'cli',
    'documentation',
    'offline',
    'search',
    'ai',
    'developer-tools',
  ],
  authors: [{ name: 'Vasudevshetty' }],
  openGraph: {
    title: 'docu-cli | AI-Powered Documentation Management',
    description:
      'Blazing-fast, AI-powered CLI to fetch, cache, and search developer docs right from your terminal',
    url: 'https://docu.vasudevshetty.com',
    siteName: 'docu-cli',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'docu-cli | AI-Powered Documentation Management',
    description:
      'Blazing-fast, AI-powered CLI to fetch, cache, and search developer docs right from your terminal',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
