"use client";

import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, RefreshCw, Wand2, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { Assignment } from "@/lib/types/assigment-type";

interface AssignmentActionsProps {
  isPending: boolean,
  assignment: Assignment
  onAction: (action: 'like' | 'dislike' | 'copied' | 'repersonalized' | 'simplify') => void;
}

export function AssignmentActions({ assignment, onAction, isPending }: AssignmentActionsProps) {
  return (

    <motion.div
      className="flex flex-wrap items-center gap-4 pt-4 border-t"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            disabled={assignment.feedback?.like?.value || isPending}
            variant="ghost"
            size="sm"
            onClick={() => onAction('like')}
            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            disabled={assignment.feedback?.dislike?.value || isPending}
            variant="ghost"
            size="sm"
            onClick={() => onAction('dislike')}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <ThumbsDown className="h-4 w-4 mr-1" />
          </Button>
        </motion.div>
      </div>
      <div>
        <Copy size={20} onClick={() => onAction('copied')} className="cursor-pointer text-violet-600 hover:text-violet-700" />
      </div>
      {assignment.item_type === 'Personalization' && (
        <>
          <div className="flex items-center gap-2 ml-auto">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                disabled={isPending}
                variant="outline"
                size="sm"
                onClick={() => onAction('simplify')
                }
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
              >
                <Wand2 className="h-4 w-4 mr-1" />
                Simplify
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                disabled={isPending}
                variant="outline"
                size="sm"
                onClick={() => onAction('repersonalized')}
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Repersonalize
              </Button>
            </motion.div>
          </div>
        </>
      )}

    </motion.div>
  );
}