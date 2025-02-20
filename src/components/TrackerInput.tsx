import PartiallyControlledInput from "./PartiallyControlledInput";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { InputColor } from "@/colorHelpers";
import InputUnderline from "./Underline";
import UnderlineDropDown from "./UnderlineDropDown";

export default function TrackerInput({
  parentValue,
  showParentValue = false,
  color = "DEFAULT",
  updateHandler,
  name,
  label,
  labelStyle = "VISIBLE",
  animateOnlyWhenRootActive = false,
  clearContentOnFocus = false,
}: {
  parentValue: string;
  showParentValue?: boolean;
  color?: InputColor | "DEFAULT";
  updateHandler: (target: HTMLInputElement) => void;
  name: string;
  label: string;
  labelStyle?: "VISIBLE" | "HIDDEN" | "PLACEHOLDER";
  animateOnlyWhenRootActive?: boolean;
  clearContentOnFocus?: boolean;
}): React.JSX.Element {
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHover, setHasHover] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full pt-0.5 text-text-primary dark:text-text-primary-dark">
      <div
        className={cn("group bg-gradient-to-t", {
          "from-stat-red/20 dark:from-stat-red-dark/20": color === "RED",
          "from-stat-green/20 dark:from-stat-green-dark/20": color === "GREEN",
          "from-stat-blue/20 dark:from-stat-blue-dark/20": color === "BLUE",
          "from-amber-400/20 dark:from-amber-600/20": color === "GOLD",
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
              onMouseEnter={() => setHasHover(true)}
              onMouseLeave={() => setHasHover(false)}
              parentValue={parentValue.toString()}
              onUserConfirm={updateHandler}
              clearContentOnFocus={clearContentOnFocus}
              className={cn("w-full bg-transparent outline-none")}
              placeholder={labelStyle === "PLACEHOLDER" ? label : undefined}
            />
          </div>
        </div>

        <InputUnderline
          hasFocus={hasFocus}
          hasHover={hasHover}
          color={color}
          animateOnlyWhenRootActive={animateOnlyWhenRootActive}
        />
      </div>
      {showParentValue ? (
        <UnderlineDropDown
          content={parentValue}
          hasFocus={hasFocus}
          color={color}
          animateOnlyWhenRootActive={animateOnlyWhenRootActive}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
