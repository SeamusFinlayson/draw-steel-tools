import PartiallyControlledInput from "./PartiallyControlledInput";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { InputColor } from "@/colorHelpers";
import { Plus } from "./icons/Plus";
import { Minus } from "./icons/Minus";
import InputUnderline from "./Underline";
import UnderlineDropDown from "./UnderlineDropDown";

export default function Counter({
  parentValue,
  showParentValue = false,
  color = "DEFAULT",
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
  color?: InputColor | "DEFAULT";
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

  return (
    <div className="pt-0.5 text-text-primary dark:text-text-primary-dark">
      <div
        className={cn("bg-gradient-to-t", {
          "from-stat-red/10 dark:from-stat-red-dark/10": color === "RED",
          "from-stat-green/10 dark:from-stat-green-dark/10": color === "GREEN",
          "from-stat-blue/10 dark:from-stat-blue-dark/20": color === "BLUE",
          "from-amber-400/10 dark:from-amber-600/20": color === "GOLD",
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
            <button className="p-0.5" onClick={incrementHandler}>
              <Plus />
            </button>
          </div>

          <InputUnderline
            hasFocus={hasFocus}
            hasHover={hasHover}
            color={color}
            animateOnlyWhenRootActive={animateOnlyWhenRootActive}
          />
        </div>
      </div>
      {showParentValue ? (
        <UnderlineDropDown
          content={parentValue.toString()}
          hasFocus={hasFocus}
          color={color}
          animateOnlyWhenRootActive={animateOnlyWhenRootActive}
          justification="CENTER"
        />
      ) : (
        <></>
      )}
    </div>
  );
}
