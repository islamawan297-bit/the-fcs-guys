import React from 'react';
import { getDynamicPublishedArticles } from '@/services/dynamic-content.service';
import { NewsPageClient } from './NewsPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News & Trench Analysis | The FCS Guys',
  description: 'Deep dives, verified reporting, coaching carousel updates, and film breakdowns from all 14 NCAA Division I FCS conferences.',
  openGraph: {
    title: 'FCS National Newsroom | The FCS Guys',
    description: 'Deep dives, verified reporting, coaching carousel updates, and film breakdowns from all 14 NCAA Division I FCS conferences.',
    type: 'website',
  },
};

export default async function NewsPage() {
  const articles = await getDynamicPublishedArticles();
  return <NewsPageClient initialArticles={articles} />;
}
