import PartiallyControlledInput from "./PartiallyControlledInput";
import { cn } from "@/lib/utils";
import { Sparkles } from "./icons/Sparkles";
import { XIcon } from "./icons/XIcon";
import InputBackground from "./InputBackground";

export default function NameInput({
  parentValue,
  updateHandler,
  onActionClick,
}: {
  parentValue: string;
  updateHandler: (target: HTMLInputElement) => void;
  onActionClick: () => void;
}): React.JSX.Element {
  return (
    <div className="group text-text-primary dark:text-text-primary-dark w-full">
      <InputBackground className="flex overflow-clip" color={"DEFAULT"}>
        <PartiallyControlledInput
          parentValue={parentValue.toString()}
          onUserConfirm={updateHandler}
          className={cn("w-full bg-transparent px-2 outline-hidden")}
          placeholder="Token Name"
        />
        <button
          className="invisible w-0 items-center justify-center p-0.5 px-2 opacity-0 outline-hidden transition-opacity duration-150 group-focus-within:visible group-focus-within:w-auto group-focus-within:opacity-100 group-hover:visible group-hover:w-auto group-hover:opacity-100 hover:bg-white/10 focus-visible:bg-white/10"
          onClick={onActionClick}
        >
          {parentValue === "" ? <Sparkles /> : <XIcon />}
        </button>
      </InputBackground>
    </div>
  );
}
