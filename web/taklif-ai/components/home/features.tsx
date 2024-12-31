"use client";

import { Card } from "@/components/ui/card";
import { BookOpen, Brain, Target } from "lucide-react";

function FeatureCard({ icon, title, description, gradient }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <Card className={`p-6 hover:scale-105 transition-all duration-300 ${gradient} border-none shadow-lg`}>
      <div className="mb-4 text-white">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/90">{description}</p>
    </Card>
  );
}

export function HomeFeatures() {
  return (
    <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/50 to-white dark:from-background dark:via-violet-950/20 dark:to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-80"
        aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-violet-300 to-violet-200 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            Transform Learning with AI
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover how Taklif.ai revolutionizes assignment creation
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="Smart Analysis"
            description="AI-powered content understanding that adapts to your learning style"
            gradient="bg-gradient-to-br from-violet-600 to-violet-400"
          />
          <FeatureCard
            icon={<Target className="h-8 w-8" />}
            title="Personalized Learning"
            description="Tailored assignments that match your interests and goals"
            gradient="bg-gradient-to-br from-fuchsia-600 to-pink-400"
          />
          <FeatureCard
            icon={<BookOpen className="h-8 w-8" />}
            title="Comprehensive Coverage"
            description="Generate diverse questions across multiple topics and difficulty levels"
            gradient="bg-gradient-to-br from-purple-600 to-purple-400"
          />
        </div>
      </div>
    </section>
  );
}