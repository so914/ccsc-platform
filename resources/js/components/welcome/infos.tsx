import { NAME, PROFILES, type Profile } from "./content";
import { Step } from "./step";

export function WelcomeInfos({ profile, setProfile, current }: { profile: Profile; setProfile: (p: Profile) => void; current: (typeof PROFILES)[Profile] }) {
  return (
    <>
{/* Infos & dates */}
        <section
          id="infos"
          className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-[1fr_1.2fr]"
        >
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Infos & dates
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground text-justify">
              {NAME} se tient du 1er au 4 octobre.<br/> Au programme :
              sensibilisation à la cybersécurité et son cadre juridique en 
              République du Congo, ateliers pratiques et challenge pour les 15-25 ans. Choisissez
              votre profil pour voir les informations qui vous concernent.
            </p>
            <p className="mt-6 text-sm font-medium">
              <label htmlFor="profile">Vous êtes</label>
            </p>
            <div className="relative mt-2 max-w-md">
              <select
                id="profile"
                value={profile}
                onChange={(e) => setProfile(e.target.value as Profile)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-primary/40 bg-card px-4 py-3 pr-11 font-medium text-foreground transition hover:border-primary focus-visible:outline-2 focus-visible:outline-ring"
              >
                {(Object.keys(PROFILES) as Profile[]).map((k) => (
                  <option key={k} value={k}>
                    {PROFILES[k].label}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 20 20"
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 8l5 5 5-5" />
              </svg>
            </div>

            <div key={profile} className="swap">
              <p className="mt-6 max-w-md text-muted-foreground">
                {current.intro}
              </p>
              <dl className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
                {current.dates.map(([k, v, hot]) => (
                  <div
                    key={k + v}
                    className={`border-l-2 pl-4 ${hot ? "border-primary" : "border-primary/40"}`}
                  >
                    <dt className="text-sm text-muted-foreground">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div key={profile + "-steps"} className="swap pt-2">
            <h3 className="mb-6 font-display text-lg font-medium">
              {current.stepsTitle}
            </h3>
            {current.steps.map((st, i) => (
              <Step
                key={profile + st.title}
                step={st}
                last={i === current.steps.length - 1}
              />
            ))}
          </div>
        </section>
    </>
  );
}
