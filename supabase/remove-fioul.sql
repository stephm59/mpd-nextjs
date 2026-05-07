-- Suppression des mentions "fioul" dans Supabase
-- Généré 2026-05-07T07:14:30.659Z

BEGIN;

-- blog_posts 6361a8a6-f5ae-4b47-a44b-1f9802373c85 (differents-types-chaudieres) : suppression de la section « La chaudière au fioul » + excerpt
UPDATE blog_posts SET
  content = $mpd$# Les différents types de chaudières et leur fonction

Depuis plusieurs décennies, la chaudière est l'un des systèmes les plus utilisés pour produire de l'eau chaude et chauffer nos maisons.
Si les modèles anciens étaient souvent polluants et peu sûrs, les chaudières modernes sont plus performantes, plus sûres et plus respectueuses de l'environnement.

Alors, quelles sont les grandes familles de chaudières ? Voyons ensemble leurs caractéristiques principales.

## 1. Les chaudières selon leur fonction

**Chaudière chauffage seul** : elle chauffe uniquement l'eau qui circule dans vos radiateurs.

**Chaudière mixte** : elle combine deux fonctions → chauffage + eau chaude sanitaire. Plus compacte et économique, elle est très répandue dans les foyers modernes.

## 2. Les chaudières selon le combustible utilisé

### 🔌 La chaudière électrique

Fonctionne uniquement à l'électricité.

**Avantages** : aucune combustion, pas de gaz à surveiller, sécurité renforcée.

**Inconvénients** : consommation électrique importante selon l'isolation et la taille du logement.

### 🔥 La chaudière à gaz

Les plus courantes en France. Elles peuvent fonctionner avec :

- **Gaz butane** (bouteilles, assez rare pour un usage chauffage).
- **Gaz propane** (en citerne ou en bouteille, efficace même par grand froid).
- **Gaz naturel** (raccordement au réseau de ville, le plus économique et écologique).

### 🌱 La chaudière à biomasse

Utilise des combustibles naturels : granulés, bois, résidus forestiers.

**Avantages** : solution renouvelable et respectueuse de l'environnement.

**Inconvénients** : nécessite un espace de stockage et un approvisionnement régulier.

## 3. Comment fonctionne une chaudière ?

Une chaudière comporte :

- un brûleur (ou résistance pour l'électrique) qui produit de la chaleur,
- un échangeur thermique qui transfère cette chaleur à l'eau,
- des circuits séparés pour l'eau de chauffage et l'eau sanitaire.

👉 Ainsi, lorsque vous ouvrez le robinet ou allumez vos radiateurs, l'eau chauffée circule et assure confort et chaleur dans votre maison.

## Conclusion

Chaque type de chaudière présente ses avantages et ses limites. Le bon choix dépend de votre logement, de vos habitudes de consommation et des énergies disponibles dans votre région.

👉 Besoin d'un conseil personnalisé ? Contactez **Mon p'tit Dépanneur** au **03 28 53 48 68**. Nos chauffagistes qualifiés vous aideront à trouver la solution la mieux adaptée.$mpd$,
  excerpt = $mpd$Chaudières à gaz, électriques ou à biomasse : découvrez les différents types de chaudières, leurs avantages et inconvénients, et comment choisir celle qui convient à votre logement.$mpd$
WHERE id = '6361a8a6-f5ae-4b47-a44b-1f9802373c85';

-- blog_posts 34c083e0-e4e4-4bcf-949d-c291ad700e99 (choisir-chaudiere-ou-chauffe-eau) : 1 → 0 occurrence(s) "fioul"
UPDATE blog_posts SET content = $mpd$Besoin d'eau chaude au quotidien 💧 ? Entre chaudière, chauffe-eau électrique et chauffe-eau au gaz, il n'est pas toujours facile de s'y retrouver. Chaque système a ses avantages et ses limites.

Chez Mon p'tit Dépanneur, on vous explique clairement les différences pour vous aider à faire le bon choix.

## 1. La chaudière : eau chaude + chauffage

**Usage idéal** : si vous avez besoin d'eau chaude sanitaire et de chauffage central (radiateurs, plancher chauffant).

**Fonctionnement** : la chaudière chauffe l'eau via un brûleur gaz et alimente à la fois vos robinets et vos radiateurs.

**Avantages** :
✔️ deux fonctions en un seul appareil
✔️ rendements très élevés avec les modèles à condensation
✔️ économies jusqu'à 30 % sur la facture de gaz

**Inconvénients** :
❌ installation plus lourde (nécessite un raccordement au gaz)
❌ coût d'achat supérieur

## 2. Le chauffe-eau au gaz : uniquement pour l'eau chaude

**Usage idéal** : si vous ne voulez chauffer que l'eau sanitaire (cuisine, salle de bains).

**Fonctionnement** : l'eau est chauffée instantanément via un brûleur gaz naturel, butane ou propane.

**Avantages** :
✔️ chauffe rapide et sans limite de volume
✔️ coût de fonctionnement plus bas que l'électricité
✔️ appareil compact

**Inconvénients** :
❌ nécessite un raccordement gaz ou des bouteilles
❌ capacité limitée en litres/minute (5 à 15 L/min)

## 3. Le chauffe-eau électrique (cumulus) : simple et polyvalent

**Usage idéal** : si vous n'avez pas accès au gaz ou pour une résidence secondaire.

**Fonctionnement** : un ballon stocke l'eau chaude et la maintient à température.

**Avantages** :
✔️ installation rapide et peu coûteuse
✔️ compact, s'installe partout (vertical ou horizontal)
✔️ peu d'entretien

**Inconvénients** :
❌ capacité limitée (50 L par personne en moyenne)
❌ temps de chauffe parfois long (1 à 6h)
❌ coût de l'électricité supérieur au gaz

## Conclusion

👉 En résumé :

**Chaudière** = eau chaude + chauffage, idéale pour une maison.

**Chauffe-eau au gaz** = eau chaude illimitée, pratique si vous avez déjà le gaz.

**Chauffe-eau électrique** = simple et polyvalent, parfait sans gaz ou pour un usage ponctuel.

Besoin d'aide pour choisir et installer votre équipement ?
Appelez Mon p'tit Dépanneur au 03 28 53 48 68 : nos chauffagistes vous conseillent selon votre logement et vos habitudes.$mpd$ WHERE id = '34c083e0-e4e4-4bcf-949d-c291ad700e99';

-- blog_posts e6e5bcea-c2bf-4d5b-ab89-4b376d2c8485 (aides-remplacement-chaudiere-maprimerenov) : 1 → 0 occurrence(s) "fioul"
UPDATE blog_posts SET content = $mpd$# Remplacer sa chaudière avec MaPrimeRénov' : conditions, montant et démarches

Votre chaudière fatigue ? 🔧 Sachez qu'il existe des aides financières de l'État pour la remplacer par un modèle plus performant et moins énergivore.
La plus connue : MaPrimeRénov'.

Dans ce guide, Mon P'tit Dépanneur vous explique clairement :

• qui peut en bénéficier,
• quels sont les montants,
• quelles démarches effectuer,
• et quelles alternatives existent.

## Pourquoi remplacer sa chaudière ?

👉 60 % des chaudières en France sont anciennes et peu efficaces.
Les remplacer, c'est :

• réduire vos factures d'énergie 💶,
• améliorer votre confort thermique 🌡️,
• limiter les émissions polluantes 🌍.

Les chaudières à condensation sont aujourd'hui le standard, car elles récupèrent la chaleur des fumées et permettent jusqu'à 30 % d'économies par rapport aux modèles classiques.

## MaPrimeRénov' : l'aide phare

Créée en 2020, MaPrimeRénov' est une prime de l'État versée par l'ANAH (Agence nationale de l'habitat).
Elle est attribuée en fonction de vos revenus et du type de travaux réalisés.

