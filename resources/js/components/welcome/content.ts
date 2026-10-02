export const NAME = "Congo CyberSecurity 2026";
export const START = new Date("2026-10-02T09:00:00"); // début du challenge
export const SECTIONS = [
  ["presentation", "A propos"],
  ["infos", "Infos & dates"],
  ["eligibilite", "Éligibilité"],
  ["reglement", "Règlement"],
  ["partenaires", "Partenaires"],
  ["contact", "Contact"],
] as const;

export const STEPS_CHALLENGE = [
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

export const STEPS_VISITOR = [
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

export type Profile = "visiteur" | "challenge";

export const PROFILES: Record<
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

export const CRITERIA = [
  "Être âgé(e) de 15 à 25 ans",
  "Être scolarisé(e), étudiant(e), en formation ou simplement passionné(e) de cybersécurité",
  "Participer à titre individuel : le concours se joue en solo",
  "Disposer d’un ordinateur portable / smartphone et d’une connexion stable",
  "Aucun niveau minimum requis : les débutants sont les bienvenus",
  "Aimer relever des challenges et acquérir de nouvelles compétences",
];

export const RULES = [
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

export const PARTNERS = [
  "Partenaire A",
  "Partenaire B",
  "Partenaire C",
  "Partenaire D",
  "Partenaire E",
  "Partenaire F",
  "Partenaire G",
];
