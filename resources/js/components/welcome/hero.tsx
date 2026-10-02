import { Digit } from "./digit";
import { login, register } from "@/routes";
import { Link } from "@inertiajs/react";
import { type useCountdown } from "./hooks";
import { type RefObject } from "react";

export function WelcomeHero({ canRegister, title, time, heroRef, onMove }: { canRegister: boolean; title: string; time: ReturnType<typeof useCountdown>; heroRef: RefObject<HTMLElement | null>; onMove: (e: React.MouseEvent) => void }) {
  return (
    <>
{/* Hero + présentation */}
        <section
          id="presentation"
          ref={heroRef}
          onMouseMove={onMove}
          className="relative isolate overflow-hidden"
        >
          <div className="grid-bg absolute inset-0 -z-10" />
          <div className="spot absolute inset-0 -z-10" />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.3fr_1fr] lg:py-28">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm text-secondary-foreground">
                <span className="h-2 w-2 animate-ping rounded-full bg-primary" />
                Inscriptions ouvertes
              </p>
              <h1 className="font-display text-4xl leading-tight font-black break-words sm:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-justify text-muted-foreground">
                Plongez au cœur de la cybersécurité et de son cadre juridique en
                République du Congo. Participez à nos ateliers interactifs et
                testez vos réflexes lors d'un challenge exclusif réservé aux
                jeunes de 15 à 25 ans !
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={canRegister ? register() : login()}
                  className="rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground shadow-[0_0_30px_-4px_var(--primary)] transition hover:-translate-y-0.5"
                >
                  Je m’inscris
                </Link>
                <a
                  href="#reglement"
                  className="rounded-full border border-border px-7 py-3 font-medium transition hover:border-primary hover:text-primary"
                >
                  Lire le règlement
                </a>
              </div>
              <p className="mt-12 mb-3 text-sm text-muted-foreground">
                Début de l'événement dans
              </p>
              <div className="flex gap-2 sm:gap-3">
                <Digit value={time.jours} label="jours" />
                <Digit value={time.heures} label="heures" />
                <Digit value={time.minutes} label="minutes" />
                <Digit value={time.secondes} label="secondes" />
              </div>
            </div>

            {/* Cadenas animé */}
            <div
              className="relative mx-auto hidden aspect-square w-full max-w-sm lg:block"
              aria-hidden
            >
              <div className="float absolute inset-6 rounded-[2rem] border border-primary/40 bg-gradient-to-br from-card to-background shadow-[0_0_80px_-20px_var(--primary)]">
                <span className="scan absolute inset-x-4 h-px bg-primary shadow-[0_0_14px_var(--primary)]" />
                <svg
                  viewBox="0 0 100 100"
                  className="h-full w-full p-14 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <rect x="22" y="44" width="56" height="40" rx="8" />
                  <path d="M34 44V32a16 16 0 0 1 32 0v12" />
                  <circle cx="50" cy="63" r="5" fill="currentColor" />
                  <path d="M50 68v8" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-6xl gap-px overflow-hidden border-y border-border bg-border sm:grid-cols-3">
            {[
              ["Inscription en ligne"],

              ["Du 25 au 27 novembre"],
              ["Hôtel de Kintélé"],
            ].map(([a, b]) => (
              <div key={a} className="bg-background px-6 py-6">
                <p className="font-display text-xl font-bold text-primary">
                  {a}
                </p>
              </div>
            ))}
          </div>
        </section>
    </>
  );
}
