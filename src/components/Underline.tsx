import { InputColor } from "@/colorHelpers";
import { cn } from "@/lib/utils";
import React from "react";
import { animationDuration75 } from "./tailwindStrings";

export default function Underline({
  hasFocus,
  hasHover,
  color,
  animateOnlyWhenRootActive = false,
}: {
  hasFocus: boolean;
  hasHover: boolean;
  color: InputColor | "DEFAULT";
  animateOnlyWhenRootActive?: boolean;
}): React.JSX.Element {
  return (
    <div
      className={cn(
        animationDuration75(animateOnlyWhenRootActive),
        "min-h-[2px] border-b border-text-secondary transition-all dark:border-text-secondary-dark",
        {
          "border-stat-red dark:border-stat-red-dark":
            color === "RED" && hasFocus,
          "border-stat-green dark:border-stat-green-dark":
            color === "GREEN" && hasFocus,
          "border-stat-blue dark:border-stat-blue-dark":
            color === "BLUE" && hasFocus,
          "border-primary dark:border-primary-dark":
            color === "DEFAULT" && hasFocus,
          "border-b-2": hasFocus,
          "border-b-2 border-text-primary dark:border-text-primary-dark":
            hasHover && !hasFocus,
        },
      )}
    />
  );
}
