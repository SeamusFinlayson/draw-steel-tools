import PartiallyControlledInput from "./PartiallyControlledInput";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import InputUnderline from "./Underline";
import { Sparkles } from "./icons/Sparkles";
import { XIcon } from "./icons/XIcon";

export default function NameInput({
  parentValue,
  updateHandler,
  onActionClick,
  name,
  label,
  labelStyle = "VISIBLE",
  animateOnlyWhenRootActive = false,
  clearContentOnFocus = false,
}: {
  parentValue: string;
  showParentValue?: boolean;
  updateHandler: (target: HTMLInputElement) => void;
  onActionClick: () => void;
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
    <div className="group w-full pt-0.5 text-text-primary dark:text-text-primary-dark">
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

      <div className="flex min-h-[28px] border-text-secondary-dark">
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
        <button
          name="autofill or clear name"
          className="React.JSX-150 invisible w-0 p-0.5 opacity-0 transition-opacity group-focus-within:visible group-focus-within:w-auto group-focus-within:opacity-100 group-hover:visible group-hover:w-auto group-hover:opacity-100"
          onClick={onActionClick}
        >
          {parentValue === "" ? <Sparkles /> : <XIcon />}
        </button>
      </div>

      <InputUnderline
        hasFocus={hasFocus}
        hasHover={hasHover}
        color={"DEFAULT"}
        animateOnlyWhenRootActive={animateOnlyWhenRootActive}
      />
    </div>
  );
}
