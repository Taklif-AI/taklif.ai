"use client"; // Add this line
import SVGIMG from "../../public/taklif-logo.svg";
import SVGIMGt from "../../public/Taklif.AI-Light.svg";

import { useTheme } from "next-themes";
import Image from "next/image";

export  function Logo() {
  
  const { resolvedTheme } = useTheme();
  const logoLight = SVGIMGt; // Path to light mode logo
  const logoDark = SVGIMG; // Path to dark mode logo
  return (
    <Image loading="eager"  width={500} height={500} suppressHydrationWarning={true}     src={resolvedTheme === "light" ? logoLight : logoDark}
 alt={""} />

  );
}