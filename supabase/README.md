# Scripts SQL Supabase — mpd-next

Ce dossier contient les scripts SQL appliqués manuellement sur la base
Supabase de production via le SQL Editor du Dashboard Supabase.

## Mode de fonctionnement

Le projet n'utilise PAS la CLI Supabase. Les modifications de schéma sont
faites en mode "remote-only" : on exécute les scripts SQL directement dans
le Dashboard Supabase, puis on régénère les types TypeScript avec :

```bash
npx supabase gen types typescript --project-id bpwqdkznbmqwvvxpthhl > lib/supabase/types.ts
```

## Ordre d'exécution des scripts

Les scripts sont numérotés et doivent être exécutés dans l'ordre.

| Script | Description | Date application |
|--------|-------------|------------------|
| remove-fioul.sql | Nettoyage one-shot pages fioul | (antérieur) |
| 001-create-tables-rdv.sql | Création tables RDV (services, villes, tarifs, techniciens, marques, réservations, notifications, compétences) | 2026-05-12 |
| 002-seed-data-rdv.sql | Seed initial : 5 services, 39 villes, 5 techs, 8 marques, 195 tarifs | 2026-05-12 |

## En cas de reset complet de la base

1. Re-exécuter 001 puis 002 dans cet ordre
2. Régénérer les types TypeScript (commande ci-dessus)
3. Vérifier que .env.local et les env vars Vercel sont à jour
