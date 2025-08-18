import LinkButton from "@/settings/LinkButton";
import { Patreon } from "@/components/icons/Patreon";
import { Button } from "@/components/ui/button";
import {
  BugIcon,
  FileQuestionIcon,
  HistoryIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ConnectedDiceIcon from "@/components/icons/ConnectedDiceIcon";

export default function SideBarMenu({ children }: { children?: any }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        showCloseButton={false}
        className="text-text-primary dark:text-text-primary-dark gap-0"
      >
        <SheetHeader className="flex items-center p-0 px-4">
          <div className="flex h-14 w-full items-center justify-between">
            <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
            <SheetClose asChild>
              <Button variant={"ghost"} size={"icon"}>
                <XIcon />
              </Button>
            </SheetClose>
          </div>
          <SheetDescription className="hidden">Extension menu</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-full">
          {/* <div aria-label="autofocus capture" tabIndex={0} /> */}
          <div className="mb-2 grid items-center">
            {children}
            <div className="text-text-secondary dark:text-text-secondary-dark mt-4 mb-1 px-4 text-sm">
              Links
            </div>
            <LinkButton
              name="Patreon"
              icon={<Patreon />}
              href={"https://www.patreon.com/SeamusFinlayson"}
            />
            <LinkButton
              name="Connected Dice"
              icon={<ConnectedDiceIcon />}
              href={"https://seamus-finlayson.ca/pages/connected-dice"}
            />
            <LinkButton
              name="Change Log"
              icon={<HistoryIcon />}
              href={"https://www.patreon.com/collection/1364023?view=expanded"}
            />
            <LinkButton
              name="Instructions"
              icon={<FileQuestionIcon />}
              href={"https://seamus-finlayson.ca/pages/draw-steel-tools"}
            />
            <LinkButton
              name="Report Bug"
              icon={<BugIcon />}
              href="https://discord.gg/WMp9bky4be"
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
