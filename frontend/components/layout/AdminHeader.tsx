'use client';

import { UserButton } from '@/components/shared/UserButton';
import { MobileSidebar } from '@/components/layout/MobileSidebar';

export function AdminHeader() {
  return (
    <div className="flex items-center p-4 border-b">
      <MobileSidebar />
      <div className="flex w-full justify-end">
        <UserButton />
      </div>
    </div>
  );
}
