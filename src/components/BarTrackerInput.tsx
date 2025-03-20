import PartiallyControlledInput from "./PartiallyControlledInput";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { InputColor } from "@/colorHelpers";
import InputBackground from "./InputBackground";

export default function BarTrackerInput({
  parentValue,
  valueUpdateHandler,
  parentMax,
  maxUpdateHandler,
  color = "DEFAULT",
  label,
}: {
  parentValue: string;
  valueUpdateHandler: (target: HTMLInputElement) => void;
  parentMax: string;
  maxUpdateHandler: (target: HTMLInputElement) => void;
  color?: InputColor | "DEFAULT";
  label: string;
}): React.JSX.Element {
  const [valueHasFocus, setValueHasFocus] = useState(false);
  const [maxHasFocus, setMaxHasFocus] = useState(false);

  return (
    <div className="group text-text-primary dark:text-text-primary-dark w-full">
      <div className="pointer-events-none grid grid-cols-2 pb-0.5">
        <div
          data-visible={
            !(valueHasFocus && parentValue !== "0") &&
            !(maxHasFocus && parentMax !== "0")
          }
          className="text-text-secondary dark:text-text-secondary-dark col-span-2 col-start-1 row-start-1 block overflow-clip text-xs font-medium text-nowrap text-ellipsis opacity-0 transition-all duration-150 data-[visible=true]:opacity-100"
        >
          {label}
        </div>
        <div
          data-visible={valueHasFocus && parentValue !== "0"}
          className="text-text-secondary dark:text-text-secondary-dark col-start-1 row-start-1 block text-center text-xs font-medium opacity-0 transition-all duration-150 data-[visible=true]:opacity-100"
        >
          {parentValue}
        </div>
        <div
          data-visible={maxHasFocus && parentMax !== "0"}
          className="text-text-secondary dark:text-text-secondary-dark col-start-2 row-start-1 block text-center text-xs font-medium opacity-0 transition-all duration-150 data-[visible=true]:opacity-100"
        >
          {parentMax}
        </div>
      </div>

      <InputBackground color={color}>
        <div className="grid grid-cols-2 items-center">
          <PartiallyControlledInput
            onFocus={() => setValueHasFocus(true)}
            onBlur={() => setValueHasFocus(false)}
            parentValue={parentValue}
            onUserConfirm={valueUpdateHandler}
            className={cn(
              "col-start-1 row-start-1 w-full bg-transparent px-2 text-center outline-hidden",
            )}
            clearContentOnFocus
          />
          <div className="dark:text-text-secondary-dark pointer-events-none col-span-2 col-start-1 row-start-1 w-full text-center">
            /
          </div>
          <PartiallyControlledInput
            onFocus={() => setMaxHasFocus(true)}
            onBlur={() => setMaxHasFocus(false)}
            parentValue={parentMax}
            onUserConfirm={maxUpdateHandler}
            className={cn(
              "col-start-2 row-start-1 w-full bg-transparent px-2 text-center outline-hidden",
            )}
            clearContentOnFocus
          />
        </div>
      </InputBackground>
    </div>
  );
}
