import LinkButton from "@/settings/LinkButton";
import { Patreon } from "@/components/icons/Patreon";
import { QuestionMark } from "@/components/icons/QuestionMark";
import { History } from "@/components/icons/History";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bug, EllipsisVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MoreDropDown() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="rounded-md" size={"icon"} variant={"ghost"}>
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ScrollArea className="h-full">
          <div className="grid w-full grid-cols-1 items-center gap-2 p-1">
            <LinkButton
              className="rounded border-none"
              name="Patreon"
              icon={<Patreon />}
              href={"https://www.patreon.com/SeamusFinlayson"}
              tooltipProps={{ side: "left", sideOffset: 8 }}
            />
            <LinkButton
              className="rounded border-none"
              name="Change Log"
              icon={<History />}
              href={"https://www.patreon.com/collection/306916?view=expanded"}
              tooltipProps={{ side: "left", sideOffset: 8 }}
            />
            <LinkButton
              className="rounded border-none"
              name="Instructions"
              icon={<QuestionMark />}
              href={
                "https://github.com/SeamusFinlayson/Bubbles-for-Owlbear-Rodeo?tab=readme-ov-file#how-it-works"
              }
              tooltipProps={{ side: "left", sideOffset: 8 }}
            />
            <LinkButton
              className="rounded border-none"
              name="Report Bug"
              icon={<Bug />}
              href="https://discord.gg/WMp9bky4be"
              tooltipProps={{ side: "left", sideOffset: 8 }}
            />
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
