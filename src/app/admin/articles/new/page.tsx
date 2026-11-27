import React, { Suspense } from 'react';
import { ArticleEditorForm } from '@/components/admin/ArticleEditorForm';

export const metadata = {
  title: 'Create Article | FCS Guys CMS',
};

export default function NewArticlePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#888888]">Loading article editor...</div>}>
      <ArticleEditorForm />
    </Suspense>
  );
}
