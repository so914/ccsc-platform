import { SECTIONS } from "./content";
import { dashboard, login, register } from "@/routes";
import { type SharedData } from "@/types";
import { Link } from "@inertiajs/react";

export function WelcomeNav({ auth, canRegister }: { auth: SharedData["auth"]; canRegister: boolean }) {
  return (
    <>
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
    </>
  );
}
