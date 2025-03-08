import { HomeHero } from "@/components/home/hero";
import { HomeFeatures } from "@/components/home/features";
import { HomeStats } from "@/components/home/stats";
import { HomeMagic } from "@/components/home/magic";
import { HomeCTA } from "@/components/home/cta";
import { HomeTeam } from "@/components/home/team";

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <HomeHero />
      <HomeFeatures />
      {/* <HomeStats /> */}
      <HomeMagic />
      <HomeTeam />
      <HomeCTA />
    </main>
  );
}
