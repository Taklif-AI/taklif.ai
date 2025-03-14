"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found";
  }, []);
  return (
    <div className="min-h-screen bg-[#13111C] flex items-center justify-center p-4">
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 " />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative text-center space-y-8"
        >
          <img src="404.gif" alt="404" className="w-[600px] mx-auto" />

          {/* Centered Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center"
          >
            <Link href="/">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-full mt-5"
              >
                Return Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
