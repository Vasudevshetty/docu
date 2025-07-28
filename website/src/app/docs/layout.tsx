import { Metadata } from 'next';
import { DocsLayout } from '@/components/docs-layout';

export const metadata: Metadata = {
  title: 'Documentation | docu-cli',
  description:
    'Complete guide to using docu-cli for offline documentation management',
};

export default function DocsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsLayout>{children}</DocsLayout>;
}
