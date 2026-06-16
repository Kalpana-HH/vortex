import { useState } from 'react';
import { Search, Calendar, User, Tag, ArrowRight, X, BookOpen } from 'lucide-react';
import { blogPosts } from '../data/blog';
import { BlogPost } from '../types';

export default function BlogCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Categories extraction
  const categories = ['All', 'Build & Hardware', 'Programming & Control', 'Outreach & CAD'];

  // Handle post filter
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="relative scroll-mt-20 py-12" id="blog-section">
      <div className="flex flex-col gap-8">
        {/* Module Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-cyan-650 dark:text-cyan-405">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-bold tracking-widest uppercase">Build Diaries & Updates</span>
            </div>
            <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
              The Vortex Team Blog
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-450 max-w-xl">
              Follow our engineering iterations, outreach milestones, software calibrations, and strategic updates from our robotics lab.
            </p>
          </div>

          {/* Search Inputs */}
          <div className="relative w-full max-w-xs md:max-w-sm">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search posts, tags, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 py-2.5 pr-4 pl-10 text-sm outline-none transition-all focus:border-cyan-500 focus:shadow-md dark:border-slate-800 dark:bg-slate-950/70 dark:text-white"
              id="blog-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-850">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-sm dark:bg-cyan-500'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200'
              }`}
              id={`blog-tab-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Post List */}
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/10">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              No development logs found matching "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs font-bold text-cyan-600 hover:underline dark:text-cyan-400"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-850 dark:bg-slate-900"
                id={`blog-post-card-${post.id}`}
              >
                <div className="flex flex-col gap-3">
                  {/* Category & Read Time */}
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
                      {post.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-sans text-lg font-bold tracking-tight text-slate-800 group-hover:text-cyan-600 transition-colors dark:text-slate-100 dark:group-hover:text-cyan-400">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-850/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {post.author.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{post.author}</span>
                      <span className="text-[9px] font-medium text-slate-400">{post.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPost(post)}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-600 group-hover:translate-x-1 transition-transform dark:text-cyan-400"
                    id={`blog-btn-read-${post.id}`}
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Reader Modal Overlay */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" id="blog-modal-backdrop">
          <div
            className="relative flex h-full max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-100 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900"
            id="blog-modal-content"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[9px] font-extrabold tracking-wider uppercase text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
                    {selectedPost.category}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {selectedPost.readTime}
                  </span>
                </div>
                <h3 className="font-sans text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                  {selectedPost.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-850 dark:text-slate-400 dark:hover:bg-slate-800"
                id="blog-modal-close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8" id="blog-modal-scrollable-body">
              {/* Writer Header */}
              <div className="mb-6 flex items-center gap-3 border-b border-dotted border-slate-200 pb-5 dark:border-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white shadow-sm dark:bg-cyan-500">
                  {selectedPost.author.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedPost.author}</span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {selectedPost.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-semibold text-cyan-600 dark:text-cyan-400">
                      Active Contributor
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Content Markdown-like renderer */}
              <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                {selectedPost.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="mt-5 mb-2 font-sans text-base font-bold text-slate-800 dark:text-slate-150">
                        {paragraph.substring(4)}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('#### ')) {
                    return (
                      <h4 key={index} className="mt-4 mb-2 font-sans text-sm font-bold text-slate-700 dark:text-slate-250">
                        {paragraph.substring(5)}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('- ')) {
                    return (
                      <ul key={index} className="my-2 list-disc pl-5 text-xs space-y-1">
                        {paragraph
                          .split('\n')
                          .filter((li) => li.startsWith('- '))
                          .map((li, liIdx) => (
                            <li key={liIdx}>{li.substring(2)}</li>
                          ))}
                      </ul>
                    );
                  }
                  if (paragraph.startsWith('1. ')) {
                    return (
                      <ol key={index} className="my-2 list-decimal pl-5 text-xs space-y-1">
                        {paragraph
                          .split('\n')
                          .filter((li) => /^\d+\.\s/.test(li))
                          .map((li, liIdx) => (
                            <li key={liIdx}>{li.replace(/^\d+\.\s/, '')}</li>
                          ))}
                      </ol>
                    );
                  }
                  return (
                    <p key={index} className="my-3 text-xs leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Tags panel */}
              <div className="mt-8 flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-850 dark:text-slate-400"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/50 p-4 rounded-b-2xl dark:border-slate-800 dark:bg-slate-950/20">
              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-lg bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
