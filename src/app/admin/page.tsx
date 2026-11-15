import React, { Suspense } from 'react';
import AdminDashboardContent from './AdminDashboardContent';

export const metadata = {
  title: 'Staff Portal | The FCS Guys',
};

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#888888]">Loading control console...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
