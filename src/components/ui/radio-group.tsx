import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const [hasHover, setHasHover] = React.useState(false);

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      data-has-hover={hasHover}
      className={cn(
        "group aspect-square shrink-0 rounded-full p-2.5 duration-150 outline-none data-[has-hover=true]:bg-white/10",
        className,
      )}
      {...props}
      onMouseEnter={() => setHasHover(true)}
      onMouseLeave={() => setHasHover(false)}
    >
      <div className="group-data-[state=checked]:border-primary-dark grid aspect-square size-4 shrink-0 place-items-center rounded-full border-2 duration-150">
        <RadioGroupPrimitive.Indicator
          forceMount
          data-slot="radio-group-indicator"
          className="data-[state=checked]:bg-primary-dark relative flex size-0 items-center justify-center rounded-full bg-white/20 duration-150 data-[state=checked]:size-2"
        />
      </div>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
