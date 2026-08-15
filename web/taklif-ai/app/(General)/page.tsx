import { HomeHero } from "@/components/home/hero";
import { HomeMagic } from "@/components/home/magic";
import { HomeCTA } from "@/components/home/cta";

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <HomeHero />
      <HomeMagic />
      <HomeCTA />
    </main>
  );
}
