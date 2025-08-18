export function Badge({ text }: { text: string }) {
  return (
    <div className="bg-mirage-950/95 text-text-primary-dark dark:bg-mirage-50/95 dark:text-text-primary shrink-0 rounded-2xl px-2.5 py-0.5 text-xs font-semibold duration-200">
      {text}
    </div>
  );
}
