import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES_DATA } from '@/data/fcs-data';
import { ArticleCard } from '@/components/ArticleCard';
import { Newsletter } from '@/components/Newsletter';
import { 
  Clock, 
  Calendar, 
  Share2, 
  ChevronLeft, 
  Tag, 
  CheckCircle2, 
  ShieldCheck,
  Bookmark
} from 'lucide-react';

export function generateStaticParams() {
  return ARTICLES_DATA.map((article) => ({
    slug: article.slug,
  }));
}

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = ARTICLES_DATA.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = ARTICLES_DATA.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <article className="space-y-10 sm:space-y-12">
      
      {/* Back to news button */}
      <div>
        <Link 
          href="/news" 
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#B5B5B5] hover:text-[#FFD400] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to News & Wire
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 max-w-4xl">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-[#FFD400] text-[#080808] text-xs font-black uppercase tracking-wider rounded">
            {article.category}
          </span>
          {article.conference && (
            <span className="text-xs font-bold text-white uppercase tracking-wider bg-[#181818] px-2.5 py-1 rounded border border-[#333333]">
              {article.conference}
            </span>
          )}
          <span className="text-xs text-[#888888] flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-lg sm:text-xl text-[#B5B5B5] leading-relaxed">
          {article.excerpt}
        </p>

        {/* Author / Date Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#282828]">
          <div className="flex items-center space-x-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#FFD400]"
            />
            <div>
              <div className="text-sm font-bold text-white flex items-center">
                {article.author.name}
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFD400] ml-1.5" />
              </div>
              <div className="text-xs text-[#888888]">{article.author.role}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs text-[#888888]">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#FFD400]" />
              {article.publishedAt}
            </span>
            <div className="flex items-center space-x-2">
              <button 
                className="p-2 rounded bg-[#181818] border border-[#282828] text-[#B5B5B5] hover:text-white hover:border-[#FFD400] transition-colors"
                title="Bookmark article"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button 
                className="p-2 rounded bg-[#181818] border border-[#282828] text-[#B5B5B5] hover:text-white hover:border-[#FFD400] transition-colors"
                title="Share article"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Feature Image */}
      <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-[#282828] shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        {article.imageCaption && (
          <div className="absolute bottom-0 inset-x-0 bg-[#080808]/80 backdrop-blur-sm text-[11px] text-[#888888] py-2 px-4 border-t border-[#222222]">
            {article.imageCaption}
          </div>
        )}
      </div>

      {/* Editorial Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Body (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div 
            className="prose prose-invert prose-lg max-w-none text-[#cccccc] leading-relaxed space-y-5
              [&>h2]:text-2xl [&>h2]:font-black [&>h2]:uppercase [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4
              [&>blockquote]:border-l-4 [&>blockquote]:border-[#FFD400] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-[#ffffff] [&>blockquote]:my-6
              [&>p.lead]:text-xl [&>p.lead]:text-[#e0e0e0] [&>p.lead]:font-medium"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          <div className="pt-8 border-t border-[#282828]">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-bold text-[#888888] uppercase mr-2 flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1" /> Filed Under:
              </span>
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded bg-[#181818] border border-[#282828] text-xs font-semibold text-[#B5B5B5]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Box */}
          <div className="p-6 rounded-xl bg-[#181818] border border-[#282828] flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#FFD400] shrink-0"
            />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white uppercase">
                Written by {article.author.name}
              </h4>
              <p className="text-xs text-[#FFD400] font-semibold">{article.author.role}</p>
              <p className="text-xs text-[#888888] leading-relaxed">
                Covering the FCS beat with deep film analysis, coach conversations, and advanced analytics since 2018. Member of the FCS National Media Voting Syndicate.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#181818] border border-[#282828] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#282828] pb-2">
              Inside This Story
            </h3>
            <ul className="space-y-2 text-xs text-[#B5B5B5]">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD400] shrink-0" />
                <span>Verified Division I game analytics</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD400] shrink-0" />
                <span>Postseason selection committee implications</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD400] shrink-0" />
                <span>Coaches & film breakdown updates</span>
              </li>
            </ul>
          </div>

          {/* Related Articles list */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#282828] pb-2">
              Related Coverage
            </h3>
            <div className="space-y-3">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <Newsletter />
    </article>
  );
}
