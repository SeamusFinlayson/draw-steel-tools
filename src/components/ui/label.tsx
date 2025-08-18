import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

function Label({
  className,
  variant = "base",
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  variant?: "base" | "small";
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-has-for={props.htmlFor !== undefined}
      className={cn(
        {
          "flex w-fit items-center gap-2 text-sm leading-none font-normal select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[has-for=true]:cursor-pointer":
            variant === "base",
          "text-text-primary dark:text-text-primary-dark pointer-events-none mb-1.5 flex w-fit items-center gap-2 text-xs leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[has-for=true]:cursor-pointer":
            variant === "small",
        },
        className,
      )}
      {...props}
    />
  );
}

export { Label };
