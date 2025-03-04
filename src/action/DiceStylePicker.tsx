import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

import { SwatchBook } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DiceProtocol } from "@/diceProtocol";

export default function DiceStylePicker({
  currentDieStyle,
  dieStyles,
  onStyleClick,
}: {
  currentDieStyle: DiceProtocol.DieStyle | undefined;
  dieStyles: DiceProtocol.DieStyle[];
  onStyleClick: (style: DiceProtocol.DieStyle) => void;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <Tooltip open={false}>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              className="flex w-full justify-between gap-3 rounded-md px-2"
              size={"icon"}
              variant={"ghost"}
              onMouseEnter={() => {
                if (!popoverOpen) setTooltipOpen(true);
              }}
              onMouseLeave={() => setTooltipOpen(false)}
              onClick={() => {
                setPopoverOpen(true);
                setTooltipOpen(false);
              }}
            >
              <SwatchBook className="shrink-0" />
              {currentDieStyle === undefined ? (
                <div className="h-6 w-full rounded outline outline-1 -outline-offset-2 dark:outline-white/20" />
              ) : (
                <div
                  className="h-6 w-full rounded"
                  style={{ backgroundColor: currentDieStyle.color }}
                />
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">Dice Style</TooltipContent>
      </Tooltip>
      <PopoverContent collisionPadding={16} sideOffset={8}>
        <ScrollArea className="h-full">
          <div className="grid w-full grid-cols-4 items-center gap-2 p-2">
            {dieStyles.map((style) => (
              <button
                className="size-8 rounded-md"
                key={style.id}
                style={{ backgroundColor: style.color }}
                onClick={() => {
                  onStyleClick(style);
                  setPopoverOpen(false);
                }}
              />
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
