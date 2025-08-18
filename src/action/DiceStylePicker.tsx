import { DiceProtocol } from "@/diceProtocol";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";
import { Button } from "@/components/ui/button";

export default function DiceStylePicker({
  dieStyles,
  onStyleClick,
  dialogTrigger,
}: {
  dieStyles: DiceProtocol.DieStyle[];
  onStyleClick: (style: DiceProtocol.DieStyle) => void;
  dialogTrigger: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick a color</DialogTitle>
          <DialogDescription>
            Choose the dice color for your power roll
          </DialogDescription>
          <div className="grid w-full grid-cols-4 place-items-center gap-2 p-2">
            {dieStyles.map((style) => (
              <DialogClose key={style.id} asChild>
                <Button
                  size={"icon"}
                  style={{ backgroundColor: style.color }}
                  onClick={() => onStyleClick(style)}
                />
              </DialogClose>
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
