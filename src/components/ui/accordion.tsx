import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-t-4 border-black/20", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  preview,
  alwaysShowPreview = false,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  preview?: React.ReactNode;
  alwaysShowPreview?: boolean;
}) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group focus-visible:border-mirage-950 focus-visible:ring-mirage-950/50 dark:focus-visible:border-mirage-300 dark:focus-visible:ring-mirage-300/50 w-full px-4 py-2 text-left text-base font-medium transition-all outline-none hover:bg-black/7 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-white/7 [&[data-state=open]_svg]:rotate-180",
          className,
        )}
        {...props}
      >
        <div>
          <div className="flex w-full flex-1 items-start justify-between gap-4">
            {children}
            <ChevronDownIcon className="pointer-events-none size-5 shrink-0 translate-y-0.5 transition-transform duration-200" />
          </div>
          <div
            data-has-preview={preview !== undefined}
            data-always-show-preview={alwaysShowPreview}
            className="flex h-0 items-end gap-2 overflow-hidden opacity-0 transition-all group-data-[state=closed]:opacity-100 data-[always-show-preview=true]:h-[28px] data-[always-show-preview=true]:opacity-100 group-data-[state=closed]:data-[has-preview=true]:h-[28px]"
          >
            {preview}
          </div>
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-2 pb-2", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
