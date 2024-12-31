"use client";

import { Card } from "@/components/ui/card";
import { Users, BookOpen, School, Brain } from "lucide-react";
import CountUp from "react-countup";

const stats = [
  {
    label: "Active Users",
    value: 50000,
    icon: Users,
    suffix: "+",
    color: "from-violet-600 to-violet-400"
  },
  {
    label: "Assignments Created",
    value: 150000,
    icon: BookOpen,
    suffix: "+",
    color: "from-fuchsia-600 to-pink-400"
  },
  {
    label: "Educational Institutions",
    value: 1000,
    icon: School,
    suffix: "+",
    color: "from-purple-600 to-purple-400"
  },
  {
    label: "Topics Covered",
    value: 100,
    icon: Brain,
    suffix: "+",
    color: "from-indigo-600 to-indigo-400"
  }
];

export function HomeStats() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-violet-50/50 to-white dark:from-background dark:via-violet-950/20 dark:to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))]" />
      <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80"
        aria-hidden="true">
        <div className="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-200 to-violet-100 opacity-20 sm:right-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            Trusted by Educators Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of educators transforming their teaching experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className={`p-3 rounded-lg w-12 h-12 mb-4 flex items-center justify-center bg-gradient-to-br ${stat.color} text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold mb-2">
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    suffix={stat.suffix}
                  />
                </h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}