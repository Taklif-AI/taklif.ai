"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import "@theme-toggles/react/css/Around.css";

export function ThemeToggle() {
  const { setTheme } = useTheme();


  React.useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="flex items-center gap-2">
      <label className="theme-toggle relative group" title="Toggle theme">
        {/* Glow effect using TailwindCSS */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 before:absolute before:inset-0 before:rounded-full before:blur-lg before:bg-purple-500/100"></div>

        <input
          type="checkbox"
          onChange={(e) => {
            const checked = e.target.checked;
            setTimeout(() => {
              setTheme(!checked ? "dark" : "light");
            }, 450);
          }}
          className="hidden"
        />

        <span className="theme-toggle-sr">Toggle theme</span>

        {/* Theme Toggle SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          width="20px"
          height="20px"
          fill="currentColor"
          className="theme-toggle__around transition-transform duration-200 relative z-10 rounded-full"
          viewBox="0 0 32 32"
          theme-toggle="300"
        >
          <clipPath id="theme-toggle__around__cutout">
            <path d="M0 0h42v30a1 1 0 00-16 13H0Z" />
          </clipPath>
          <g clipPath="url(#theme-toggle__around__cutout)">
            <circle cx={16} cy={16} r="8.4" />
            <g>
              <circle cx={16} cy="3.3" r="2.3" />
              <circle cx={27} cy="9.7" r="2.3" />
              <circle cx={27} cy="22.3" r="2.3" />
              <circle cx={16} cy="28.7" r="2.3" />
              <circle cx={5} cy="22.3" r="2.3" />
              <circle cx={5} cy="9.7" r="2.3" />
            </g>
          </g>
        </svg>
      </label>
    </div>
  );
}