### Qui peut en bénéficier ?

• Tous les propriétaires occupants ou bailleurs,
• Logements construits depuis plus de 15 ans,
• Installation réalisée par un professionnel RGE (Reconnu Garant de l'Environnement).

### Quels équipements sont concernés ?

• Chaudières à gaz haute performance (à condensation),
• Chaudières biomasse,
• Pompes à chaleur (PAC air/eau, géothermique),
• Chauffe-eau solaire ou thermodynamique.


## Montants de MaPrimeRénov'

Le montant dépend de vos revenus et du type de chaudière installée.

| Revenus du ménage (profil MaPrimeRénov') | Chaudière gaz condensation | Chaudière biomasse | Pompe à chaleur air/eau |
|---|---|---|---|
| | | | |
| **Très modestes** (MaPrimeRénov' Bleu) | jusqu'à **1 200 €** | jusqu'à **11 000 €** | jusqu'à **9 000 €** |
| | | | |
| **Modestes** (Jaune) | jusqu'à **800 €** | jusqu'à **9 000 €** | jusqu'à **7 500 €** |
| | | | |
| **Intermédiaires** (Violet) | non éligible | jusqu'à **4 000 €** | jusqu'à **3 000 €** |
| | | | |
| **Supérieurs** (Rose) | non éligible | non éligible | non éligible |

💡 **Bon à savoir** : MaPrimeRénov' est cumulable avec les CEE (Certificats d'Économie d'Énergie), la TVA réduite à 5,5 % et l'éco-PTZ (prêt à taux zéro).

## Quelles démarches pour obtenir MaPrimeRénov' ?

1️⃣ Faites un devis avec un professionnel RGE.

2️⃣ Créez un compte sur [www.maprimerenov.gouv.fr](https://www.maprimerenov.gouv.fr).

3️⃣ Déposez votre demande avec : devis, pièces justificatives (revenus, logement, etc.).

4️⃣ Une fois la demande validée, lancez les travaux.

5️⃣ Envoyez la facture et recevez la prime par virement bancaire.

⏳ Le délai de versement est en moyenne de 4 à 6 semaines après validation du dossier.

## Autres aides disponibles

• **Primes CEE** : financées par les fournisseurs d'énergie.
• **TVA réduite à 5,5 %** : applicable sur l'achat et la pose.
• **Éco-PTZ** : prêt à taux zéro jusqu'à 50 000 € pour financer vos travaux de rénovation énergétique.

## En résumé

👉 MaPrimeRénov' est une aide simple et efficace pour remplacer une chaudière ancienne par un équipement moderne et économique.

👉 Elle peut être cumulée avec d'autres aides.

👉 Un seul impératif : faire appel à un professionnel RGE.

**Besoin d'accompagnement ?**
Contactez Mon P'tit Dépanneur au 📞 03 28 53 48 68 : nos chauffagistes RGE vous guident dans le choix de la chaudière et dans vos démarches administratives.$mpd$ WHERE id = 'e6e5bcea-c2bf-4d5b-ab89-4b376d2c8485';

-- blog_posts 7b32c1bf-4471-4fbe-809b-6e2b7960b7fb (planifier-entretien-chaudiere) : 2 → 0 occurrence(s) "fioul"
UPDATE blog_posts SET content = $mpd$# Entretien annuel des chaudières : pourquoi c'est important et comment le planifier

En France, l'entretien annuel de votre chaudière est obligatoire. Mais au-delà de la loi, c'est surtout une question de sécurité, d'économies et de confort. Voici pourquoi il est indispensable… et comment bien l'organiser.

## 1. Pourquoi entretenir sa chaudière chaque année ?

🔒 **Sécurité** : une chaudière mal entretenue peut provoquer des fuites de gaz ou des émissions de monoxyde de carbone (incolore et inodore, mais très dangereux).

⚡ **Performance** : un entretien régulier assure un rendement optimal et évite la surconsommation.

💶 **Économies** : une chaudière bien réglée consomme jusqu'à 12 % de moins.

⏳ **Durée de vie prolongée** : entretenue, une chaudière peut durer 15 à 20 ans au lieu de 10.

📜 **Conformité légale** : en France, l'entretien annuel est obligatoire pour toutes les chaudières gaz, bois ou charbon de 4 à 400 kW.

## 2. Quand planifier l'entretien de votre chaudière ?

👉 L'idéal est de le prévoir **avant l'hiver** (septembre-octobre) ou **juste après** (mars-avril).
Ainsi :

- vous évitez les périodes de forte demande (et donc les délais),
- vous êtes assuré d'avoir un chauffage en parfait état pour les premiers froids.

## 3. Comment organiser l'entretien annuel ?

**Choisir un professionnel qualifié** : faites appel à un chauffagiste agréé, comme Mon p'tit Dépanneur, pour un contrôle complet et conforme à la réglementation.

**Prendre rendez-vous** : anticipez pour obtenir une date qui vous arrange.

**Penser au contrat d'entretien** : c'est souvent la solution la plus simple et économique. Un contrat inclut :

- l'entretien annuel obligatoire,
- une assistance dépannage prioritaire,
- parfois même le remplacement de pièces défectueuses.

## 4. Pourquoi passer par un professionnel ?

Lors de l'entretien, le chauffagiste :

- vérifie et nettoie les principaux éléments (brûleur, échangeur, conduit),
- contrôle les émissions de gaz,
- ajuste les réglages pour optimiser le rendement,
- délivre une attestation légale d'entretien (à conserver pour votre assurance).

👉 Confier cette mission à Mon p'tit Dépanneur, c'est la garantie d'un travail sérieux et d'un suivi complet.

📞 **Besoin de planifier l'entretien de votre chaudière à Lille ou dans la métropole lilloise ?**
Appelez-nous au 03 28 53 48 68.

## FAQ - Questions fréquentes

### L'entretien annuel de chaudière est-il vraiment obligatoire ?

Oui. Depuis le décret n°2009-649, il est obligatoire pour toute chaudière entre 4 et 400 kW (gaz, bois, charbon).

### Que risque-t-on si on ne fait pas l'entretien ?

En cas de sinistre, votre assurance habitation peut refuser de vous indemniser. Vous vous exposez aussi à des risques de sécurité (intoxication au CO).

### Combien coûte l'entretien d'une chaudière ?

Le tarif varie selon le modèle et la région, en moyenne entre 100 et 180 € TTC. Un contrat d'entretien annuel peut être plus économique sur le long terme.

### Que comprend l'entretien annuel ?

- Vérification et nettoyage des pièces essentielles,
- contrôle de la combustion,
- réglage pour optimiser le rendement,
- attestation remise à l'occupant.

### Un contrat d'entretien, est-ce vraiment utile ?

Oui. En plus de l'entretien obligatoire, vous bénéficiez d'une intervention rapide en cas de panne et parfois du remplacement gratuit de certaines pièces.

### Puis-je entretenir moi-même ma chaudière ?

Non. La loi impose que ce soit fait par un professionnel qualifié qui vous remet une attestation officielle.

### Quelle est la meilleure période pour l'entretien ?

Avant l'hiver, pour garantir un fonctionnement optimal quand vous rallumez le chauffage, ou au printemps, pour anticiper la saison suivante.

### Est-ce valable aussi pour les chaudières récentes ?

Oui. Même neuve, une chaudière doit être contrôlée chaque année pour maintenir sa garantie et optimiser sa durée de vie.$mpd$ WHERE id = '7b32c1bf-4471-4fbe-809b-6e2b7960b7fb';

-- blog_posts d46ed00c-570d-4bc4-8d71-a168ffe7fd9e (thermostat-sans-fil-avantages) : 1 → 0 occurrence(s) "fioul"
UPDATE blog_posts SET content = $mpd$# Thermostat sans fil : avantages, économies et modèles à connaître

Réguler sa consommation de chauffage est devenu essentiel pour réduire ses factures et améliorer son confort au quotidien. Bonne nouvelle : le thermostat sans fil est une solution simple, efficace et accessible pour y parvenir.

De plus en plus présent dans les foyers, il s'installe rapidement et s'adapte à tous les systèmes de chauffage (chaudière gaz, pompe à chaleur, etc.). Voyons ensemble ses avantages et les différents modèles disponibles.

## 1. À quoi sert un thermostat sans fil ?

Contrairement au thermostat filaire (relié à la chaudière par câble), le thermostat sans fil communique à distance avec votre système de chauffage via un récepteur.

👉 **Avantages** :

- réglage précis de la température par demi-degré,
- pas besoin de gros travaux pour l'installation,
- adaptation facile à tous types d'appareils de chauffage.

**Résultat** : moins de gaspillage d'énergie et plus de confort.

## 2. Quels sont les avantages d'un thermostat sans fil ?

🌡️ **Confort thermique optimisé** : la bonne température dans chaque pièce.

💶 **Réduction des factures** : jusqu'à 15 % d'économies d'énergie selon les modèles.

🔧 **Installation simple** : pas de câblage, le récepteur se fixe directement à la chaudière.

📱 **Contrôle à distance** (selon le modèle) : via smartphone ou tablette, même hors de chez vous.

## 3. Les principaux types de thermostats sans fil

### 1) Thermostat sans fil non programmable

- Modèle basique, réglage manuel.
- Pas d'écran numérique ni de programmation.
- Convient pour un petit budget ou une utilisation ponctuelle.

### 2) Thermostat sans fil programmable

- Permet de programmer des plages horaires (jour/nuit, semaine/week-end).
- Régulation plus précise → économies plus importantes.
- Affichage numérique pour un suivi facile.

### 3) Thermostat sans fil connecté (intelligent)

- Fonctionne via le wifi et une application mobile.
- S'adapte à vos habitudes de vie (départ/retour du travail, vacances…).
- Possibilité de gérer pièce par pièce.
- Le plus performant et le plus économique sur le long terme, mais aussi le plus cher.

## Conclusion

Le thermostat sans fil est un petit investissement qui rapporte vite : moins de gaspillage, plus de confort, des factures allégées.

👉 Vous hésitez sur le modèle le plus adapté ? Contactez **Mon p'tit Dépanneur** au **03 28 53 48 68** pour bénéficier de conseils personnalisés et d'une installation professionnelle.$mpd$ WHERE id = 'd46ed00c-570d-4bc4-8d71-a168ffe7fd9e';

-- blog_posts 5c3efc2a-cf56-4e0d-9417-5f984646638d (avantages-inconvenients-pompe-chaleur) : 2 → 0 occurrence(s) "fioul"
UPDATE blog_posts SET content = $mpd$Vous cherchez une solution pour chauffer (et même rafraîchir) votre maison ? La pompe à chaleur, souvent appelée PAC, séduit de plus en plus de foyers en France. Économique, écologique et polyvalente, elle n'est pas exempte de défauts.
👉 Dans cet article, Mon p'tit Dépanneur vous explique ce qu'est une pompe à chaleur, ses avantages, ses inconvénients et les différents modèles existants.

## Qu'est-ce qu'une pompe à chaleur (PAC) ?

La pompe à chaleur est un système de chauffage et de climatisation qui puise de l'énergie dans la nature (air, eau ou sol) pour la restituer dans votre logement.

**En hiver :** elle chauffe vos pièces et peut même produire de l'eau chaude sanitaire.

**En été :** elle fonctionne à l'inverse et rafraîchit l'air intérieur.

Le principe est simple : la pompe à chaleur déplace plus d'énergie qu'elle n'en consomme en électricité, ce qui en fait un système particulièrement efficace.

## Les avantages d'une pompe à chaleur

✅ **Confort toute l'année**
Maintient une température agréable et améliore la qualité de l'air grâce à ses filtres intégrés.

✅ **Efficacité énergétique**
Une PAC aérothermique peut produire 4 kWh de chaleur avec seulement 1 kWh d'électricité, le reste étant puisé gratuitement dans l'air extérieur.

✅ **Durable & écologique**
Moins d'émissions de CO₂ qu'une chaudière à gaz.

✅ **Entretien réduit**
Peu de maintenance nécessaire, pas de recharge périodique comme avec une chaudière gaz.

✅ **Polyvalence**
Un seul appareil peut assurer chauffage, climatisation et eau chaude sanitaire.

✅ **Aides financières**
Éligible à des dispositifs comme MaPrimeRénov' si l'installation est réalisée par un artisan certifié RGE.

## Les inconvénients d'une pompe à chaleur

⚠️ **Dépendance à l'électricité**
Votre facture d'électricité augmente, même si la consommation reste raisonnable.

⚠️ **Unité extérieure visible**
Nécessite de l'espace et peut gêner esthétiquement ou au niveau sonore.

⚠️ **Moins efficace par grand froid**
Les PAC aérothermiques perdent en rendement sous -7°C à -10°C.

⚠️ **Chaleur peu durable**
La chaleur diffusée disparaît vite lorsque l'appareil s'arrête.

## Les différents types de pompes à chaleur

**PAC air-air :** chauffe ou rafraîchit directement l'air ambiant (climatisation réversible).

**PAC air-eau :** chauffe l'eau pour alimenter radiateurs, planchers chauffants ou ballon d'eau chaude.

**PAC eau-eau :** puise l'énergie dans une nappe phréatique ou un circuit d'eau.

**PAC géothermique :** capte la chaleur dans le sol via des capteurs enterrés.

**PAC aérothermique :** hybride, elle peut chauffer, rafraîchir et produire de l'eau chaude.

## Conclusion

La pompe à chaleur est une solution moderne, économique et écologique pour chauffer et rafraîchir son logement.
👉 Si vous hésitez encore, l'équipe de Mon p'tit Dépanneur peut vous conseiller et installer le modèle le mieux adapté à votre maison.
📞 Contactez-nous au 03 28 53 48 68 pour une étude gratuite de votre projet.$mpd$ WHERE id = '5c3efc2a-cf56-4e0d-9417-5f984646638d';

-- blog_posts 2ca1a739-cc4b-4b4e-8bd0-229b2f8c9ab7 (pourquoi-entretenir-chaudiere) : 1 → 0 occurrence(s) "fioul"
UPDATE blog_posts SET content = $mpd$Saviez-vous que l'entretien annuel de votre chaudière est obligatoire et qu'il peut vous éviter bien des ennuis ?
Sécurité, économies, longévité… On vous explique en détail pourquoi ce rendez-vous avec votre chauffagiste est indispensable.

## 🔧 À quoi sert la révision d'une chaudière ?

La révision annuelle ne consiste pas seulement à "jeter un œil" :

Elle garantit votre sécurité (détection des fuites de gaz, monoxyde de carbone…).

Elle améliore l'efficacité énergétique de votre appareil.

Elle prolonge sa durée de vie en évitant l'encrassement.

Elle permet d'être couvert par votre assurance en cas d'incident.

## 👨‍🔧 En quoi consiste l'entretien ?

Le technicien chauffagiste effectue plusieurs vérifications et réglages :

Contrôle de l'état général et étanchéité.

Nettoyage du brûleur.

Vérification de la pression et des réglages.

Mesure des émissions de gaz (dont le monoxyde de carbone).

Remplacement des pièces usées si nécessaire.

Contrôle de la ventilation et de l'évacuation des fumées.

À la fin, il vous remet une attestation d'entretien, que vous devez conserver au moins 2 ans.

## 📅 Quelle fréquence ?

Selon le décret n° 2009-649 du 9 juin 2009, l'entretien est obligatoire une fois par an, pour toutes les chaudières gaz, bois ou charbon d'une puissance inférieure à 70 kW.

## 💶 Combien ça coûte ?

Entretien annuel simple : 100 à 200 € en moyenne.

Contrat d'entretien avec dépannage inclus : entre 120 et 250 €, selon les options (dépannage prioritaire, pièces incluses, etc.).

## ⚠️ Que risque-t-on si on ne l'effectue pas ?

Perte d'efficacité (jusqu'à +15 % sur la consommation).

Risques de pannes ou d'accidents (intoxication, incendie).

Non-couverture par l'assurance en cas de sinistre.

Responsabilité engagée vis-à-vis du propriétaire (si vous êtes locataire).

## ✅ Le bon réflexe

Ne négligez pas cet entretien : un petit investissement chaque année, pour beaucoup de tranquillité.
👉 Chez Mon P'tit Dépanneur, nos chauffagistes certifiés RGE réalisent l'entretien et vous délivrent immédiatement l'attestation officielle.$mpd$ WHERE id = '2ca1a739-cc4b-4b4e-8bd0-229b2f8c9ab7';

-- blog_posts 861446cd-42ae-4349-a0d0-95730ac7473e (aides-pompe-a-chaleur) : 1 → 0 occurrence(s) "fioul"
UPDATE blog_posts SET content = $mpd$Objectif : savoir combien vous pouvez obtenir, à quelles conditions, comment monter votre dossier et dans quel ordre pour ne pas perdre 1 € — avec l'accompagnement de Mon p'tit Dépanneur (Lille & MEL).

## 1) Les aides en un coup d'œil (tableau récap)

<table style="width:100%;border-collapse:collapse;font-size:16px"> <thead> <tr> <th style="border:1px solid #e5e7eb;padding:.6rem;background:#f8fafc">Aide</th> <th style="border:1px solid #e5e7eb;padding:.6rem;background:#f8fafc">Pour quoi ?</th> <th style="border:1px solid #e5e7eb;padding:.6rem;background:#f8fafc">Montants repères 2025</th> <th style="border:1px solid #e5e7eb;padding:.6rem;background:#f8fafc">Conditions clés</th> </tr> </thead> <tbody> <tr> <td style="border:1px solid #e5e7eb;padding:.6rem"><b>MaPrimeRénov' (par geste)</b></td> <td style="border:1px solid #e5e7eb;padding:.6rem">Installation PAC <b>air-eau</b> / <b>géothermie</b> (chauffage ± ECS)</td> <td style="border:1px solid #e5e7eb;padding:.6rem">Forfaits selon revenus. Exemples officiels : PAC air-eau <b>≈ 3 000–4 000 €</b>, géothermie <b>jusqu'à ≈ 11 000 €</b> (selon profils/barèmes).</td> <td style="border:1px solid #e5e7eb;padding:.6rem">Dossier <b>avant travaux</b>, <b>artisan RGE</b>, logement éligible.</td> </tr> <tr> <td style="border:1px solid #e5e7eb;padding:.6rem"><b>CEE / Coup de pouce Chauffage</b></td> <td style="border:1px solid #e5e7eb;padding:.6rem">Remplacement chaudière gaz/charbon → PAC</td> <td style="border:1px solid #e5e7eb;padding:.6rem">PAC air-eau <b>≥ 2 500 €</b> (autres ménages) / <b>≥ 4 000 €</b> (modestes). PAC géothermie <b>≥ 5 000 €</b>. Travaux engagés jusqu'au <b>31/12/2025</b>, achevés <b>31/12/2026</b>.</td> <td style="border:1px solid #e5e7eb;padding:.6rem">Offre CEE signée <b>avant</b> devis/travaux ; performances mini (fiches CEE).</td> </tr> <tr> <td style="border:1px solid #e5e7eb;padding:.6rem"><b>TVA à 5,5 %</b></td> <td style="border:1px solid #e5e7eb;padding:.6rem">Matériel + pose PAC air-eau / géothermie (logement ≥ 2 ans)</td> <td style="border:1px solid #e5e7eb;padding:.6rem"><b>5,5 %</b> (opération éligible). <i>Attention : PAC air-air non concernée</i>.</td> <td style="border:1px solid #e5e7eb;padding:.6rem">Attestation TVA, travaux d'amélioration énergétique.</td> </tr> <tr> <td style="border:1px solid #e5e7eb;padding:.6rem"><b>Éco-PTZ</b></td> <td style="border:1px solid #e5e7eb;padding:.6rem">Prêt à taux 0 pour financer le reste à charge</td> <td style="border:1px solid #e5e7eb;padding:.6rem">Jusqu'à <b>50 000 €</b> (durée jusqu'à ~20 ans). Cumulable avec MPR & CEE.</td> <td style="border:1px solid #e5e7eb;padding:.6rem">Logement principal ≥ 2 ans ; devis par **RGE** ; banquier partenaire.</td> </tr> </tbody> </table>

## 2) Quelles PAC sont éligibles ?

**Éligibles** : PAC air-eau, PAC géothermie (eau-eau / sol-eau), y compris solutions hybrides éligibles selon cas.

**Souvent exclue** des aides majeures (MPR, TVA 5,5 %) : PAC air-air / clim réversible.

✎ **Conseil Mon p'tit Dépanneur** : à Lille, on vérifie acoustique (silentblocs, écran ventilé) et évacuation des condensats en cœur d'îlot dès la visite.

## 3) Montants : à quoi s'attendre (ordre de grandeur)

**PAC air-eau** : MPR ≈ 3 000–4 000 € (selon revenus) + CEE ≈ 2 500–4 000 € (profil & offre).

**PAC géothermie** : MPR jusqu'à ≈ 11 000 € + CEE ≈ 5 000 €.

**TVA 5,5 %** : appliquée d'office sur devis PAC éligible (matériel + pose).

**Éco-PTZ** : complète le reste à charge jusqu'à 50 000 €.

## 4) Conditions à ne pas rater

**Dossiers AVANT travaux** (MPR et CEE). Pas de devis signé ni chantier lancé avant accusés de réception / offres.

**Entreprise RGE** (et RGE valide à la signature).

**PAC conforme** (performances des fiches CEE), logement éligible, attestation TVA remplie.

## 5) Parcours en 7 étapes (on s'occupe de tout)

1. **Visite technique à domicile** (Lille & MEL) : choix PAC (air-eau vs géo), implantation silencieuse, condensats, élec.

2. **Devis comparatif** (1–2 variantes) + vérification barèmes MPR/CEE.

3. **Dépôt des dossiers** : MPR (compte, pièces, AR), CEE (inscription, offre), éco-PTZ si besoin.

4. **Copro si appart** : dossier pour vote (fiche technique, dB(A) jour/nuit, photomontage, schéma condensats).

5. **Pose** : silentblocs, châssis, loi d'eau, mode nuit, tirage au vide & contrôles.

6. **Mise en service & conformité** : PV, photos, étiquettes, attestation CEE.

7. **Paiement des aides** : MPR + CEE ; remise du dossier client (rapports, garanties).

## 6) Erreurs qui font perdre des €€€

- **Signer / démarrer avant** accusé MPR ou offre CEE → dossier refusé.
- **Pro non RGE** (ou RGE expiré) → aides perdues.
- **PAC hors critères** (fiche CEE) → prime CEE refusée.
- **Confondre PAC air-air** (clim) avec PAC air-eau pour les aides → erreurs de budget.

## 7) Exemple de reste à charge (cas simple)

Maison 1930 à Lille, PAC air-eau (chauffage seul), devis 12 500 € TTC.

- **MaPrimeRénov'** (revenus modestes) : ≈ 3 000–4 000 €.
- **CEE / Coup de pouce** : ≈ 2 500–4 000 € (profil & offre).
- **TVA 5,5 %** : déjà comprise.
- **Reste à charge estimatif** : ≈ 4 500–7 000 €, finançable via éco-PTZ (jusqu'à 50 000 €).

*(Les montants exacts sont fixés au dossier selon vos revenus, le modèle de PAC et l'offre CEE retenue.)*

## 8) Spécial copro (Vieux-Lille, Vauban, etc.)

**Autorisation en AG** si percement/façade/UE visible : dossier clair (fiches, niveaux sonores, photomontage, condensats) = votes apaisés.

**Aides** : mêmes dispositifs côté occupants/bailleurs (règles spécifiques MPR bailleurs).

## Questions fréquentes

<div class="faq-accordion space-y-4 mt-6">
  <div class="faq-item border border-muted rounded-lg">
    <button class="faq-question w-full text-left p-4 font-medium hover:bg-muted/50 transition-colors flex justify-between items-center" data-question="Les rénovations d'ampleur MPR ont été suspendues — et pour la PAC par geste ?">
      <span>Les "rénovations d'ampleur" MPR ont été suspendues — et pour la PAC par geste ?</span>
      <svg class="faq-icon w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    <div class="faq-answer hidden p-4 pt-0 text-muted-foreground">
      <p>La suspension a visé le parcours d'ampleur (guichet rouvert fin septembre 2025). Les monogestes (dont PAC par geste) restent ouverts avec barèmes dédiés.</p>
    </div>
  </div>

  <div class="faq-item border border-muted rounded-lg">
    <button class="faq-question w-full text-left p-4 font-medium hover:bg-muted/50 transition-colors flex justify-between items-center" data-question="Puis-je cumuler MPR + CEE + éco-PTZ ?">
      <span>Puis-je cumuler MPR + CEE + éco-PTZ ?</span>
      <svg class="faq-icon w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    <div class="faq-answer hidden p-4 pt-0 text-muted-foreground">
      <p>Oui : cumul possible (selon conditions). L'éco-PTZ peut financer le reste à charge jusqu'à 50 000 €.</p>
    </div>
  </div>

  <div class="faq-item border border-muted rounded-lg">
    <button class="faq-question w-full text-left p-4 font-medium hover:bg-muted/50 transition-colors flex justify-between items-center" data-question="La TVA 5,5 % s'applique aussi aux PAC air-air ?">
      <span>La TVA 5,5 % s'applique aussi aux PAC air-air ?</span>
      <svg class="faq-icon w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    <div class="faq-answer hidden p-4 pt-0 text-muted-foreground">
      <p>Non. Air-eau / géothermie : oui. Air-air : non (TVA 20 %).</p>
    </div>
  </div>

  <div class="faq-item border border-muted rounded-lg">
    <button class="faq-question w-full text-left p-4 font-medium hover:bg-muted/50 transition-colors flex justify-between items-center" data-question="Jusqu'à quand le Coup de pouce Chauffage ?">
      <span>Jusqu'à quand le "Coup de pouce Chauffage" ?</span>
      <svg class="faq-icon w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    <div class="faq-answer hidden p-4 pt-0 text-muted-foreground">
      <p>Opérations engagées jusqu'au 31/12/2025, achevées au plus tard le 31/12/2026 (minima : 2 500–4 000 € air-eau ; 5 000 € géothermie selon profil).</p>
    </div>
  </div>

  <div class="faq-item border border-muted rounded-lg">
    <button class="faq-question w-full text-left p-4 font-medium hover:bg-muted/50 transition-colors flex justify-between items-center" data-question="Comment éviter les mauvaises surprises ?">
      <span>Comment éviter les mauvaises surprises ?</span>
      <svg class="faq-icon w-5 h-5 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    <div class="faq-answer hidden p-4 pt-0 text-muted-foreground">
      <p>Vérifiez RGE avant signature, déposez vos dossiers avant travaux, exigez un dimensionnement et une implantation acoustique soignée (cœur d'îlot lillois).</p>
    </div>
  </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  const faqItems = document.querySelectorAll(".faq-item");
  
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");
    
    question.addEventListener("click", () => {
      const isOpen = !answer.classList.contains("hidden");
      
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.querySelector(".faq-answer").classList.add("hidden");
          otherItem.querySelector(".faq-icon").classList.remove("rotate-180");
        }
      });
      
      // Toggle current item
      if (isOpen) {
        answer.classList.add("hidden");
        icon.classList.remove("rotate-180");
      } else {
        answer.classList.remove("hidden");
        icon.classList.add("rotate-180");
      }
    });
  });
});
</script>

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"WebPage",
      "@id":"https://www.monptitdepanneur.fr/carnet/aides-pompe-a-chaleur",
      "url":"https://www.monptitdepanneur.fr/carnet/aides-pompe-a-chaleur",
      "name":"Aides de l'État pour une pompe à chaleur (2025) à Lille",
      "description":"MaPrimeRénov' par geste, CEE/Coup de pouce Chauffage, TVA 5,5 %, éco-PTZ jusqu'à 50 000 € : montants, conditions et étapes pour installer une PAC à Lille.",
      "inLanguage":"fr-FR",
      "isPartOf":{"@type":"WebSite","name":"Mon p'tit Dépanneur","url":"https://www.monptitdepanneur.fr"},
      "primaryImageOfPage":{"@type":"ImageObject","url":"https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev/pompe-chaleur-aides.webp"}
    },
    {
      "@type":"BreadcrumbList",
      "@id":"https://www.monptitdepanneur.fr/carnet/aides-pompe-a-chaleur#bread",
      "itemListElement":[
        {"@type":"ListItem","position":1,"name":"Accueil","item":"https://www.monptitdepanneur.fr/"},
        {"@type":"ListItem","position":2,"name":"Carnet","item":"https://www.monptitdepanneur.fr/carnet/"},
        {"@type":"ListItem","position":3,"name":"Aides pompe à chaleur 2025 à Lille"}
      ]
    },
    {
      "@type":"Article",
      "@id":"https://www.monptitdepanneur.fr/carnet/aides-pompe-a-chaleur#article",
      "headline":"Aides pompe à chaleur 2025 : MaPrimeRénov', CEE, TVA 5,5 %, éco-PTZ (Lille)",
      "description":"Dossier complet et à jour sur les aides PAC 2025 à Lille : montants MPR/CEE, TVA 5,5 %, éco-PTZ, étapes de dossier, erreurs à éviter et exemple de reste à charge.",
      "articleSection":["Chauffage","Pompe à chaleur","Aides financières"],
      "inLanguage":"fr-FR",
      "author":{"@type":"Organization","name":"Mon p'tit Dépanneur"},
      "publisher":{"@type":"Organization","name":"Mon p'tit Dépanneur","logo":{"@type":"ImageObject","url":"https://www.monptitdepanneur.fr/static/logo.png"}},
      "image":"https://pub-ee5d8554679a4a23a82caac56686992a.r2.dev/pompe-chaleur-aides.webp",
      "datePublished":"2025-09-29",
      "dateModified":"2025-09-29",
      "mainEntityOfPage":{"@id":"https://www.monptitdepanneur.fr/carnet/aides-pompe-a-chaleur"}
    },
    {
      "@type":"FAQPage",
      "@id":"https://www.monptitdepanneur.fr/carnet/aides-pompe-a-chaleur#faq",
      "mainEntity":[
        {"@type":"Question","name":"Puis-je cumuler MaPrimeRénov', CEE et éco-PTZ ?","acceptedAnswer":{"@type":"Answer","text":"Oui. L'éco-PTZ peut financer jusqu'à 50 000 € de reste à charge. Les CEE sont cumulables avec MaPrimeRénov' sous conditions (dossiers avant travaux et entreprise RGE)."}},
        {"@type":"Question","name":"La PAC air-air est-elle éligible ?","acceptedAnswer":{"@type":"Answer","text":"La PAC air-air est généralement exclue des aides MaPrimeRénov' par geste et de la TVA à 5,5 %. Les PAC air-eau et géothermiques sont éligibles (sous conditions)."}},
        {"@type":"Question","name":"Quelles dates pour le Coup de pouce Chauffage ?","acceptedAnswer":{"@type":"Answer","text":"Opérations engagées jusqu'au 31/12/2025, achevées au plus tard le 31/12/2026. Les montants minimums dépendent de la technologie (par ex. 2 500–4 000 € pour air-eau, 5 000 € pour géothermie selon profil)."}},
        {"@type":"Question","name":"Quelles sont les erreurs à éviter ?","acceptedAnswer":{"@type":"Answer","text":"Signer le devis ou démarrer les travaux avant l'accusé MPR/CEE ; choisir un pro sans RGE ; sélectionner une PAC non conforme aux fiches CEE ; confondre PAC air-air et air-eau pour les aides."}}
      ]
    }
  ]
}
</script>$mpd$ WHERE id = '861446cd-42ae-4349-a0d0-95730ac7473e';

