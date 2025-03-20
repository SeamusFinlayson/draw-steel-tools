import PartiallyControlledInput from "./PartiallyControlledInput";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { InputColor } from "@/colorHelpers";
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
  inputProps,
}: {
  parentValue: string;
  showParentValue?: boolean;
  color?: InputColor | "DEFAULT";
  updateHandler: (target: HTMLInputElement) => void;
  name: string;
  label: string;
  labelStyle?: "VISIBLE" | "HIDDEN" | "PLACEHOLDER" | "NONE";
  animateOnlyWhenRootActive?: boolean;
  clearContentOnFocus?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}): React.JSX.Element {
  const [hasFocus, setHasFocus] = useState(false);
  const [hasHover, setHasHover] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full pt-0.5 text-text-primary dark:text-text-primary-dark">
      <div>
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

          <div
            className="flex h-9 rounded-md border border-text-secondary dark:border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <PartiallyControlledInput
              {...inputProps}
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
              className={cn(
                "w-full bg-transparent px-2 outline-hidden",
                inputProps?.className,
              )}
              placeholder={labelStyle === "PLACEHOLDER" ? label : undefined}
            />
          </div>
        </div>
      </div>
      {showParentValue ? (
        <div className="px-2 pt-1">
          <UnderlineDropDown
            content={parentValue}
            hasFocus={hasFocus}
            color={color}
            animateOnlyWhenRootActive={animateOnlyWhenRootActive}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
