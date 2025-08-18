"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-primary-dark",
  {
    variants: {
      variant: {
        default:
          "dark:data-[state=on]:bg-mirage-100 data-[state=on]:bg-mirage-900 data-[state=on]:hover:bg-mirage-800 data-[state=on]:text-text-primary-dark dark:data-[state=on]:text-text-primary dark:data-[state=on]:hover:bg-mirage-200 w-full data-[state=on]:rounded-[12px] data-[state=on]:active:rounded-[8px] dark:bg-mirage-900 dark:hover:bg-mirage-800 bg-mirage-100 hover:bg-mirage-200",
        outline:
          "border border-mirage-200 bg-transparent shadow-xs hover:bg-mirage-100 hover:text-mirage-900 dark:border-mirage-800 dark:hover:bg-mirage-800 dark:hover:text-mirage-50",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-[18px] active:rounded-[8px]",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 px-8 rounded-[20px] active:rounded-[8px]",
        icon: "h-10 w-10 rounded-[20px] active:rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
