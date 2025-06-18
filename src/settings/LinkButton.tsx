import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export default function LinkButton({
  name,
  icon,
  href,
  className,
  tooltipProps,
}: {
  name: string;
  icon: React.JSX.Element;
  href: string;
  className?: string;
  tooltipProps?: React.ComponentPropsWithoutRef<
    typeof TooltipPrimitive.Content
  >;
}): React.JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          className={cn(
            "border-mirage-300 fill-mirage-800 stroke-mirage-800 hover:bg-mirage-200 focus-visible:ring-primary dark:border-mirage-800 dark:fill-mirage-50 dark:stroke-mirage-50 dark:hover:bg-mirage-800 dark:focus-visible:ring-primary-dark flex size-10 items-center justify-center rounded-full border outline-hidden focus-visible:ring-2",
            className,
          )}
          target="_blank"
          rel="noreferrer noopener"
          href={href}
        >
          {icon}
        </a>
      </TooltipTrigger>
      <TooltipContent {...tooltipProps}>{name}</TooltipContent>
    </Tooltip>
  );
}