-- service_city_pages 8da4fa87-2478-4391-b9b0-fdbfab77e5c7 : 1 → 0
UPDATE service_city_pages SET intro_description = $mpd$Mon p'tit Dépanneur intervient à Vieux-Lille pour tous vos besoins en chauffage : installation de chaudières (gaz, électrique), entretien annuel obligatoire, dépannage d'urgence et remplacement. Nos chauffagistes qualifiés assurent un service rapide et professionnel avec garantie sur tous les travaux.$mpd$ WHERE id = '8da4fa87-2478-4391-b9b0-fdbfab77e5c7';

-- service_city_pages 21d61908-0f2c-44ff-bb2b-f4250c1eaf58 : 1 → 0
UPDATE service_city_pages SET intro_description = $mpd$Mon p'tit Dépanneur intervient à Villeneuve-d'Ascq pour tous vos besoins en chauffage : installation de chaudières (gaz, électrique), entretien annuel obligatoire, dépannage d'urgence et remplacement. Nos chauffagistes qualifiés assurent un service rapide et professionnel avec garantie sur tous les travaux.$mpd$ WHERE id = '21d61908-0f2c-44ff-bb2b-f4250c1eaf58';

-- service_city_pages 6740870f-3d81-431c-a63f-c0b9ea0ee286 : 1 → 0
UPDATE service_city_pages SET intro_description = $mpd$Mon p'tit Dépanneur intervient à Marcq-en-Barœul pour tous vos besoins en chauffage : installation de chaudières (gaz, électrique), entretien annuel obligatoire, dépannage d'urgence et remplacement. Nos chauffagistes qualifiés assurent un service rapide et professionnel avec garantie sur tous les travaux.$mpd$ WHERE id = '6740870f-3d81-431c-a63f-c0b9ea0ee286';

