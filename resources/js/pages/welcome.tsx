import { dashboard, login, register } from "@/routes";
import { type SharedData } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Contenu à adapter : nom, dates, règles, partenaires, contacts      */
/* ------------------------------------------------------------------ */
const NAME = "Congo CyberSecurity 2026";
const START = new Date("2026-10-02T09:00:00"); // début du challenge
const SECTIONS = [
  ["presentation", "A propos"],
  ["infos", "Infos & dates"],
  ["eligibilite", "Éligibilité"],
  ["reglement", "Règlement"],
  ["partenaires", "Partenaires"],
  ["contact", "Contact"],
] as const;

const STEPS_CHALLENGE = [
  {
    date: 'Dès maintenant',
    title: 'Inscription au challenge',
    text: 'Créez votre compte et inscrivez-vous sur la plateforme.',
  },
  {
    date: 'Après votre inscription',
    title: 'Confirmation de l’inscription',
    text: 'Vous recevrez un e-mail confirmant votre inscription ainsi que toutes les informations pratiques des prochaines étapes.',
  },
  {
    date: 'Si votre profil est retenu',
    title: 'Phase de qualification par un quiz',
    text: "Vous recevrez un e-mail contenant un lien d'évaluation pour la phase de qualification.",
  },
  {
    date: "Si vous avez participé à l'évaluation",
    title: "Phase d'attente des résultats",
    text: 'Durant cette phase, nous évaluerons votre travail et vous serez informés de la suite.',
  },
  {
    date: "Si vous avez passé avec succès l'évaluation",
    title: 'Phase de résultats',
    text: 'Recevez votre résultat et votre badge numérique et nous vous informerons de la suite des événements.',
  },
  {
    date: 'Préparation & Challenge',
    title: 'Challenge en direct',
    text: `Relevez les défis pratiques contre la montre pendant les différentes manches du Congo CyberSecurity Challenge 2026.`,
  },
];

const STEPS_VISITOR = [
  {
    date: 'Dès maintenant',
    title: 'Inscription à l’événement',
    text: 'Remplissez le formulaire en ligne, c’est rapide et gratuit.',
  },
  {
    date: 'Après votre inscription',
    title: 'Confirmation',
    text: 'Vous recevrez votre badge numérique ainsi que toutes les informations pratiques.',
  },
  {
    date: 'Quotidiennement',
    title: 'Suivi & Transport',
    text: `Connectez-vous quotidiennement à la plateforme pour suivre les annonces en temps réel et connaître le planning ainsi que les points de collecte des bus qui vous conduiront sur le lieu de ${NAME}.`,
  },
];

type Profile = "visiteur" | "challenge";

const PROFILES: Record<
  Profile,
  {
    label: string;
    intro: string;
    dates: [string, string, boolean][];
    steps: typeof STEPS_CHALLENGE;
    stepsTitle: string;
  }
> = {
  visiteur: {
    label: "Participant aux ateliers / visiteur",
    intro:
      "Accès libre et gratuit : venez vous sensibiliser à la cybersécurité, comprendre son cadre juridique en République du Congo et participer aux ateliers pratiques.",
    stepsTitle: "Votre participation, étape par étape",
    dates: [
      ["1er octobre", "Ouverture & Conférences juridiques", true],
      ["2 au 4 octobre", "Ateliers pratiques de sensibilisation", false],
      ["4 octobre", "Clôture de " + NAME, false],
      ["Accès", "Ouvert à tous (15-25 ans), sur inscription", false],
    ],
    steps: STEPS_VISITOR,
  },
  challenge: {
    label: "Participant au challenge (15-25 ans)",
    intro:
      "Inscrivez-vous pour tester vos compétences face au chrono : débusquez les failles, résolvez les énigmes et affrontez les autres participants !",
    stepsTitle: "Votre parcours pour le challenge",
    dates: [
      ["1er octobre", "Cérémonie d’ouverture & briefing", false],
      ["2 octobre", "Lancement officiel du challenge", true],
      ["4 octobre", "Remise des prix et clôture de " + NAME, false],
      ["Format", "Défis individuels contre la montre", false],
    ],
    steps: STEPS_CHALLENGE,
  },
};

const CRITERIA = [
  "Être âgé(e) de 15 à 25 ans",
  "Être scolarisé(e), étudiant(e), en formation ou simplement passionné(e) de cybersécurité",
  "Participer à titre individuel : le concours se joue en solo",
  "Disposer d’un ordinateur portable / smartphone et d’une connexion stable",
  "Aucun niveau minimum requis : les débutants sont les bienvenus",
  "Aimer relever des challenges et acquérir de nouvelles compétences",
];

