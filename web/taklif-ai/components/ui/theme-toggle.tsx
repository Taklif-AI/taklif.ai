"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import "@theme-toggles/react/css/Around.css";
import { Around } from "@theme-toggles/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Set dark theme as default
  React.useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="flex items-center gap-2 ">
      {/* <Around className="w-[37px] h-[37px]"
        duration={1000}
        onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}      /> */}
    
    <label className="theme-toggle" title="Toggle theme">
  <input type="checkbox" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}/>
  <span className="theme-toggle-sr">Toggle theme</span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    width="30px"
    height="30px"
    fill="currentColor"
    className="theme-toggle__around"
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