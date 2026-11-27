import React, { Suspense } from 'react';
import { ArticleEditorForm } from '@/components/admin/ArticleEditorForm';

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: 'Edit Article | FCS Guys CMS',
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#888888]">Loading article editor...</div>}>
      <ArticleEditorForm articleId={id} />
    </Suspense>
  );
}
