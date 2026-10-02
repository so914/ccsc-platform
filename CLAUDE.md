# Plateforme de concours (ex-EduSistem)

Plateforme annuelle de concours avec présélection en ligne de type CTF, puis finale en présentiel.

Stack : Laravel 12, Inertia 2, React 19, TypeScript, Tailwind 4, shadcn/ui, Wayfinder, Pest.
Packages : Fortify, Sanctum, Spatie Permission, Activitylog, Settings, Medialibrary.

## Rôles

admin, agent, challenger (candidat), participant (ateliers). Les rôles décident des droits, les catégories (Junior, Senior...) décident des épreuves accessibles et sont portées par `contest_participants`.

## Domaine

Contest -> Exam -> Challenge (via challenge_exam) -> Attempt -> Submission -> Result -> Finalist.
Workshop et WorkshopRegistration sont indépendants des examens.

## Règles à respecter

- Aucune suppression physique des concours, tentatives, soumissions, résultats, finalistes : on archive. Les clés étrangères sont en restrictOnDelete.
- Un challenge utilisé par un examen qui a des tentatives n'est plus modifiable (seuls statut et explication).
- La composition d'un examen est figée dès qu'une tentative existe.
- Le classement n'est pas stocké : `RankingService` le calcule à partir de `results` avec `contests.tie_breakers`. `finalists` fige la qualification.
- Les autorisations sont vérifiées côté Laravel (middleware role/permission, Policies, scopes `forUser`). Un agent ne voit que les concours de `contest_agent`.
- Les contrôleurs `app/Http/Controllers/Shared` servent à la fois `/admin/*` et `/agent/*` (préfixe via `Controller::prefix`).
- Logique métier : `app/Services/AttemptService.php` (démarrage, sauvegarde, notation, résultat) et `RankingService.php`.

## Commandes

- `php artisan migrate && php artisan db:seed --class=RolesAndPermissionsSeeder`
- `php artisan test`
- `npx tsc --noEmit`
- `php artisan wayfinder:generate` après un changement de routes

## Reste du code scolaire

Les modèles, contrôleurs, pages et tests Master Data et PPDB sont supprimés. Les anciennes migrations (`database/migrations`, `database/migrations/ppdb`) sont conservées pour ne pas casser les bases existantes.
