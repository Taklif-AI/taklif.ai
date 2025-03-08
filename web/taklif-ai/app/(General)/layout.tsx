import "./globals.css";
import type { Metadata } from "next";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { SessionProvider } from "next-auth/react";
import { AssignmentsProvider } from "@/components/providers/assignments-provider";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Taklif.AI",
  description: "AI-powered assignment generation for personalized learning",
};

export default async function GeneralLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <AssignmentsProvider>
        <div className="relative flex min-h-screen flex-col bg-[#F8F9FA] dark:bg-[#121212] text-gray-900 dark:text-gray-100">
          <Navigation />
          <div className="flex-1 pt-16">{children}</div>
          <Footer />
        </div>
      </AssignmentsProvider>
    </SessionProvider>
  );
}
