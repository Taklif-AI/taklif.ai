"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Image from "next/image";

interface SocialAuthButtonsProps {
  mode: "sign-in" | "sign-up";
}

export function SocialAuthButtons({ mode }: SocialAuthButtonsProps) {
  const handleGoogleAuth = () => {
    // TODO: Implement Google auth
    console.log("Google auth");
  };

  const handleGithubAuth = () => {
    // TODO: Implement GitHub auth
    console.log("GitHub auth");
  };

  const text = mode === "sign-in" ? "Sign in" : "Sign up";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-800 hover:text-white"
          onClick={handleGoogleAuth}
        >
          <Image
            src="https://www.google.com/favicon.ico"
            alt="Google"
            width={16}
            height={16}
            className="mr-2"
          />
          Google
        </Button>
        
        <Button
          variant="outline"
          className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-800 hover:text-white"
          onClick={handleGithubAuth}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
        </div>
      </div>
    </div>
  );
}