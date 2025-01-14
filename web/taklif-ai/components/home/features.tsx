"use client"

import { motion } from "framer-motion"
import { Brain, BookOpen, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Smart Analysis",
    description: "AI-powered content understanding that adapts to your learning style.",
    icon: Brain,
  },
  {
    title: "Personalized Learning",
    description: "Tailored assignments that match your interests and goals.",
    icon: Sparkles,
  },
  {
    title: "Comprehensive Coverage",
    description: "Generate diverse questions across multiple topics and difficulty levels.",
    icon: BookOpen,
  },
]

export function HomeFeatures() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent md:text-4xl">
            The Three Pillars of Taklif.ai
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
            Discover how our AI-powered platform revolutionizes the way assignments are created and personalized.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="group relative overflow-hidden border-purple-500/20 bg-white dark:bg-purple-950/30 transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/40">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <CardHeader>
                  <feature.icon className="mb-4 h-12 w-12 text-purple-400" />
                  <CardTitle className="text-xl text-gray-800 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}