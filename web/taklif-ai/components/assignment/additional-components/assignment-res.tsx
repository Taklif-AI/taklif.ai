"use client";

import { formatDistanceToNow } from "date-fns";
import { Assignment } from "@/lib/types/assigment-type";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { MdContentCopy } from 'react-icons/md';
import { Toast } from "@/lib/utils/toast";
import { Sparkles, Copy, ArrowRight ,ArrowLeft } from "lucide-react";

import rehypeSanitize from "rehype-sanitize";

interface AssignmentResultProps {
  assignment: Assignment;
}

export function AssignmentResult({ assignment }: AssignmentResultProps) {
  
  const title = assignment.title;
 
  // Regular expression to match emojis
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  
  // Extract emojis from the title
  const emojis = title.match(emojiRegex) || [];  
  // Remove emojis from the title
  const titleWithoutEmojis = title.replace(emojiRegex, "").trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(assignment.text);
    Toast.success("Assignment copied to clipboard!", );
  };

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
      <span>{emojis}</span> 
    </h1>
      <div>

      <Copy size={20} onClick={handleCopy} className="cursor-pointer text-violet-600 hover:text-violet-700" />
      </div>
      
      </div>

        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Generated {formatDistanceToNow(new Date(assignment.createdAt))} ago
        </motion.p>
        <div className="inline-flex items-center mt-5 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/20 backdrop-blur-sm border border-purple-200 dark:border-purple-500/20">
            <Sparkles className="h-4 w-4 text-sm text-purple-700 dark:text-purple-300"/>
              <span className="text-sm text-purple-700 dark:text-purple-300">&nbsp; ASSIGNMENT SIMPLIFIED</span>
            </div>
      </div>

      <motion.div
        className="prose dark:prose-invert max-w-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ReactMarkdown rehypePlugins={[rehypeSanitize]} className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {assignment.text}
        </ReactMarkdown>
      </motion.div>
      

    </motion.div>
  );
}