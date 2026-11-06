# Dar Lella — Djerba

Site de location directe d'un houch privé avec piscine sans vis-à-vis à Chebabya, Djerba.
Direction artistique éditoriale, responsive, sans framework et sans dépendance serveur.

**URL de production :** <https://dar-lella-djerba.vercel.app>
**Dépôt GitHub :** <https://github.com/Soussou69/dar-lella-djerba>

## Lancer le site en local

```powershell
python -m http.server 8080
```

Puis ouvrir <http://localhost:8080>.

## Structure

```text
index.html                 Page principale
mentions-legales.html      Mentions légales, confidentialité et conditions
assets/css/style.css       Styles du site
assets/js/config.js        Coordonnées à personnaliser
assets/js/main.js          Menu, dates, formulaire, galerie, animations
assets/img/                Photographies
vercel.json                Configuration de déploiement
```

## À personnaliser avant une vraie mise en ligne

1. **Coordonnées** — `assets/js/config.js` : email, WhatsApp (format international sans `+`), Instagram.
   Le formulaire ouvre WhatsApp si un numéro est renseigné, sinon le logiciel de messagerie du visiteur.
2. **Nom et textes** — remplacer « Dar Lella » et adapter les descriptions si nécessaire.
3. **Chiffres et équipements** — 4 suites, 8 hôtes, bassin de 12 m, terrain de 1 800 m², équipements et services.
4. **Tarifs et conditions** — section `#tarifs`, FAQ et `mentions-legales.html` (acompte, annulation, caution, taxe de séjour).
5. **Adresse** — la page indique Chebabya (près d'Aghir et de Midoun). Ajuster les distances et l'adresse exacte.
6. **Photographies** — les visuels actuels sont des **photos d'ambiance Pexels**, pas les photos du houch. Les remplacer par les photos réelles avant toute promotion. La mention figure déjà dans les mentions légales.
7. **Mentions légales** — compléter l'identité de l'éditeur, l'adresse postale et les informations fiscales.
8. **Domaine** — mettre à jour `canonical`, Open Graph, `robots.txt`, `sitemap.xml` et le JSON-LD si un domaine personnalisé est utilisé.

## Déploiement Vercel

```powershell
npx vercel --prod
```

Le site est statique : aucune commande de build n'est nécessaire.

## Crédits photo

Photos d'ambiance issues de [Pexels](https://www.pexels.com/) (licence Pexels, utilisation gratuite) :

- 5029310 — patio, bassin et orangers
- 9730025 — piscine et façades blanches
- 38227576 — arcades et palmier
- 37086668 — chambre de Houmt Souk
- 32624967 — chambre au linge de lin
- 30345533 — salon minimaliste
- 38559877 — porte bleue
- 27945047 — patio et bassin
- 27674087 — cour d'Erriadh, Djerba
- 27637112 — cour tunisienne

## Technique

- HTML/CSS/JavaScript statiques.
- Google Fonts : Cormorant Garamond + Manrope.
- Galerie avec lightbox clavier, menu mobile, animations au scroll, formulaire sans backend.
- Héros cinématique : diaporama de photos avec travelling lent, titre révélé ligne par ligne, grain argentique, parallaxe au scroll et curseur personnalisé sur desktop.
- Respect de `prefers-reduced-motion` (animations désactivées) et allègement sur mobile.
- Aucun cookie, aucun outil de tracking.
