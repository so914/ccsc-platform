import { PARTNERS } from "./content";

export function WelcomePartners() {
  return (
    <>
{/* Partenaires */}
        <section
          id="partenaires"
          className="border-y border-border bg-card/40 py-20"
        >
          <h2 className="px-5 text-center font-display text-3xl font-bold sm:text-4xl">
            Ils nous soutiennent
          </h2>
          <div className="marquee-wrap mt-12 overflow-hidden">
            <div className="marquee flex w-max gap-4">
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <div
                  key={i}
                  className="grid h-20 w-52 shrink-0 place-items-center rounded-xl border border-border bg-background font-display text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>
    </>
  );
}
