"use client";

import { formatDistanceToNow } from "date-fns";
import { Assignment } from "@/lib/utils/assigment-typs";
import { motion } from "framer-motion";

interface AssignmentResultProps {
  assignment: Assignment;
}

export function AssignmentResult({ assignment }: AssignmentResultProps) {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <motion.h1 
          className="text-3xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {assignment.title}
        </motion.h1>
        <motion.p 
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Generated {formatDistanceToNow(new Date(assignment.createdAt))} ago
        </motion.p>
      </div>

      <motion.div 
        className="prose dark:prose-invert max-w-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {assignment.text}
        </p>
      </motion.div>
    </motion.div>
  );
}