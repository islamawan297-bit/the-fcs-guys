import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';
import { Clock, ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  variant?: 'featured' | 'standard' | 'compact' | 'horizontal';
}

export function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded-xl bg-[#181818] border border-[#282828] hover:border-[#383838] transition-all duration-300">
        <Link href={`/news/${article.slug}`} className="block relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
            <div className="flex items-center space-x-3 mb-3">
              <span className="px-3 py-1 bg-[#FFD400] text-[#080808] text-xs font-black uppercase tracking-wider rounded">
                {article.category}
              </span>
              {article.conference && (
                <span className="text-xs font-bold text-white uppercase tracking-wider bg-[#181818]/90 px-2.5 py-0.5 rounded border border-[#333333]">
                  {article.conference}
                </span>
              )}
              <span className="text-xs text-[#B5B5B5] flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {article.readTime}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white group-hover:text-[#FFD400] transition-colors leading-tight mb-3">
              {article.title}
            </h2>

            <p className="text-sm sm:text-base text-[#B5B5B5] line-clamp-2 sm:line-clamp-3 max-w-3xl mb-4 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex items-center space-x-3 text-xs text-[#888888]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-7 h-7 rounded-full object-cover border border-[#333333]"
              />
              <span className="text-white font-medium">{article.author.name}</span>
              <span>&bull;</span>
              <span>{article.publishedAt}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group bg-[#181818] border border-[#282828] hover:border-[#383838] rounded-xl overflow-hidden p-4 transition-all duration-200">
        <Link href={`/news/${article.slug}`} className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          <div className="sm:w-1/3 aspect-[16/10] overflow-hidden rounded-lg relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#FFD400] text-[#080808] text-[10px] font-black uppercase tracking-wider rounded">
              {article.category}
            </span>
          </div>

          <div className="flex flex-col justify-between flex-1 py-1">
            <div>
              <div className="flex items-center space-x-2 text-xs text-[#888888] mb-1.5">
                {article.conference && (
                  <span className="font-semibold text-[#FFD400] uppercase text-[11px]">
                    {article.conference}
                  </span>
                )}
                <span>&bull;</span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#FFD400] transition-colors line-clamp-2 leading-snug mb-2">
                {article.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#B5B5B5] line-clamp-2 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#222222] mt-3 text-xs text-[#888888]">
              <div className="flex items-center space-x-2">
                <span className="text-[#B5B5B5] font-medium">{article.author.name}</span>
                <span>&bull;</span>
                <span>{article.publishedAt}</span>
              </div>
              <span className="text-[#FFD400] font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                Read <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group py-3 border-b border-[#222222] last:border-b-0">
        <Link href={`/news/${article.slug}`} className="block">
          <div className="flex items-center space-x-2 text-[11px] mb-1">
            <span className="text-[#FFD400] font-bold uppercase">{article.category}</span>
            <span className="text-[#555555]">&bull;</span>
            <span className="text-[#777777]">{article.readTime}</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-[#FFD400] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h4>
          <span className="text-[11px] text-[#666666] mt-1 block">
            {article.publishedAt}
          </span>
        </Link>
      </article>
    );
  }

  // Default Standard Grid Card
  return (
    <article className="group flex flex-col bg-[#181818] border border-[#282828] hover:border-[#3a3a3a] rounded-xl overflow-hidden transition-all duration-300">
      <Link href={`/news/${article.slug}`} className="block relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className="px-2.5 py-1 bg-[#080808]/90 backdrop-blur-sm border border-[#333333] text-[#FFD400] text-[11px] font-black uppercase tracking-wider rounded">
            {article.category}
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#888888] mb-2.5">
            {article.conference && (
              <span className="font-semibold text-white uppercase text-[11px]">
                {article.conference}
              </span>
            )}
            <span>&bull;</span>
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {article.readTime}
            </span>
          </div>

          <Link href={`/news/${article.slug}`}>
            <h3 className="text-lg font-bold text-white group-hover:text-[#FFD400] transition-colors line-clamp-2 leading-tight mb-2.5">
              {article.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-[#B5B5B5] line-clamp-2 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-[#222222] flex items-center justify-between text-xs text-[#888888]">
          <div className="flex items-center space-x-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-6 h-6 rounded-full object-cover border border-[#333333]"
            />
            <span className="text-[#B5B5B5] truncate max-w-[120px]">{article.author.name}</span>
          </div>
          <span className="text-[#666666]">{article.publishedAt}</span>
        </div>
      </div>
    </article>
  );
}
