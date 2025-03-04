"use client";

import { formatDistanceToNow } from "date-fns";
import { Assignment } from "@/lib/types/assigment-type";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Sparkles } from "lucide-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize"; 
import "katex/dist/katex.min.css";


interface AssignmentResultProps {
  assignment: Assignment;
}

export function AssignmentResult({ assignment }: AssignmentResultProps) {

  const title = assignment.model_output.title;

  // Regular expression to match emojis
  const emojiRegex = /(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Emoji})+/gu;

  // Extract emojis from the title
  const emojis = title.match(emojiRegex) || [];
  // Remove emojis from the title
  const titleWithoutEmojis = title.replace(emojiRegex, "").trim();


  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>

        <div className="flex justify-between items-center">

          <h1 className="text-3xl font-bold mb-2">

            <motion.span
              className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >

              {titleWithoutEmojis}

            </motion.span>
            <span style={{ fontFamily: "Noto-Color-Emoji" }} className="font-Noto-Color-Emoji">{emojis}</span>
          </h1>
        </div>

        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Generated {formatDistanceToNow(new Date(assignment.created_at))} ago
        </motion.p>
        <div className="inline-flex items-center mt-5 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/20 backdrop-blur-sm border border-purple-200 dark:border-purple-500/20">
          <Sparkles className="h-4 w-4 text-sm text-purple-700 dark:text-purple-300" />
          <span className="text-sm text-purple-700 dark:text-purple-300">&nbsp; {assignment.item_type === 'Personalization' ? 'ASSIGNMENT PERSONALIZED' : 'ASSIGNMENT SIMPLIFIED'}</span>
        </div>
      </div>

      <motion.div
        className="prose dark:prose-invert max-w-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
       <ReactMarkdown
         remarkPlugins={[remarkGfm, remarkMath]}
         rehypePlugins={[rehypeSanitize, rehypeKatex]}
       >
          {assignment.model_output.content}
        </ReactMarkdown>
      </motion.div>
    </motion.div>
  );
}