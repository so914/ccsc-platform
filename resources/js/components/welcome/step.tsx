import { useInView } from "./hooks";
import { type STEPS_CHALLENGE } from "./content";

export function Step({
  step,
  last,
}: {
  step: (typeof STEPS_CHALLENGE)[number];
  last: boolean;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="relative flex gap-5 pb-10 last:pb-0">
      {!last && (
        <span className="absolute top-6 left-[0.6rem] h-full w-px bg-border" />
      )}
      {!last && (
        <span
          className={`absolute top-6 left-[0.6rem] w-px origin-top bg-primary transition-all duration-1000 ${seen ? "h-full" : "h-0"}`}
        />
      )}
      <span
        className={`relative z-10 mt-1.5 h-5 w-5 shrink-0 rounded-full border-2 transition-all duration-500 ${seen ? "border-primary bg-primary shadow-[0_0_18px_var(--primary)]" : "border-border bg-background"}`}
      />
      <div>
        <p className="font-display text-sm text-primary">{step.date}</p>
        <h3 className="text-lg font-semibold">{step.title}</h3>
        <p className="text-muted-foreground">{step.text}</p>
      </div>
    </div>
  );
}
