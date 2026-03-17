# Audit de contenu et mapping de migration

## 1) Contenu actuel des pages demandées

### `index.html`
- **Titres principaux** :
  - `<title>`: "François d’Assise Sanou | Academic Profile"
  - Sections H2: About, Experience, Projects, Publications, Contact
- **Image profil** :
  - `images/identite_sanou.jpg` (portrait principal)
- **Paragraphes clés** :
  - Résumé de recherche (3 paragraphes) sur LoRa/LoRaWAN, LoRaFlexSim, et objectifs mesurables.
  - Introduction Experience : parcours recherche + enseignement.
  - Introduction Projects : orientation simulation LPWAN + référence profil GitHub.
  - Introduction Contact : invitation à contacter via LinkedIn + suivi sur GitHub.
- **Liens externes principaux** :
  - LinkedIn : `https://www.linkedin.com/in/francois-d-assise-sanou-a57066200/`
  - GitHub : `https://github.com/sanoufrancois226-crypto`
  - LoRaFlexSim : `https://loraflexsim.org`
  - IEEE (publications):
    - `https://ieeexplore.ieee.org/abstract/document/10812147`
    - `https://ieeexplore.ieee.org/abstract/document/11304034`
    - `https://ieeexplore.ieee.org/abstract/document/11323245`
    - `https://ieeexplore.ieee.org/abstract/document/11418870`
    - et liens PDF/Cite associés.
- **CTA / actions** :
  - Menu de navigation ancré (About, Experience, Projects, Publications, Contact)
  - Boutons/liens profil LinkedIn et GitHub
  - Liens « Project page », « Read paper », « PDF », « Cite », « DOI »
  - Carte contact avec CTA LinkedIn explicite

### `experience.html`
- **Fonction actuelle** : page de redirection immédiate vers `index.html#experience`.
- **Titre** : "Redirecting to main page"
- **Paragraphe visible** : "Redirecting to Experience on the main page…"
- **Lien/CTA** : lien direct vers `index.html#experience`

### `projects.html`
- **Fonction actuelle** : page de redirection immédiate vers `index.html#projects`.
- **Titre** : "Redirecting to main page"
- **Paragraphe visible** : "Redirecting to Projects on the main page…"
- **Lien/CTA** : lien direct vers `index.html#projects`

### `publications.html`
- **Fonction actuelle** : page de redirection immédiate vers `index.html#publications`.
- **Titre** : "Redirecting to main page"
- **Paragraphe visible** : "Redirecting to Publications on the main page…"
- **Lien/CTA** : lien direct vers `index.html#publications`

### `contact.html`
- **Fonction actuelle** : page de redirection immédiate vers `index.html#contact`.
- **Titre** : "Redirecting to main page"
- **Paragraphe visible** : "Redirecting to Contact on the main page…"
- **Lien/CTA** : lien direct vers `index.html#contact`

---

## 2) Décision de cible finale

**Décision recommandée : conserver une architecture _single-page_** (déjà en place) avec les pages legacy en redirection.

Raison :
- La structure actuelle est déjà alignée avec un rendu type portfolio académique moderne (navigation ancrée).
- Les URLs historiques (`experience.html`, `projects.html`, `publications.html`, `contact.html`) sont préservées via redirections, donc pas de rupture de liens.
- Harmonisation visuelle naturelle puisque tout le contenu de fond est centralisé dans `index.html`.

---

## 3) Mapping “contenu actuel -> emplacement final”

| Source actuelle | Contenu | Emplacement final recommandé |
|---|---|---|
| `index.html` section `#about` | Profil, image, résumé recherche, intérêts, formation | `index.html#about` |
| `index.html` section `#experience` | Timeline PhD / RA / TA | `index.html#experience` |
| `index.html` section `#projects` | Liste projets + liens projet/papers | `index.html#projects` |
| `index.html` section `#publications` | Liste publications IEEE + PDF/Cite/DOI | `index.html#publications` |
| `index.html` section `#contact` | CTA LinkedIn + lien GitHub | `index.html#contact` |
| `experience.html` | Redirection legacy Experience | garder redirection vers `index.html#experience` |
| `projects.html` | Redirection legacy Projects | garder redirection vers `index.html#projects` |
| `publications.html` | Redirection legacy Publications | garder redirection vers `index.html#publications` |
| `contact.html` | Redirection legacy Contact | garder redirection vers `index.html#contact` |

Objectif anti-perte : **aucune suppression de bloc**, uniquement consolidation/évolution au sein des ancres existantes.

---

## 4) Vérification des URLs externes à conserver

URLs demandées détectées et marquées à conserver :
- LinkedIn : `https://www.linkedin.com/in/francois-d-assise-sanou-a57066200/`
- GitHub : `https://github.com/sanoufrancois226-crypto`
- IEEE (plusieurs documents : 10812147, 11304034, 11323245, 11418870)
- Site LoRaFlexSim : `https://loraflexsim.org`

Aucune modification appliquée à ces URLs dans cet audit.
