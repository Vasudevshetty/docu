import { getDocContent } from '@/lib/docs';
import { DocsContent } from '@/components/docs-content';
import { notFound } from 'next/navigation';

interface DocsPageProps {
  params: {
    slug: string;
  };
}

export default async function DocsSlugPage({ params }: DocsPageProps) {
  const doc = await getDocContent(params.slug);

  if (!doc) {
    notFound();
  }

  return <DocsContent doc={doc} />;
}

export async function generateStaticParams() {
  // Generate static paths for all documentation pages
  return [
    { slug: 'overview' },
    { slug: 'installation' },
    { slug: 'commands' },
    { slug: 'ai-integration' },
    { slug: 'bookmarks' },
    { slug: 'advanced' },
  ];
}
