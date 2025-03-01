import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DieStyle } from "@/diceProtocol";
import { useState } from "react";

import { SwatchBook } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DiceStylePicker({
  currentDieStyle,
  dieStyles,
  onStyleClick,
}: {
  currentDieStyle: DieStyle | undefined;
  dieStyles: DieStyle[];
  onStyleClick: (style: DieStyle) => void;
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <Tooltip open={tooltipOpen}>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              className="flex w-fit gap-3 rounded-md px-2"
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
              <SwatchBook />
              {currentDieStyle === undefined ? (
                <div className="size-5 rounded-full outline outline-2 -outline-offset-2" />
              ) : (
                <div
                  className="size-5 rounded-full"
                  style={{ backgroundColor: currentDieStyle.code }}
                />
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Dice Style</TooltipContent>
      </Tooltip>
      <PopoverContent collisionPadding={16} sideOffset={8}>
        <ScrollArea className="h-full">
          <div className="grid w-full grid-cols-4 items-center gap-2 p-2">
            {dieStyles.map((style) => (
              <button
                className="size-8 rounded-md"
                key={style.style}
                style={{ backgroundColor: style.code }}
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
