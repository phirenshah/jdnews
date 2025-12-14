
'use client';

import { Suspense } from 'react';

export default function DonatePayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
