import { cn } from "@/lib/utils";

export default function IntegerButtonGroup({
  startValue,
  endValue,
  value,
  onClick,
}: {
  startValue: number;
  endValue: number;
  value: number;
  onClick: (newValue: number) => void;
}): React.JSX.Element {
  const PhaseButtons = [];

  for (let i = startValue; i <= endValue; i++) {
    PhaseButtons.push(
      <button
        key={i}
        value={i.toString()}
        className={cn(
          "w-full px-0 outline-none hover:bg-purple-100/40 focus-visible:bg-purple-100/40 dark:hover:bg-mirage-50/5 dark:focus-visible:bg-mirage-50/5",
          {
            "bg-primary/20 text-primary hover:bg-primary/25 focus-visible:bg-primary/25 dark:bg-primary-dark/20 dark:text-primary-dark dark:hover:bg-primary-dark/25 dark:focus-visible:bg-primary-dark/25":
              i === value,
          },
        )}
        onClick={() => onClick(i)}
      >
        {i}
      </button>,
    );
    if (i < endValue)
      PhaseButtons.push(
        <div
          key={"divider" + i}
          className="border-r border-text-secondary dark:border-white/20"
        />,
      );
  }

  return (
    <div className="flex h-9 w-full overflow-clip rounded-md border border-text-secondary dark:border-white/20">
      {PhaseButtons}
    </div>
  );
}
