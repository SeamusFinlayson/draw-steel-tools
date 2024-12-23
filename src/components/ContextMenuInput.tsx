import PartiallyControlledInput from "./PartiallyControlledInput";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { InputColor } from "@/colorHelpers";

export default function Input({
  parentValue,
  showParentValue = false,
  color = "WHITE",
  updateHandler,
  name,
  label,
  labelStyle = "VISIBLE",
  animateOnlyWhenRootActive = false,
  clearContentOnFocus = false,
}: {
  parentValue: string;
  showParentValue?: boolean;
  color?: InputColor | "WHITE";
  updateHandler: (target: HTMLInputElement) => void;
  name: string;
  label: string;
  labelStyle?: "VISIBLE" | "HIDDEN" | "PLACEHOLDER";
  animateOnlyWhenRootActive?: boolean;
  clearContentOnFocus?: boolean;
}): React.JSX.Element {
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const animationDuration75 = animateOnlyWhenRootActive
    ? "group-focus-within/root:duration-75 group-hover/root:duration-75"
    : "duration-75";
  const animationDuration150 = animateOnlyWhenRootActive
    ? "group-focus-within/root:duration-150 group-hover/root:duration-150"
    : "duration-150";

  return (
    <div className="pt-0.5 text-text-primary dark:text-text-primary-dark">
      <div
        className={cn("group bg-gradient-to-t", {
          "from-stat-red/10 dark:from-stat-red-dark/10": color === "RED",
          "from-stat-green/10 dark:from-stat-green-dark/10": color === "GREEN",
          "from-stat-blue/10 dark:from-stat-blue-dark/10": color === "BLUE",
        })}
        onClick={() => {
          if (inputRef.current) inputRef.current.focus();
        }}
      >
        <div className="space-y-1">
          {(labelStyle === "VISIBLE" || labelStyle === "HIDDEN") && (
            <label
              htmlFor={name}
              className={cn(
                "block text-xs font-normal text-text-secondary dark:text-text-secondary-dark",
                { "invisible w-0 text-nowrap": labelStyle === "HIDDEN" },
              )}
            >
              {label}
            </label>
          )}

          <div className="flex" onClick={(e) => e.stopPropagation()}>
            <PartiallyControlledInput
              ref={inputRef}
              id={name}
              name={name}
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
              parentValue={parentValue.toString()}
              onUserConfirm={updateHandler}
              clearContentOnFocus={clearContentOnFocus}
              className={cn("w-full bg-transparent outline-none")}
              placeholder={labelStyle === "PLACEHOLDER" ? label : undefined}
            />
          </div>
        </div>

        <div
          className={cn(
            animationDuration75,
            "flex min-h-[2px] gap-2 border-b group-focus-within:border-b-2",
            {
              "border-stat-red dark:border-stat-red-dark": color === "RED",
              "border-stat-green dark:border-stat-green-dark":
                color === "GREEN",
              "border-stat-blue dark:border-stat-blue-dark": color === "BLUE",
              "border-text-secondary group-hover:border-b-2 group-hover:border-text-primary dark:border-text-secondary-dark dark:group-hover:border-text-primary-dark":
                !hasFocus,
            },
          )}
        />
      </div>
      {showParentValue ? (
        <div
          className={cn(
            animationDuration150,
            "rounded-b-sm px-0.5 text-xs transition-all",
            { "bg-stat-red-dark/25": color === "RED" },
            { "bg-stat-green-dark/25": color === "GREEN" },
            { "bg-stat-blue-dark/25": color === "BLUE" },
            {
              "translate-y-0 opacity-100": true,
              "pointer-events-none -translate-y-2 opacity-0":
                !hasFocus || parentValue === "0",
            },
          )}
        >
          {parentValue}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