const RULES = [
  [
    "Article 1 · Organisation",
    "Le concours est organisé par l’association organisatrice (nom et adresse à compléter). Il est gratuit et ouvert à toute personne remplissant les critères d’éligibilité.",
  ],
  [
    "Article 2 · Inscription",
    "Chaque participant s’inscrit une seule fois, en ligne, et garantit l’exactitude des informations de son dossier. Seuls les dossiers conformes aux critères d’éligibilité sont retenus.",
  ],
  [
    "Article 3 · Déroulement",
    "Les candidats retenus passent un test d’évaluation. Ceux qui atteignent le score minimal sont qualifiés et concourent lors du challenge, qui débute le 2 octobre.",
  ],
  [
    "Article 4 · Fair-play",
    "Il est interdit d’attaquer la plateforme, de partager les solutions entre participants ou de perturber les autres participants. Toute triche entraîne une disqualification.",
  ],
  [
    "Article 5 · Prix",
    "Les lots sont attribués aux meilleurs participants du challenge. Ils ne sont ni échangeables ni remboursables.",
  ],
  [
    "Article 6 · Données personnelles",
    "Les données collectées servent uniquement à la gestion du concours. Tu peux les consulter, les corriger ou les supprimer sur simple demande.",
  ],
];

const PARTNERS = [
  "Partenaire A",
  "Partenaire B",
  "Partenaire C",
  "Partenaire D",
  "Partenaire E",
  "Partenaire F",
  "Partenaire G",
];

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */
function useScramble(text: string) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const glyphs = "01#@$%&*+=<>/";
    const total = 30;
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const revealed = (frame / total) * text.length;
      setOut(
        text
          .split("")
          .map((c, i) =>
            c === " " || i < revealed
              ? c
              : glyphs[Math.floor(Math.random() * glyphs.length)],
          )
          .join(""),
      );
      if (frame >= total) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [text]);
  return out;
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  return {
    jours: Math.floor(diff / 86400000),
    heures: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    secondes: Math.floor((diff / 1000) % 60),
  };
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && (setSeen(true), io.disconnect()),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/* ------------------------------------------------------------------ */
/*  Petits composants                                                  */
/* ------------------------------------------------------------------ */
function Digit({ value, label }: { value: number; label: string }) {
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

function Rule({ title, text }: { title: string; text: string }) {
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

function Step({
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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function Welcome({
  canRegister = true,
}: {
  canRegister?: boolean;
}) {
  const { auth } = usePage<SharedData>().props;
  const title = useScramble(NAME);
  const time = useCountdown(START);
  const heroRef = useRef<HTMLElement>(null);
  const [profile, setProfile] = useState<Profile>("challenge");
  const current = PROFILES[profile];

  const onMove = (e: React.MouseEvent) => {
    const r = heroRef.current?.getBoundingClientRect();
    if (!r) return;
    heroRef.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
    heroRef.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <>
      <Head title="Accueil">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=unbounded:500,700,900|manrope:400,500,700"
          rel="stylesheet"
        />
      </Head>

      <style>{`
                .font-display{font-family:'Unbounded',system-ui,sans-serif}
                .font-body{font-family:'Manrope',system-ui,sans-serif}
                html{scroll-behavior:smooth}
                .grid-bg{background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:56px 56px;animation:drift 12s linear infinite;mask-image:radial-gradient(ellipse at center,#000 30%,transparent 75%)}
                @keyframes drift{to{background-position:56px 56px}}
                .spot{background:radial-gradient(420px circle at var(--mx,50%) var(--my,30%),rgba(59,130,246,.22),transparent 70%)}
                .digit{display:inline-block;animation:tick .35s ease-out}
                @keyframes tick{from{transform:translateY(-35%);opacity:0}to{transform:none;opacity:1}}
                .marquee{animation:slide 28s linear infinite}
                .marquee-wrap:hover .marquee{animation-play-state:paused}
                @keyframes slide{to{transform:translateX(-50%)}}
                .float{animation:float 6s ease-in-out infinite}
                @keyframes float{50%{transform:translateY(-12px) rotate(2deg)}}
                .scan{animation:scan 5s ease-in-out infinite}
                @keyframes scan{0%,100%{top:8%}50%{top:88%}}
                @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
            `}</style>

      <div className="dark font-body min-h-screen bg-background text-foreground selection:bg-primary/40">
        {/* Navigation */}
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-lg">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
            <a href="#" className="font-display text-sm font-bold">
              Congo CyberSecurity Platform
            </a>
            <ul className="hidden gap-6 text-sm text-muted-foreground lg:flex">
              {SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-sm">
              {auth.user ? (
                <Link
                  href={dashboard()}
                  className="rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground transition hover:brightness-110"
                >
                  Mon espace
                </Link>
              ) : (
                <>
                  <Link
                    href={login()}
                    className="rounded-full px-4 py-2 transition hover:bg-secondary"
                  >
                    Connexion
                  </Link>
                  {canRegister && (
                    <Link
                      href={register()}
                      className="rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground transition hover:brightness-110"
                    >
                      S’inscrire
                    </Link>
                  )}
                </>
              )}
            </div>
          </nav>
        </header>

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

        {/* Footer */}
        <footer className="border-t border-border bg-[#03060c]">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display font-bold">
                Congo CyberSecurity Platform
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                © 2026 ANSSI CONGO. Tous droits réservés.
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="transition-colors hover:text-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </>
  );
}
