import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taklif.AI",
  description: "AI-powered assignment generation for personalized learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
