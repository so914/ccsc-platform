export function WelcomeContact() {
  return (
    <>
{/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-5 py-24">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-accent/60 via-card to-background p-8 sm:p-14">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Une question ? Écrivez-nous.
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
             Du lundi au vendredi de 9h00 à 17h00.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Email", "contact@anssi.cg"],
                ["Téléphone", "+242 06 131 83 83"],
                ["Adresse", "14e étage bureau n°4, Tour Business, Mpila Brazzaville"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="rounded-xl bg-background/60 p-4 backdrop-blur"
                >
                  <p className="text-sm text-muted-foreground">{k}</p>
                  <p className="font-semibold break-words">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
    </>
  );
}
