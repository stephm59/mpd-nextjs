# État des lieux — mpd-next

Snapshot pris le 2026-05-12, avant développement de la page `/rdv`.

---

## 1. Structure du dossier `app/`

```
app/
├── [slug]/                  → page.tsx (pages service-ville dynamiques)
├── avis/                    → page.tsx
├── carnet/                  → page.tsx (liste blog)
│   └── [slug]/              → page.tsx (article)
├── contact/                 → page.tsx
├── entreprise/              → page.tsx
├── mentions-legales/        → page.tsx
├── favicon.ico
├── globals.css
├── layout.tsx               (root layout, Inter font, GA4)
├── page.tsx                 (home)
├── page.module.css
├── robots.ts
└── sitemap.ts
```

**Routes existantes** : `/`, `/[slug]` (ex: `plombier-lille`), `/avis`, `/carnet`, `/carnet/[slug]`, `/contact`, `/entreprise`, `/mentions-legales`.

**Aucun dossier `app/api/`** — il n'y a actuellement **aucun route handler** (`route.ts`). À créer pour les endpoints RDV (webhook, validation créneau, etc.).

---

## 2. Server Actions

**Aucun fichier contenant la directive `"use server"`** dans `app/`, `lib/` ou `components/`.

Le projet n'utilise pas (encore) les Server Actions. Tous les formulaires actuels (`ContactForm.tsx`) sont des composants `'use client'` qui appellent EmailJS directement depuis le navigateur.

→ Pour `/rdv`, c'est un terrain vierge : tu peux introduire Server Actions ou Route Handlers selon ton choix d'architecture.

---

## 3. Configuration Supabase

**Librairie utilisée** : `@supabase/supabase-js` (v2.101.1) uniquement.
**PAS de `@supabase/ssr`** installé — pas de gestion de session/cookies actuellement.

**Initialisation** :
- `lib/supabase/client.ts` — client navigateur (`'use client'`, `createClient` avec ANON_KEY)
- `lib/supabase/server.ts` — `createServerClient()` pour Server Components (utilise aussi ANON_KEY — pas de service_role)
- `lib/supabase.ts` — barrel d'export + fonctions utilitaires (`getAllBlogPosts`, `getRelatedBlogPosts`)

**Types TypeScript générés** : oui — `lib/supabase/types.ts` (407 lignes, `Database` typé).

**Tables existantes** (extraites des types) :
- `blog_posts`, `blog_post_faqs`
- `services`, `cities`
- `service_city_pages`, `service_city_offers`, `service_city_faqs`
- `service_faqs_generic`
- `testimonials`
- `redirects`

**Variables d'env (`.env.local`)** :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

⚠️ **Aucune `SUPABASE_SERVICE_ROLE_KEY`** côté serveur. Pour écrire des RDV depuis un endpoint avec contournement de RLS, il faudra l'ajouter.

---

## 4. Dossier `supabase/` à la racine

Contenu :
```
supabase/
└── remove-fioul.sql      (script SQL one-shot de nettoyage, 42 ko)
```

- **PAS de `config.toml`** → **Supabase CLI non configurée localement**.
- **PAS de dossier `migrations/`** → pas de système de migrations versionnées.
- **PAS de `seed.sql`**.
- Le projet est piloté en mode "remote-only" : les modifications de schéma se font directement dans la console Supabase, puis les types sont régénérés.

→ Pour `/rdv`, à décider : initialiser la CLI (`supabase init`) pour migrations versionnées, ou continuer en remote-only.

---

## 5. shadcn/ui

- **PAS de `components.json`** à la racine → **shadcn CLI jamais initialisée**.
- Les composants UI ont été **copiés/écrits manuellement** dans le style shadcn (utilisent `cva`, `@radix-ui/react-slot`, `cn`).

**Composants présents dans `components/ui/`** :
- `button.tsx` (variants : default, outline, ghost, link / sizes : default, sm, lg, icon)
- `card.tsx`
- `input.tsx`
- `label.tsx`
- `textarea.tsx`
- `StickyCallBar.tsx` (custom, pas shadcn)

**Pas encore présents** (utiles pour `/rdv`) : `dialog`, `select`, `calendar`, `popover`, `radio-group`, `checkbox`, `form`, `toast`, `tabs`.

**Path d'import** : `@/components/ui/...` (alias `@/*` → racine projet, défini dans `tsconfig.json`).

---

## 6. Composants utilitaires existants

**`lib/utils.ts`** :
- `cn()` — helper `clsx + twMerge` (standard shadcn).

**`lib/blog-image.ts`** :
- `resolveBlogImage()` — résout les URLs d'images blog vers le bucket R2.

**`lib/jsonld.ts`** :
- Générateurs JSON-LD (Home, ServiceCity, BlogPost).

**Hooks custom** : **aucun** (pas de dossier `hooks/`).

**Wrapper de formulaire** :
- Pas de wrapper générique. Le pattern utilisé dans `ContactForm.tsx` :
  - `react-hook-form` + `useForm({ resolver: zodResolver(schema) })`
  - Schéma `zod` inline
  - Composants UI shadcn (`Input`, `Label`, `Textarea`, `Button`)
  - Submit handler → `emailjs.send(...)` côté client
- Un seul formulaire existant : `components/forms/ContactForm.tsx` (utilisable en modal ou inline).

---

## 7. Tailwind config

**Fichier** : `tailwind.config.ts` (v3.4.19, plugin `tailwindcss-animate` + `@tailwindcss/typography`).

