import { Command } from 'commander';
import chalk from 'chalk';
import { BookmarkService } from '../services/BookmarkService.js';
import { SearchDocs } from '../core/SearchDocs.js';
import { MarkdownPager } from '../utils/MarkdownPager.js';
import ora from 'ora';

export const bookmarkCommand = new Command('bookmark')
  .alias('bm')
  .description('Manage your personal documentation bookmarks')
  .addCommand(
    new Command('add')
      .description('Add a bookmark from search results')
      .argument('<query>', 'Search query to bookmark')
      .option('-d, --docset <docset>', 'Limit search to specific docset')
      .option('-n, --notes <notes>', 'Add personal notes to the bookmark')
      .option('-t, --tags <tags>', 'Comma-separated tags for the bookmark')
      .option(
        '-i, --importance <level>',
        'Importance level: low, medium, high',
        'medium'
      )
      .option('--interactive', 'Interactively select from search results')
      .action(
        async (
          query: string,
          options: {
            docset?: string;
            notes?: string;
            tags?: string;
            importance?: 'low' | 'medium' | 'high';
            interactive?: boolean;
          }
        ) => {
          try {
            const spinner = ora(`Searching for "${query}"...`).start();

            const searcher = new SearchDocs();
            const results = await searcher.search(query, {
              docset: options.docset,
              limit: options.interactive ? 10 : 1,
            });

            spinner.stop();

            if (results.length === 0) {
              console.log(chalk.yellow(`No results found for "${query}"`));
              return;
            }

            const bookmarkService = new BookmarkService();
            let resultToBookmark = results[0];

            if (options.interactive && results.length > 1) {
              console.log(chalk.green(`\nFound ${results.length} results:\n`));

              results.forEach((result, index) => {
                console.log(chalk.cyan(`${index + 1}. ${result.title}`));
                console.log(
                  chalk.gray(`   ${result.snippet.substring(0, 100)}...`)
                );
                console.log(
                  chalk.magenta(`   [${result.docset}] ${result.url}\n`)
                );
              });

              // For now, use the first result. In a full implementation,
              // you'd want to add interactive selection
              console.log(
                chalk.yellow(
                  'Interactive selection coming soon! Using first result.\n'
                )
              );
            }

            const tags = options.tags
              ? options.tags.split(',').map((t) => t.trim())
              : undefined;

            const bookmarkId =
              await bookmarkService.addBookmarkFromSearchResult(
                resultToBookmark,
                options.notes,
                tags,
                options.importance
              );

            console.log(chalk.green('✅ Bookmark added successfully!'));
            console.log(chalk.gray(`   ID: ${bookmarkId}`));
            console.log(chalk.gray(`   Title: ${resultToBookmark.title}`));
            console.log(chalk.gray(`   Docset: ${resultToBookmark.docset}`));

            if (options.notes) {
              console.log(chalk.gray(`   Notes: ${options.notes}`));
            }

            bookmarkService.close();
          } catch (error) {
            console.error(
              chalk.red('❌ Failed to add bookmark:'),
              error instanceof Error ? error.message : String(error)
            );
          }
        }
      )
  )
  .addCommand(
    new Command('list')
      .alias('ls')
      .description('List your bookmarks')
      .option('-d, --docset <docset>', 'Filter by docset')
      .option('-t, --tag <tag>', 'Filter by tag')
      .option('-c, --category <category>', 'Filter by category')
      .option('-i, --importance <level>', 'Filter by importance level')
      .option('-l, --limit <number>', 'Maximum number of results', '20')
      .option('--recent', 'Show recent bookmarks')
      .option('--json', 'Output as JSON')
      .action(
        async (options: {
          docset?: string;
          tag?: string;
          category?: string;
          importance?: 'low' | 'medium' | 'high';
          limit?: string;
          recent?: boolean;
          json?: boolean;
        }) => {
          try {
            const bookmarkService = new BookmarkService();
            let bookmarks;

            if (options.recent) {
              bookmarks = await bookmarkService.getRecentBookmarks(
                parseInt(options.limit || '20')
              );
            } else if (options.docset) {
              bookmarks = await bookmarkService.getBookmarksByDocset(
                options.docset
              );
            } else if (options.tag) {
              bookmarks = await bookmarkService.getBookmarksByTag(options.tag);
            } else if (options.category) {
              bookmarks = await bookmarkService.getBookmarksByCategory(
                options.category
              );
            } else {
              bookmarks = await bookmarkService.searchBookmarks({
                importance: options.importance,
                limit: parseInt(options.limit || '20'),
              });
            }

            if (options.json) {
              console.log(JSON.stringify(bookmarks, null, 2));
              bookmarkService.close();
              return;
            }

            if (bookmarks.length === 0) {
              console.log(chalk.yellow('📂 No bookmarks found'));
              console.log(
                chalk.gray(
                  'Use `docu bookmark add <query>` to add your first bookmark'
                )
              );
              bookmarkService.close();
              return;
            }

            console.log(
              chalk.bold.blue(
                `📚 Your Bookmarks (${bookmarks.length} total):\n`
              )
            );

            bookmarks.forEach((bookmark, index) => {
              const number = chalk.gray(
                `${(index + 1).toString().padStart(2, ' ')}.`
              );
              const title = chalk.bold.white(bookmark.title);
              const docset = chalk.magenta(`[${bookmark.docset}]`);
              const importance = getImportanceIcon(bookmark.importance);
              const tags =
                bookmark.tags.length > 0
                  ? chalk.cyan(`#${bookmark.tags.join(' #')}`)
                  : '';

              console.log(`${number} ${importance} ${title} ${docset}`);

              if (bookmark.category) {
                console.log(`     ${chalk.yellow(`📁 ${bookmark.category}`)}`);
              }

              if (tags) {
                console.log(`     ${tags}`);
              }

              if (bookmark.notes) {
                console.log(chalk.gray(`     💭 ${bookmark.notes}`));
              }

              console.log(chalk.gray(`     🔗 ${bookmark.url}`));
              console.log(
                chalk.gray(
                  `     📅 Added: ${bookmark.createdAt.toLocaleDateString()}`
                )
              );
              console.log();
            });

            bookmarkService.close();
          } catch (error) {
            console.error(
              chalk.red('❌ Failed to list bookmarks:'),
              error instanceof Error ? error.message : String(error)
            );
          }
        }
      )
  )
  .addCommand(
    new Command('search')
      .description('Search through your bookmarks')
      .argument('<query>', 'Search query')
      .option('-d, --docset <docset>', 'Filter by docset')
      .option('-t, --tags <tags>', 'Filter by tags (comma-separated)')
      .option('-l, --limit <number>', 'Maximum number of results', '10')
      .option('--pager', 'Display results in a paginated viewer')
      .action(
        async (
          query: string,
          options: {
            docset?: string;
            tags?: string;
            limit?: string;
            pager?: boolean;
          }
        ) => {
          try {
            const bookmarkService = new BookmarkService();
            const tags = options.tags
              ? options.tags.split(',').map((t) => t.trim())
              : undefined;

            const bookmarks = await bookmarkService.searchBookmarks({
              query,
              docset: options.docset,
              tags,
              limit: parseInt(options.limit || '10'),
            });

            if (bookmarks.length === 0) {
              console.log(chalk.yellow(`No bookmarks found for "${query}"`));
              bookmarkService.close();
              return;
            }

            let output = chalk.bold.green(
              `🔍 Found ${bookmarks.length} bookmarks for "${query}":\n\n`
            );

            bookmarks.forEach((bookmark, index) => {
              const number = chalk.cyan(`${index + 1}.`);
              const importance = getImportanceIcon(bookmark.importance);
              const tags =
                bookmark.tags.length > 0
                  ? chalk.cyan(`#${bookmark.tags.join(' #')}`)
                  : '';

              output += `${number} ${importance} ${chalk.bold.white(bookmark.title)}\n`;
              output += `   ${chalk.magenta(`[${bookmark.docset}]`)} ${bookmark.category || ''}\n`;

              if (tags) {
                output += `   ${tags}\n`;
              }

              if (bookmark.notes) {
                output += `   ${chalk.gray(`💭 ${bookmark.notes}`)}\n`;
              }

              output += `   ${chalk.gray(`🔗 ${bookmark.url}`)}\n`;
              output += `   ${chalk.gray(`📅 ${bookmark.createdAt.toLocaleDateString()}`)}\n\n`;
            });

            if (options.pager) {
              const pager = new MarkdownPager(output);
              await pager.display();
            } else {
              console.log(output);
            }

            bookmarkService.close();
          } catch (error) {
            console.error(
              chalk.red('❌ Bookmark search failed:'),
              error instanceof Error ? error.message : String(error)
            );
          }
        }
      )
  )
  .addCommand(
    new Command('remove')
      .alias('rm')
      .description('Remove a bookmark')
      .argument('<id>', 'Bookmark ID to remove')
      .action(async (id: string) => {
        try {
          const bookmarkService = new BookmarkService();
          const bookmark = await bookmarkService.getBookmark(id);

          if (!bookmark) {
            console.log(chalk.yellow(`❌ Bookmark with ID ${id} not found`));
            bookmarkService.close();
            return;
          }

          await bookmarkService.deleteBookmark(id);
          console.log(chalk.green('✅ Bookmark removed successfully!'));
          console.log(chalk.gray(`   Removed: ${bookmark.title}`));

          bookmarkService.close();
        } catch (error) {
          console.error(
            chalk.red('❌ Failed to remove bookmark:'),
            error instanceof Error ? error.message : String(error)
          );
        }
      })
  )
  .addCommand(
    new Command('stats')
      .description('Show bookmark statistics')
      .action(async () => {
        try {
          const bookmarkService = new BookmarkService();
          const stats = await bookmarkService.getBookmarkStats();

          console.log(chalk.bold.blue('📊 Bookmark Statistics:\n'));

          console.log(
            chalk.green(`📚 Total Bookmarks: ${stats.totalBookmarks}`)
          );
          console.log(
            chalk.green(`📁 Total Collections: ${stats.totalCollections}`)
          );

          if (Object.keys(stats.bookmarksByDocset).length > 0) {
            console.log(chalk.yellow('\n📋 Bookmarks by Docset:'));
            Object.entries(stats.bookmarksByDocset)
              .sort(([, a], [, b]) => b - a)
              .forEach(([docset, count]) => {
                console.log(chalk.gray(`   ${docset}: ${count}`));
              });
          }

          if (Object.keys(stats.bookmarksByCategory).length > 0) {
            console.log(chalk.yellow('\n🏷️  Bookmarks by Category:'));
            Object.entries(stats.bookmarksByCategory)
              .sort(([, a], [, b]) => b - a)
              .forEach(([category, count]) => {
                console.log(chalk.gray(`   ${category}: ${count}`));
              });
          }

          if (stats.mostUsedTags.length > 0) {
            console.log(chalk.yellow('\n🏷️  Most Used Tags:'));
            stats.mostUsedTags.slice(0, 10).forEach(({ tag, count }) => {
              console.log(chalk.gray(`   #${tag}: ${count}`));
            });
          }

          if (stats.recentActivity.length > 0) {
            console.log(chalk.yellow('\n⏰ Recent Activity:'));
            stats.recentActivity.slice(0, 5).forEach((bookmark) => {
              console.log(
                chalk.gray(
                  `   ${bookmark.title} (${bookmark.createdAt.toLocaleDateString()})`
                )
              );
            });
          }

          bookmarkService.close();
        } catch (error) {
          console.error(
            chalk.red('❌ Failed to get bookmark stats:'),
            error instanceof Error ? error.message : String(error)
          );
        }
      })
  );

function getImportanceIcon(importance: 'low' | 'medium' | 'high'): string {
  switch (importance) {
    case 'high':
      return chalk.red('⭐');
    case 'medium':
      return chalk.yellow('📌');
    case 'low':
      return chalk.gray('📋');
    default:
      return chalk.yellow('📌');
  }
}
