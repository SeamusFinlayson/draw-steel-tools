import PartiallyControlledInput from "./PartiallyControlledInput";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { InputColor } from "@/colorHelpers";
import InputBackground from "./InputBackground";
import { NameValueLabel } from "./NameValueLabel";

export default function ValueTrackerInput({
  parentValue,
  updateHandler,
  color = "DEFAULT",
  label,
}: {
  parentValue: string;
  color?: InputColor | "DEFAULT";
  updateHandler: (target: HTMLInputElement) => void;
  label: string;
}): React.JSX.Element {
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <div className="group text-text-primary dark:text-text-primary-dark w-full">
      <NameValueLabel
        name={label}
        value={parentValue.toString()}
        showValue={hasFocus && parentValue !== "0"}
      />

      <InputBackground color={color}>
        <PartiallyControlledInput
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          parentValue={parentValue.toString()}
          onUserConfirm={updateHandler}
          className={cn(
            "w-full bg-transparent px-2 text-center outline-hidden",
          )}
          clearContentOnFocus
        />
      </InputBackground>
    </div>
  );
}
