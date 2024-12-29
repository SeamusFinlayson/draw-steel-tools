import React from "react";
import { animationDuration150 } from "./tailwindStrings";
import { InputColor } from "@/colorHelpers";
import { cn } from "@/lib/utils";

export default function UnderlineDropDown({
  content,
  hasFocus,
  color,
  justification = "LEFT",
  animateOnlyWhenRootActive = false,
}: {
  content: string;
  hasFocus: boolean;
  color: InputColor | "DEFAULT";
  justification?: "LEFT" | "CENTER";
  animateOnlyWhenRootActive?: boolean;
}): React.JSX.Element {
  return (
    <div
      className={cn(
        animationDuration150(animateOnlyWhenRootActive),
        "rounded-b-sm px-0.5 text-xs transition-all",
        { "text-center": justification === "CENTER" },
        { "bg-stat-red-dark/25": color === "RED" },
        { "bg-stat-green-dark/25": color === "GREEN" },
        { "bg-stat-blue-dark/25": color === "BLUE" },
        {
          "translate-y-0 opacity-100": true,
          "pointer-events-none -translate-y-2 opacity-0":
            !hasFocus || content === "",
        },
      )}
    >
      {content}
    </div>
  );
}
