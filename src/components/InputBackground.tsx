import { InputColor } from "@/colorHelpers";
import { cn } from "@/lib/utils";

interface BackgroundProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  children: any;
  color: InputColor | "DEFAULT";
}

export default function InputBackground({
  children,
  color,
  className,
  ...props
}: BackgroundProps) {
  return (
    <div
      className={cn(
        "flex h-9 rounded-md shadow",
        {
          "bg-red-600/30 dark:bg-red-600/30": color === "RED",
          "bg-lime-600/30 dark:bg-lime-600/30": color === "GREEN",
          "bg-sky-600/30 dark:bg-cyan-600/30": color === "BLUE",
          "bg-amber-600/30 dark:bg-amber-600/30": color === "GOLD",
          "bg-mirage-50/30 dark:bg-mirage-500/30": color === "DEFAULT",
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
