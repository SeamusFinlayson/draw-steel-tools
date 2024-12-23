import PartiallyControlledInput from "./PartiallyControlledInput";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { InputColor } from "@/colorHelpers";
import { Plus } from "./icons/Plus";
import { Minus } from "./icons/Minus";

export default function Counter({
  parentValue,
  showParentValue = false,
  color = "WHITE",
  updateHandler,
  incrementHandler,
  decrementHandler,
  name,
  label,
  labelStyle = "VISIBLE",
  animateOnlyWhenRootActive = false,
  clearContentOnFocus = false,
}: {
  parentValue: number;
  showParentValue?: boolean;
  color?: InputColor | "WHITE";
  updateHandler: (target: HTMLInputElement) => void;
  incrementHandler: () => void;
  decrementHandler: () => void;
  name: string;
  label: string;
  labelStyle?: "VISIBLE" | "HIDDEN" | "PLACEHOLDER";
  animateOnlyWhenRootActive?: boolean;
  clearContentOnFocus?: boolean;
}): React.JSX.Element {
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHover, setHasHover] = useState(false);
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
        className={cn("bg-gradient-to-t", {
          "from-stat-red/10 dark:from-stat-red-dark/10": color === "RED",
          "from-stat-green/10 dark:from-stat-green-dark/10": color === "GREEN",
          "from-stat-blue/10 dark:from-stat-blue-dark/10": color === "BLUE",
        })}
        onClick={() => {
          if (inputRef.current) inputRef.current.focus();
        }}
      >
        <div className="space-y-0">
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

          <div
            className="flex border-text-secondary-dark"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button className="p-0.5" onClick={decrementHandler}>
              <Minus />
            </button>
            {/* <div className="border-r border-text-secondary-dark" /> */}
            <PartiallyControlledInput
              ref={inputRef}
              id={name}
              name={name}
              onFocus={() => setHasFocus(true)}
              onBlur={() => setHasFocus(false)}
              onMouseEnter={() => setHasHover(true)}
              onMouseLeave={() => setHasHover(false)}
              parentValue={parentValue.toString()}
              onUserConfirm={updateHandler}
              clearContentOnFocus={clearContentOnFocus}
              className={cn("w-full bg-transparent text-center outline-none")}
              placeholder={labelStyle === "PLACEHOLDER" ? label : undefined}
            />
            {/* <div className="border-r border-text-secondary-dark" /> */}
            <button className="p-0.5" onClick={incrementHandler}>
              <Plus />
            </button>
          </div>

          <div
            className={cn(
              animationDuration75,
              "flex min-h-[2px] gap-2 border-b border-text-secondary dark:border-text-secondary-dark",
              {
                "border-stat-red dark:border-stat-red-dark":
                  color === "RED" && hasFocus,
                "border-stat-green dark:border-stat-green-dark":
                  color === "GREEN" && hasFocus,
                "border-stat-blue dark:border-stat-blue-dark":
                  color === "BLUE" && hasFocus,
                "border-text-primary dark:border-text-primary-dark":
                  color === "WHITE" && hasFocus,
                "border-b-2": hasFocus,
                "border-b-2 border-text-primary dark:border-text-primary-dark":
                  hasHover && !hasFocus,
              },
            )}
          />
        </div>
      </div>
      {showParentValue ? (
        <div
          className={cn(
            animationDuration150,
            "rounded-b-sm px-0.5 text-center text-xs transition-all",
            { "bg-stat-red-dark/25": color === "RED" },
            { "bg-stat-green-dark/25": color === "GREEN" },
            { "bg-stat-blue-dark/25": color === "BLUE" },
            {
              "translate-y-0 opacity-100": true,
              "pointer-events-none -translate-y-2 opacity-0":
                !hasFocus || parentValue === 0,
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
