import { RULES } from "./content";
import { Rule } from "./rule";

export function WelcomeRules() {
  return (
    <>
{/* Règlement */}
        <section
          id="reglement"
          className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[1fr_1.6fr]"
        >
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Règlement officiel
            </h2>
            <p className="mt-4 text-muted-foreground">
              En t’inscrivant, tu acceptes ces règles. Clique sur un article
              pour le lire.
            </p>
            <a
              href="#"
              className="mt-6 inline-block rounded-full border border-primary/50 px-5 py-2 text-sm text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              Télécharger le PDF
            </a>
          </div>
          <div className="border-t border-border">
            {RULES.map(([t, x]) => (
              <Rule key={t} title={t} text={x} />
            ))}
          </div>
        </section>
    </>
  );
}
