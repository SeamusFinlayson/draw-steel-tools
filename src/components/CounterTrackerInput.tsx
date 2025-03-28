import PartiallyControlledInput from "./PartiallyControlledInput";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { InputColor } from "@/colorHelpers";
import { Plus } from "./icons/Plus";
import { Minus } from "./icons/Minus";
import { NameValueLabel } from "./NameValueLabel";
import InputBackground from "./InputBackground";

export default function CounterTracker({
  parentValue,
  color = "DEFAULT",
  updateHandler,
  incrementHandler,
  decrementHandler,
  label,
}: {
  parentValue: number;
  color?: InputColor | "DEFAULT";
  updateHandler: (target: HTMLInputElement) => void;
  incrementHandler: () => void;
  decrementHandler: () => void;
  label: string;
}): React.JSX.Element {
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <div className="group text-text-primary dark:text-text-primary-dark w-full">
      <NameValueLabel
        name={label}
        value={parentValue.toString()}
        showValue={hasFocus && parentValue !== 0}
      />

      <InputBackground className="overflow-clip" color={color}>
        <div className="flex">
          <button
            className="flex h-full w-full items-center justify-center outline-hidden hover:bg-white/10 focus-visible:bg-white/10"
            onClick={decrementHandler}
          >
            <Minus />
          </button>
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
          <button
            className="flex h-full w-full items-center justify-center outline-hidden hover:bg-white/10 focus-visible:bg-white/10"
            onClick={incrementHandler}
          >
            <Plus />
          </button>
        </div>
      </InputBackground>
    </div>
  );
}
