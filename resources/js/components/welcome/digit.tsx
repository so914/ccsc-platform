export function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[4.5rem] flex-col items-center rounded-xl border border-primary/30 bg-card/70 px-3 py-3 backdrop-blur sm:min-w-[6rem]">
      <span
        key={value}
        className="digit font-display text-3xl font-bold tabular-nums text-foreground sm:text-5xl"
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
