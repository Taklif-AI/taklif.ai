"use client";

import { Github, Twitter, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          {/* Logo and Copyright */}
          <div className="text-sm text-muted-foreground">
            <div className="w-48 mx-auto md:mx-0">
              <Logo />
            </div>
            © {new Date().getFullYear()} Taklif.AI. All rights reserved.
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="/privacy-policy"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <span className="text-sm">Privacy Policy</span>
            </a>
            <a
              href="/terms-of-use"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <span className="text-sm">Terms of Use</span>
            </a>
          </div>

          {/* Contact and Social Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="mailto:taklif.ai.contact@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm">taklif.ai.contact@gmail.com</span>
            </a>
            {/* Uncomment if you want to add social links */}
            {/* <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
