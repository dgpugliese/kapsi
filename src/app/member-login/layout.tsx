import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brothers Only Login — Kappa Alpha Psi® Fraternity, Inc.',
};

export default function MemberLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
