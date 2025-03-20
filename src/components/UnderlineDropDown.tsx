import React from "react";
import { animationDuration150 } from "./tailwindStrings";
import { InputColor } from "@/colorHelpers";
import { cn } from "@/lib/utils";

export default function UnderlineDropDown({
  content,
  hasFocus,
  animateOnlyWhenRootActive = false,
}: {
  content: string;
  hasFocus: boolean;
  color: InputColor | "DEFAULT";
  animateOnlyWhenRootActive?: boolean;
}): React.JSX.Element {
  return (
    <div
      className={cn(
        animationDuration150(animateOnlyWhenRootActive),
        "rounded-b-sm px-0.5 text-xs transition-all",
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