-- service_city_pages 86c5357d-b4f5-449e-a355-f162f8f2d76b : 1 → 0
UPDATE service_city_pages SET intro_description = $mpd$Mon p'tit Dépanneur intervient à Bondues pour tous vos besoins en chauffage : installation de chaudières (gaz, électrique), entretien annuel obligatoire, dépannage d'urgence et remplacement. Nos chauffagistes qualifiés assurent un service rapide et professionnel avec garantie sur tous les travaux.$mpd$ WHERE id = '86c5357d-b4f5-449e-a355-f162f8f2d76b';

-- service_city_pages 33181f84-9652-4cda-ab34-f2e8fdc768da : 1 → 0
UPDATE service_city_pages SET intro_description = $mpd$Mon p'tit Dépanneur intervient à La Madeleine pour tous vos besoins en chauffage : installation de chaudières (gaz, électrique), entretien annuel obligatoire, dépannage d'urgence et remplacement. Nos chauffagistes qualifiés assurent un service rapide et professionnel avec garantie sur tous les travaux.$mpd$ WHERE id = '33181f84-9652-4cda-ab34-f2e8fdc768da';

-- service_city_pages 9bee38e8-eb2f-486a-8323-f69c55bf4eea : 1 → 0
UPDATE service_city_pages SET intro_description = $mpd$Mon p'tit Dépanneur intervient à Lambersart pour tous vos besoins en chauffage : installation de chaudières (gaz, électrique), entretien annuel obligatoire, dépannage d'urgence et remplacement. Nos chauffagistes qualifiés assurent un service rapide et professionnel avec garantie sur tous les travaux.$mpd$ WHERE id = '9bee38e8-eb2f-486a-8323-f69c55bf4eea';

