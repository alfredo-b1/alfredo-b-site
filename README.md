# Site Alfredo B

Site statique (HTML / CSS / JS, sans framework ni étape de build) — prêt à héberger sur n'importe quel hébergement web avec votre nom de domaine.

## Structure du projet

```
index.html            Accueil
about.html             À propos
blog.html               Liste des articles (recherche + filtres par catégorie)
article.html            Gabarit d'article (contenu chargé via ?id=...)
videos.html             Liste des vidéos
music.html               Lecteur audio / discographie
gallery.html            Galerie photo
contact.html             Formulaire de contact
privacy.html              Politique de confidentialité (modèle à faire valider par un juriste)
terms.html                 Conditions d'utilisation (modèle à faire valider par un juriste)
sitemap.xml, robots.txt   SEO technique
assets/css/style.css       Tout le design du site
assets/js/main.js           Thème clair/sombre, navigation, animations, chargement du contenu
assets/data/*.json           Vos contenus : articles, vidéos, morceaux, photos
assets/images/                 Vos images (logo, photo de profil, bannière, galerie, favicon)
```

## Ajouter du contenu (sans toucher au code)

- **Un article de blog** → ouvrez `assets/data/posts.json` et ajoutez un objet sur le modèle des existants (id unique, titre, catégorie, date, extrait, contenu HTML).
- **Une vidéo** → `assets/data/videos.json`.
- **Un morceau de musique** → `assets/data/tracks.json`. Renseignez `"src"` avec le chemin vers votre fichier `.mp3` (par ex. `assets/audio/titre.mp3`) pour activer le lecteur.
- **Une photo de galerie** → `assets/data/gallery.json`, champ `"src"` pointant vers votre image.

Aucune de ces modifications ne nécessite de toucher au HTML, au CSS ou au JS.

## Emplacements réservés à vos visuels

À déposer dans `assets/images/` puis à relier au code (des commentaires `<!-- ... -->` indiquent précisément où, dans `index.html` et `about.html`) :

- `logo.svg` — remplace le monogramme dessiné en CSS dans l'en-tête
- `profile.jpg` — photo de profil (page "À propos")
- `banner.jpg` / `og-cover.jpg` — bannière et image de partage sur les réseaux
- `favicon.png` — icône d'onglet

## Liens vers vos réseaux et plateformes

Les liens `href="#"` du menu, du pied de page et des pages Vidéos/Musique/Contact sont à remplacer par vos véritables URL (YouTube, Spotify, Apple Music, Audiomack, TikTok, Instagram, Facebook, X).

## SEO déjà en place

- Balises `title` et `meta description` uniques par page, balises Open Graph et Twitter Card, URL canonique.
- Données structurées `Person` (JSON-LD) dans `index.html` — à compléter avec vos vraies URL de profils.
- `sitemap.xml` et `robots.txt` à la racine (pensez à soumettre le sitemap dans Google Search Console une fois le domaine en ligne).
- HTML sémantique, un seul `<h1>` par page, temps de chargement rapide (pas de framework, polices et icônes optimisées).

## Google Analytics

Le code d'intégration (`gtag.js`) est déjà préparé, en commentaire, en haut de `index.html`. Il suffit de :
1. Créer une propriété GA4 et récupérer votre identifiant `G-XXXXXXX`.
2. Décommenter le bloc et remplacer `G-XXXXXXX` par votre identifiant.
3. Reproduire ce même bloc dans les autres pages si vous voulez suivre l'ensemble du site (ou le déplacer dans un fichier inclus partout, une fois que vous ajoutez un système de gabarits).

## Ce qui fonctionne déjà en front-end, et ce qui nécessite un service externe

Ce site est **statique** : il n'a pas de base de données ni de serveur applicatif. Certaines fonctionnalités demandées sont donc opérationnelles telles quelles, d'autres nécessitent de brancher un service (souvent gratuit pour démarrer) :

| Fonctionnalité | État actuel | Pour l'activer réellement |
|---|---|---|
| Blog, vidéos, musique, galerie | ✅ fonctionnel via les fichiers JSON | — |
| Mode clair/sombre | ✅ fonctionnel | — |
| Recherche et filtres du blog | ✅ fonctionnel | — |
| Formulaire de contact | Design + validation prêts, l'envoi est simulé | Brancher [Formspree](https://formspree.io), [Netlify Forms](https://www.netlify.com/platform/core/forms/) ou un back-end mail (SendGrid, Resend…) |
| Newsletter | Design + validation prêts, inscription simulée | Brancher [Mailchimp](https://mailchimp.com), [Brevo](https://www.brevo.com) ou équivalent |
| Commentaires | Démo locale (les commentaires ne sont pas sauvegardés) | Brancher [Giscus](https://giscus.app) (gratuit, basé sur GitHub) ou [Disqus](https://disqus.com) |
| Tableau d'administration | Non inclus (un site 100% statique n'en a pas besoin) | Éditer les fichiers `.json` suffit pour un usage simple. Pour une interface graphique, un CMS "headless" comme [Decap CMS](https://decapcms.org) (gratuit) peut être ajouté sans réécrire le site |
| Monétisation (pub, affiliation, produits numériques) | Emplacements et structure prêts (liens streaming, pages produits futures) | À activer plus tard selon vos partenaires (Google AdSense, liens affiliés, Gumroad/Stripe pour la vente de produits numériques) |

## Déploiement

Ce site n'a besoin d'aucune compilation. Pour le mettre en ligne :

1. **Hébergement simple et gratuit** : [Netlify](https://netlify.com), [Vercel](https://vercel.com) ou [GitHub Pages](https://pages.github.com) — glissez-déposez le dossier ou connectez un dépôt Git.
2. **Hébergement mutualisé classique** : uploadez l'ensemble du dossier via FTP à la racine de votre nom de domaine.
3. Le HTTPS est fourni automatiquement par la plupart des hébergeurs modernes (Netlify, Vercel) ou activable en un clic (Let's Encrypt) chez un hébergeur mutualisé.

⚠️ **Important** : le site charge son contenu (`posts.json`, `videos.json`…) via `fetch()`. Cela fonctionne uniquement lorsque le site est servi par un serveur web (local ou en ligne) — pas en ouvrant simplement les fichiers `.html` en double-clic depuis votre ordinateur. Pour tester en local, lancez par exemple `python3 -m http.server` depuis le dossier du site, puis ouvrez `http://localhost:8000`.
