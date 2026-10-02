import { SECTIONS } from "./content";

export function WelcomeFooter() {
  return (
    <>
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
    </>
  );
}
