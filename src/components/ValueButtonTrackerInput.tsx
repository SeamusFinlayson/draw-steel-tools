import PartiallyControlledInput from "./PartiallyControlledInput";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { InputColor } from "@/colorHelpers";
import { NameValueLabel } from "./NameValueLabel";
import InputBackground from "./InputBackground";

export default function ValueButtonTrackerInput({
  parentValue,
  color = "DEFAULT",
  updateHandler,
  buttonProps,
  label,
  labelTitle,
}: {
  parentValue: number;
  color?: InputColor | "DEFAULT";
  updateHandler: (target: HTMLInputElement) => void;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  label: string;
  labelTitle?: string;
}): React.JSX.Element {
  const [hasFocus, setHasFocus] = useState(false);

  const button = (
    <button
      {...buttonProps}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center outline-hidden hover:bg-white/10 focus-visible:bg-white/10",
        buttonProps?.className,
      )}
    />
  );

  return (
    <div className="group text-text-primary dark:text-text-primary-dark w-full">
      <div title={labelTitle}>
        <NameValueLabel
          name={label}
          value={parentValue.toString()}
          showValue={hasFocus && parentValue !== 0}
        />
      </div>

      <InputBackground className="overflow-clip" color={color}>
        <div className="flex">
          <PartiallyControlledInput
            onFocus={() => setHasFocus(true)}
            onBlur={() => setHasFocus(false)}
            parentValue={parentValue.toString()}
            onUserConfirm={updateHandler}
            clearContentOnFocus
            className={cn(
              "w-full bg-transparent px-2 text-center outline-hidden",
            )}
          />
          {buttonProps && button}
        </div>
      </InputBackground>
    </div>
  );
}
