import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://thefcsguys.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'The FCS Guys | The Premier NCAA Division I FCS Football Authority',
    template: '%s | The FCS Guys',
  },
  description: 'National coverage, Top 25 media poll, 24-team playoff bracketology, film room breakdowns, and conference standings for NCAA Division I FCS Football.',
  keywords: [
    'FCS Football',
    'NCAA Division I FCS',
    'FCS Top 25',
    'FCS Playoff Bracket',
    'Road to Frisco',
    'Big Sky Football',
    'MVFC Football',
    'CAA Football',
    'SoCon Football',
  ],
  authors: [{ name: 'The FCS Guys Editorial Syndicate' }],
  creator: 'The FCS Guys',
  publisher: 'The FCS Guys Media Network',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'The FCS Guys',
    title: 'The FCS Guys | Premier NCAA Division I FCS Football Media',
    description: 'National coverage, Top 25 rankings, 24-team playoff bracketology, and conference standings for NCAA Division I FCS.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'The FCS Guys - College Football Gridiron Coverage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The FCS Guys | NCAA Division I FCS Football',
    description: 'National coverage, Top 25 rankings, 24-team playoff bracketology, and film room analysis.',
    images: ['https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&q=80&w=1200'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'The FCS Guys',
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    sameAs: [
      'https://x.com/thefcsguys',
      'https://youtube.com/@thefcsguys',
    ],
    description: 'The premier independent sports media brand dedicated exclusively to NCAA Division I FCS football.',
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#111111] text-white selection:bg-[#FFD400] selection:text-[#080808]">
        <Suspense fallback={<div className="h-16 bg-[#080808] border-b border-[#282828]" />}>
          <Header />
        </Suspense>
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
