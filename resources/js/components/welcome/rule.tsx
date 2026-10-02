import { useState } from "react";

export function Rule({ title, text }: { title: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-base font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring sm:text-lg"
      >
        {title}
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-primary/40 text-primary transition-transform duration-300 ${open ? "rotate-45 bg-primary/15" : ""}`}
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}
      >
        <p className="overflow-hidden text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
