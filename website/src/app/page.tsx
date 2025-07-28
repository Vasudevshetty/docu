'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiDownload,
  FiBook,
  FiTerminal,
  FiSearch,
  FiBookmark,
  FiZap,
  FiCloud,
  FiCpu,
  FiLayout,
  FiGithub,
  FiArrowRight,
  FiCopy,
  FiCheck,
} from 'react-icons/fi';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const [copied, setCopied] = useState(false);

  const copyInstallCommand = async () => {
    await navigator.clipboard.writeText(
      'npm install -g @vasudevshetty/docu-cli'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiTerminal className="h-6 w-6" />
              <span className="text-xl font-bold">docu-cli</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </Link>
              <a
                href="https://github.com/Vasudevshetty/docu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="View on GitHub"
              >
                <FiGithub className="h-5 w-5" />
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 sm:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
              variants={fadeInUp}
            >
              AI-Powered Documentation
              <br />
              <span className="text-muted-foreground">
                Management for Developers
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Blazing-fast CLI to fetch, cache, and search developer docs right
              from your terminal with smart AI explanations. Work offline, stay
              productive.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <Button
                size="lg"
                className="h-12 px-8 text-base font-medium"
                onClick={copyInstallCommand}
              >
                {copied ? (
                  <>
                    <FiCheck className="mr-2 h-5 w-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FiDownload className="mr-2 h-5 w-5" />
                    Install Now
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base font-medium"
                asChild
              >
                <Link href="/docs">
                  <FiBook className="mr-2 h-5 w-5" />
                  View Documentation
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="mt-8 p-4 bg-muted/30 rounded-lg border max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono">
                  npm install -g @vasudevshetty/docu-cli
                </code>
                <button
                  onClick={copyInstallCommand}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  {copied ? (
                    <FiCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <FiCopy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything you need for documentation management
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for developers who value speed, intelligence, and efficiency
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: FiCloud,
                title: 'Offline-First',
                description:
                  'Complete documentation libraries cached locally for instant access anywhere',
              },
              {
                icon: FiCpu,
                title: 'AI-Enhanced',
                description:
                  'Intelligent search with contextual explanations and smart insights',
              },
              {
                icon: FiBookmark,
                title: 'Smart Bookmarking',
                description:
                  'Personal knowledge management with advanced organization and search',
              },
              {
                icon: FiTerminal,
                title: 'Terminal Integration',
                description:
                  'Seamless integration with your development workflow and tools',
              },
              {
                icon: FiLayout,
                title: 'Multiple Interfaces',
                description:
                  'CLI, TUI, and interactive modes for different use cases and preferences',
              },
              {
                icon: FiZap,
                title: 'Performance Optimized',
                description:
                  'Sub-second search across massive documentation collections',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-background rounded-lg border"
                variants={fadeInUp}
              >
                <feature.icon className="h-8 w-8 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold">See it in action</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Experience the power of docu-cli with these common workflows
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-background border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm font-mono text-muted-foreground">
                  Terminal
                </span>
              </div>
              <div className="p-6 font-mono text-sm bg-background">
                <div className="space-y-4">
                  <div>
                    <span className="text-muted-foreground">$ </span>
                    <span>docu fetch react</span>
                  </div>
                  <div className="text-green-500">
                    ✅ Successfully fetched and indexed React documentation
                    (15,423 documents)
                  </div>
                  <div className="mt-6">
                    <span className="text-muted-foreground">$ </span>
                    <span>docu search "useState hook" --ai</span>
                  </div>
                  <div className="text-blue-500">
                    🔍 Found 12 results for "useState hook":
                    <br />
                    <br />
                    1. ⭐ useState Hook - React Documentation [react]
                    <br />
                    &nbsp;&nbsp;&nbsp;useState is a Hook that lets you add React
                    state to function components...
                    <br />
                    &nbsp;&nbsp;&nbsp;🤖 AI Insight: useState is the most
                    fundamental React Hook for managing component state.
                  </div>
                  <div className="mt-6">
                    <span className="text-muted-foreground">$ </span>
                    <span>
                      docu bookmark add "useState patterns" --notes "Essential
                      React hook patterns"
                    </span>
                  </div>
                  <div className="text-green-500">
                    ✅ Bookmark added successfully! Now part of your personal
                    knowledge base.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to transform your documentation workflow?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers who've made documentation management
              effortless
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base font-medium"
                onClick={copyInstallCommand}
              >
                <FiDownload className="mr-2 h-5 w-5" />
                Get Started Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-medium border-primary-foreground/20 hover:bg-primary-foreground/10"
                asChild
              >
                <Link href="/docs">
                  <FiArrowRight className="mr-2 h-5 w-5" />
                  Read the Docs
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <FiTerminal className="h-5 w-5" />
              <span className="font-semibold">docu-cli</span>
              <span className="text-muted-foreground">v0.4.0</span>
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/Vasudevshetty/docu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </Link>
              <span className="text-muted-foreground">
                Built by{' '}
                <a
                  href="https://github.com/Vasudevshetty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Vasudevshetty
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
