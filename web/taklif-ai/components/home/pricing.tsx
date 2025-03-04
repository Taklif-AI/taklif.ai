"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

function PricingCard({
  title,
  price,
  description,
  features,
  highlighted = false,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <Card
      className={`p-8 relative overflow-hidden transition-all duration-300 hover:scale-105 ${
        highlighted
          ? "border-2 border-violet-500 shadow-xl bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-background"
          : "hover:border-violet-200"
      }`}
    >
      {highlighted && (
        <div className="absolute top-0 right-0 bg-violet-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
          Popular
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
          {price}
        </span>
        {price !== "Custom" && (
          <span className="text-muted-foreground">/month</span>
        )}
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-violet-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`w-full ${
          highlighted
            ? "bg-violet-600 hover:bg-violet-700"
            : "bg-violet-100 hover:bg-violet-200 text-violet-900"
        }`}
      >
        Get Started
      </Button>
    </Card>
  );
}

export function HomePricing() {
  return (
    <section
      id="pricing"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-violet-50 dark:from-background dark:to-violet-950/20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your needs
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <PricingCard
            title="Starter"
            price="Free"
            description="Perfect for trying out our AI tools"
            features={[
              "5 AI generations/day",
              "Basic assignment types",
              "Community support",
              "Standard templates",
            ]}
          />
          <PricingCard
            title="Pro"
            price="$29"
            description="For educators and learning professionals"
            features={[
              "Unlimited generations",
              "Advanced assignment types",
              "Priority support",
              "Custom templates",
              "Analytics dashboard",
            ]}
            highlighted
          />
          <PricingCard
            title="Enterprise"
            price="Custom"
            description="For educational institutions"
            features={[
              "Custom solutions",
              "Dedicated support",
              "SLA guarantee",
              "Advanced security",
              "API access",
              "Team collaboration",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