-- service_city_pages d364e998-603a-4c48-84f0-bfcd0143b360 : 1 → 0
UPDATE service_city_pages SET intro_description = $mpd$Mon p'tit Dépanneur intervient à Saint-André-lez-Lille pour tous vos besoins en chauffage : installation de chaudières (gaz, électrique), entretien annuel obligatoire, dépannage d'urgence et remplacement. Nos chauffagistes qualifiés assurent un service rapide et professionnel avec garantie sur tous les travaux.$mpd$ WHERE id = 'd364e998-603a-4c48-84f0-bfcd0143b360';

-- service_city_pages 6cf7bbdf-14b3-4944-92c2-51e8f460c600 : 1 → 0
UPDATE service_city_pages SET intro_description = $mpd$Mon p'tit Dépanneur intervient à Lomme pour tous vos besoins en chauffage : installation de chaudières (gaz, électrique), entretien annuel obligatoire, dépannage d'urgence et remplacement. Nos chauffagistes qualifiés assurent un service rapide et professionnel avec garantie sur tous les travaux.$mpd$ WHERE id = '6cf7bbdf-14b3-4944-92c2-51e8f460c600';

-- service_city_pages 423973f1-c274-4893-896b-c6bab1edcdad : 2 → 0
UPDATE service_city_pages SET intro_description = $mpd$Chaudière en panne un soir d'hiver, entretien annuel à planifier, on s'occupe de tout à Lille. Mon p'tit Dépanneur intervient sur tous les types de chaudières : gaz, condensation, micro-cogénération. Et depuis quelques années, on installe aussi des pompes à chaleur air-eau pour les clients qui veulent passer aux énergies renouvelables.

RGE Qualibat et Professionnel du Gaz : deux certifications qui comptent. RGE parce que ça vous ouvre droit aux aides de l'État (MaPrimeRénov', CEE). Professionnel du Gaz parce que les installations gaz ne se font pas n'importe comment.

On intervient dans tous les quartiers de Lille — Vieux-Lille, Wazemmes, Fives, Bois-Blancs, Vauban — et on peut être là en urgence le jour même dans la plupart des cas.$mpd$ WHERE id = '423973f1-c274-4893-896b-c6bab1edcdad';

COMMIT;

-- Vérifications post-update
-- SELECT id, slug FROM blog_posts WHERE content ILIKE '%fioul%' OR excerpt ILIKE '%fioul%' OR title ILIKE '%fioul%';
-- SELECT id FROM service_city_pages WHERE intro_description ILIKE '%fioul%';