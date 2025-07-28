'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiExternalLink, FiEdit3 } from 'react-icons/fi';
import { Doc } from '@/lib/docs';

interface DocsContentProps {
  doc: Doc;
}

export function DocsContent({ doc }: DocsContentProps) {
  const [copied, setCopied] = useState('');
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);

  useEffect(() => {
    // Extract headings for table of contents
    const content = document.querySelector('.prose');
    if (content) {
      const headingElements = content.querySelectorAll(
        'h1, h2, h3, h4, h5, h6'
      );
      const headingsData = Array.from(headingElements).map((heading) => ({
        id:
          heading.id ||
          heading.textContent?.toLowerCase().replace(/\s+/g, '-') ||
          '',
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      }));
      setHeadings(headingsData);

      // Add IDs to headings if they don't have them
      headingElements.forEach((heading) => {
        if (!heading.id) {
          heading.id =
            heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
        }
      });
    }
  }, [doc.html]);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const copyCodeBlock = async (code: string, blockId: string) => {
    await copyToClipboard(code, blockId);
  };

  useEffect(() => {
    // Add copy buttons to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block, index) => {
      const pre = block.parentElement;
      if (pre && !pre.querySelector('.copy-button')) {
        const button = document.createElement('button');
        button.className =
          'copy-button absolute top-2 right-2 p-2 rounded-md bg-muted/80 hover:bg-muted transition-colors';
        button.innerHTML =
          '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
        button.onclick = () =>
          copyCodeBlock(block.textContent || '', `code-${index}`);

        pre.style.position = 'relative';
        pre.appendChild(button);
      }
    });
  }, [doc.html]);

  return (
    <div className="max-w-4xl">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {doc.meta.title}
            </h1>
            {doc.meta.description && (
              <p className="mt-2 text-lg text-muted-foreground">
                {doc.meta.description}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              onClick={() => copyToClipboard(window.location.href, 'page-url')}
            >
              {copied === 'page-url' ? (
                <FiCheck className="h-4 w-4 mr-2" />
              ) : (
                <FiCopy className="h-4 w-4 mr-2" />
              )}
              Copy URL
            </button>
            <a
              href={`https://github.com/Vasudevshetty/docu/edit/main/website/src/data/docs/${doc.slug}.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            >
              <FiEdit3 className="h-4 w-4 mr-2" />
              Edit on GitHub
            </a>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="prose prose-gray dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: doc.html }}
      />

      {/* Table of Contents (Mobile) */}
      {headings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 xl:hidden"
        >
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
            <nav className="space-y-2">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className={`block text-sm hover:text-foreground transition-colors ${
                    heading.level === 1
                      ? 'font-medium text-foreground'
                      : heading.level === 2
                        ? 'ml-4 text-muted-foreground'
                        : 'ml-8 text-muted-foreground'
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </div>
        </motion.div>
      )}

      {/* Footer Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 pt-8 border-t"
      >
        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Vasudevshetty/docu/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Report an issue
            </a>
            <a
              href="https://github.com/Vasudevshetty/docu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FiExternalLink className="h-4 w-4 mr-1" />
              View on GitHub
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
