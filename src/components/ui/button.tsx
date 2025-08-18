import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-primary-dark",
  {
    variants: {
      variant: {
        primary:
          "dark:bg-primary-dark  dark:text-primary-dark-950 bg-primary hover:opacity-95 text-primary-50",
        destructive:
          "bg-red-500 text-mirage-50 shadow-xs hover:bg-red-500/90 dark:bg-red-900 dark:text-mirage-50 dark:hover:bg-red-900/90",
        outline:
          "border border-mirage-300 bg-transparent shadow-xs hover:bg-mirage-200 hover:text-mirage-900 dark:border-mirage-800 dark:bg-transparent dark:hover:bg-mirage-800 dark:hover:text-mirage-50",
        secondary:
          "dark:bg-mirage-900 dark:hover:bg-mirage-800 bg-mirage-100 hover:bg-mirage-200",
        ghost: "hover:bg-black/7  dark:hover:bg-white/7",
        link: "text-mirage-900 underline-offset-4 hover:underline dark:text-mirage-50",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-[18px] active:rounded-[8px]",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 px-8 rounded-[20px] active:rounded-[8px]",
        icon: "h-10 w-10 rounded-[20px] active:rounded-[8px]",
      },
    },
    compoundVariants: [
      {
        variant: "ghost",
        size: "icon",
        class: "fill-black stroke-black dark:fill-white dark:stroke-white",
      },
    ],
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
