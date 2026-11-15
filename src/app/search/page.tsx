import React, { Suspense } from 'react';
import SearchContent from './SearchContent';

export const metadata = {
  title: 'Search | The FCS Guys',
  description: 'Search articles, teams, conferences, and playoff projections across The FCS Guys.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#888888]">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