**Couleurs custom MPD** (définies en HSL via CSS vars dans `app/globals.css`) :
- `primary` — bleu MPD (220 91% 25%) + `primary-light` (220 84% 35%)
- `urgent` — orange (20 91% 48%) + `urgent-hover`
- `accent` — rouge (4 87% 60%) + `accent-light`
- `rating` — jaune (45 93% 58%)
- `success` — vert (142 76% 36%)
- `destructive`, `muted`, `border`, `input`, `ring`, `popover`, `card`, `background`, `foreground`
- Mode `dark` configuré (class-based)

**Polices** : Inter via `next/font/google` (variable `--font-inter`, swap, preload).

**Container** : centré, padding 2rem, max `1400px` à `2xl`.

**Gradients** : `gradient-primary`, `gradient-urgent`, `gradient-hero`.

**Shadows** : `card`, `elevated`, `urgent`.

**Animations** : `fade-in-up/down`, `slide-in-left/right`, `bounce-gentle`, `pulse-slow`, `accordion-up/down`.

**Breakpoints** : valeurs Tailwind par défaut (`sm`, `md`, `lg`, `xl`, `2xl`). Le code utilise principalement `md` et `lg`.

---

## 8. Versions des dépendances clés

| Catégorie | Package | Version |
|---|---|---|
| Framework | `next` | `15.5.14` |
| | `react` | `19.1.0` |
| | `react-dom` | `19.1.0` |
| | `typescript` | `^5` |
| Supabase | `@supabase/supabase-js` | `^2.101.1` |
| | `@supabase/ssr` | ❌ non installé |
| Tailwind | `tailwindcss` | `^3.4.19` |
| | `@tailwindcss/typography` | `^0.5.19` |
| | `tailwindcss-animate` | `^1.0.7` |
| | `tailwind-merge` | `^3.5.0` |
| | `autoprefixer` | `^10.4.27` |
| | `postcss` | `^8.5.8` |
| shadcn deps | `@radix-ui/react-dialog` | `^1.1.15` |
| | `@radix-ui/react-label` | `^2.1.8` |
| | `@radix-ui/react-slot` | `^1.2.4` |
| | `class-variance-authority` | `^0.7.1` |
| | `clsx` | `^2.1.1` |
| | `lucide-react` | `^1.7.0` |
| Form / validation | `react-hook-form` | `^7.72.1` |
| | `@hookform/resolvers` | `^5.2.2` |
| | `zod` | `^4.3.6` |
| Email | `@emailjs/browser` | `^4.4.1` (côté client uniquement) |
| | `resend` / `nodemailer` | ❌ aucun mailer serveur installé |
| Markdown | `react-markdown` | `^10.1.0` |
| | `remark-gfm` | `^4.0.1` |
| | `rehype-raw` | `^7.0.0` |

⚠️ **Pour `/rdv` avec emails auto serveur**, prévoir un ajout : Resend (recommandé sur Vercel) ou Nodemailer. EmailJS reste possible mais reste un appel client (clé exposée).

⚠️ **`googleapis`** (pour Google Calendar) **non installé** — à ajouter pour intégrer les 5 agendas.

---

## 9. Structure spécifique du blog (réutilisable)

**Stockage** : table `blog_posts` dans Supabase, colonnes principales :
- `id`, `slug`, `title`, `excerpt`, `content` (Markdown), `cover_image_url`, `published`, `published_at`, `service_id`
- Relation FK vers `services` (`service_id`)
- FAQs liées via table `blog_post_faqs` (1-N)

**Images** : stockées dans un bucket **Cloudflare R2** public (pas Supabase Storage), URLs résolues par `lib/blog-image.ts`.

**Lecture** :
- Liste : `app/carnet/page.tsx` (Server Component) → appelle `getAllBlogPosts()` de `lib/supabase.ts` → passe à `CarnetClient.tsx` (Client Component avec recherche/filtres).
- Détail : `app/carnet/[slug]/page.tsx` (Server Component) avec `generateStaticParams()` + `generateMetadata()` + injection JSON-LD via `next/script`.
- Rendu Markdown via `react-markdown` + `remark-gfm` + `rehype-raw`.

**Patterns réutilisables pour `/rdv`** :
- Le combo "Server Component pour fetch initial + Client Component pour interactivité" est la convention du projet.
- `createServerClient()` depuis `lib/supabase/server.ts` pour les lectures côté serveur.
- `react-hook-form` + `zod` + composants `@/components/ui/*` pour le formulaire (cf. `ContactForm.tsx`).
- Pour le SEO, ajouter `generateMetadata` + JSON-LD si besoin.

---

## Synthèse — manques à combler pour `/rdv`

| Besoin | État actuel | Action |
|---|---|---|
| Route handlers `app/api/*` | inexistants | À créer (webhook, validation créneau, création RDV) |
| Service role Supabase | non configurée | Ajouter `SUPABASE_SERVICE_ROLE_KEY` en env serveur |
| Mailer serveur | aucun (EmailJS client only) | Installer Resend (recommandé Vercel) ou Nodemailer |
| Google Calendar | `googleapis` non installé | À installer + créer service account / OAuth pour 5 agendas |
| Composants UI manquants | `dialog`, `select`, `calendar`, `popover`, `radio-group`, `form`, `toast`, `tabs` | Init shadcn CLI (`components.json`) ou copier manuellement |
| Migrations Supabase | pas de CLI ni de dossier `migrations/` | À décider : init `supabase` CLI ou continuer remote-only |
| Table `appointments` (ou équivalent) | absente | À créer dans Supabase |
