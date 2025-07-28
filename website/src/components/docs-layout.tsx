'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiTerminal,
  FiChevronDown,
  FiChevronRight,
  FiBook,
  FiStar,
  FiSettings,
  FiPackage,
  FiTool,
  FiHeart,
  FiZap,
} from 'react-icons/fi';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import metadata from '@/data/metadata.json';

const iconMap = {
  RocketLaunch: FiZap,
  Star: FiStar,
  Terminal: FiTerminal,
  Cog: FiSettings,
  Puzzle: FiPackage,
  Wrench: FiTool,
  Heart: FiHeart,
};

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['getting-started'])
  );
  const pathname = usePathname();

  const toggleSection = (slug: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedSections(newExpanded);
  };

  const isActive = (slug: string) => pathname === `/docs/${slug}`;
  const isSectionActive = (section: any) => {
    if (isActive(section.slug)) return true;
    return section.sections?.some((subsection: any) =>
      isActive(subsection.slug)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <FiTerminal className="h-6 w-6" />
              <span className="font-bold">docu-cli</span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <span className="inline-flex items-center text-sm text-muted-foreground">
                <FiBook className="mr-2 h-4 w-4" />
                Documentation
              </span>
            </div>
            <nav className="flex items-center space-x-2">
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed left-0 top-0 z-50 h-full w-72 border-r bg-background p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <FiTerminal className="h-6 w-6" />
                  <span className="font-bold">docu-cli</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiX className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-6">
                <Navigation
                  sections={metadata.navigation}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  isActive={isActive}
                  isSectionActive={isSectionActive}
                  onLinkClick={() => setSidebarOpen(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Desktop Sidebar */}
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <Navigation
              sections={metadata.navigation}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              isActive={isActive}
              isSectionActive={isSectionActive}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
          <div className="mx-auto w-full min-w-0">{children}</div>

          {/* Table of Contents */}
          <div className="hidden text-sm xl:block">
            <div className="sticky top-16 -mt-10 pt-4">
              <div className="space-y-2">
                <p className="font-medium">On This Page</p>
                {/* TOC will be populated by the docs content component */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface NavigationProps {
  sections: any[];
  expandedSections: Set<string>;
  toggleSection: (slug: string) => void;
  isActive: (slug: string) => boolean;
  isSectionActive: (section: any) => boolean;
  onLinkClick?: () => void;
}

function Navigation({
  sections,
  expandedSections,
  toggleSection,
  isActive,
  isSectionActive,
  onLinkClick,
}: NavigationProps) {
  return (
    <nav className="space-y-2">
      {sections.map((section) => {
        const Icon = iconMap[section.icon as keyof typeof iconMap] || FiBook;
        const isExpanded = expandedSections.has(section.slug);
        const hasSubsections = section.sections && section.sections.length > 0;

        return (
          <div key={section.slug}>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'flex w-full justify-start px-2 py-1.5 text-sm font-medium',
                  isSectionActive(section)
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                asChild={!hasSubsections}
                onClick={
                  hasSubsections
                    ? () => toggleSection(section.slug)
                    : onLinkClick
                }
              >
                {hasSubsections ? (
                  <div className="flex w-full items-center">
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="flex-1">{section.title}</span>
                    {isExpanded ? (
                      <FiChevronDown className="h-4 w-4" />
                    ) : (
                      <FiChevronRight className="h-4 w-4" />
                    )}
                  </div>
                ) : (
                  <Link
                    href={`/docs/${section.slug}`}
                    className="flex w-full items-center"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{section.title}</span>
                  </Link>
                )}
              </Button>
            </div>

            <AnimatePresence>
              {hasSubsections && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-6 mt-1 space-y-1">
                    {section.sections.map((subsection: any) => (
                      <Button
                        key={subsection.slug}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'w-full justify-start px-2 py-1 text-sm',
                          isActive(subsection.slug)
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                        asChild
                        onClick={onLinkClick}
                      >
                        <Link href={`/docs/${subsection.slug}`}>
                          {subsection.title}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}
