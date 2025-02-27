import './globals.css';
import type { Metadata } from 'next';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'Taklif.AI',
  description: 'AI-powered assignment generation for personalized learning',
};

export default async function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <div className="flex-1 pt-16">
          {children}
        </div>
        <Footer />
      </div>
    </SessionProvider>
  );
}