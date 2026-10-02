import { CRITERIA } from "./content";

export function WelcomeEligibility() {
  return (
    <>
{/* Éligibilité */}
        <section
          id="eligibilite"
          className="border-y border-border bg-card/40 py-24"
        >
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Qui peut participer au concours?
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Cochez-vous toutes les cases ? Alors votre place est ici.
            </p>
            <ul className="mt-10 grid gap-3 md:grid-cols-2">
              {CRITERIA.map((c) => (
                <li
                  key={c}
                  className="group flex items-start gap-4 rounded-xl border border-border bg-background p-4 transition-all hover:translate-x-1 hover:border-primary/60"
                >
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10.5l4 4 8-9" />
                    </svg>
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <p className="my-8 font-black text-lg">NB: Toute participation aux ateliers ou simplement à l'événement ne requiert en aucun cas la validation de tous les critères ci-dessus.</p>
          </div>
        </section>
    </>
  );
}
