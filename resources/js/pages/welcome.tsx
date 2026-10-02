import { WelcomeContact } from "@/components/welcome/contact";
import { WelcomeEligibility } from "@/components/welcome/eligibility";
import { WelcomeFooter } from "@/components/welcome/footer";
import { WelcomeHero } from "@/components/welcome/hero";
import { WelcomeInfos } from "@/components/welcome/infos";
import { WelcomeNav } from "@/components/welcome/nav";
import { WelcomePartners } from "@/components/welcome/partners";
import { WelcomeRules } from "@/components/welcome/rules";
import { WelcomeStyles } from "@/components/welcome/styles";
import { NAME, PROFILES, START, type Profile } from "@/components/welcome/content";
import { useCountdown, useScramble } from "@/components/welcome/hooks";
import { type SharedData } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { useRef, useState } from "react";

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

      <WelcomeStyles />

      <div className="dark font-body min-h-screen bg-background text-foreground selection:bg-primary/40">
        <WelcomeNav auth={auth} canRegister={canRegister} />
        <WelcomeHero canRegister={canRegister} title={title} time={time} heroRef={heroRef} onMove={onMove} />
        <WelcomeInfos profile={profile} setProfile={setProfile} current={current} />
        <WelcomeEligibility />
        <WelcomeRules />
        <WelcomePartners />
        <WelcomeContact />
        <WelcomeFooter />
      </div>
    </>
  );
}
