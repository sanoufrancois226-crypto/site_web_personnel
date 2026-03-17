# Site personnel (statique, architecture single-page)

Ce dépôt contient un **site académique statique en page unique**.

## Stack technique

- **HTML** pour la structure.
- **CSS** pour la mise en forme et le responsive.
- **JavaScript vanilla** pour :
  - le surlignage du lien de navigation actif,
  - le comportement du menu mobile,
  - la synchronisation avec les ancres (`hash`).

Aucun backend n'est nécessaire.

## Fichiers modifiés et rôle de chaque fichier

- `index.html` : contenu principal du site (sections About, Experience, Projects, Publications, Contact).
- `style.css` : design system (variables CSS), layout responsive, composants.
- `script.js` : interactions (menu mobile + lien actif selon la section visible).
- `experience.html`, `projects.html`, `publications.html`, `contact.html` : redirections legacy vers `index.html#...`.
- `images/identite_sanou.jpg` : photo de profil affichée dans la section About.

## Structure des sections (dans `index.html`)

Le site repose sur **une seule page de contenu : `index.html`**.

- `#about`
- `#experience`
- `#projects`
- `#publications`
- `#contact`

La navigation principale utilise uniquement des ancres internes (`href="#..."`).

## Statut de simplification (pages legacy)

Le site est volontairement maintenu en **single-page** via `index.html`.

- Les sections fonctionnelles sont intégrées à la même page : About, Experience, Projects, Publications, Contact.
- Les anciennes pages (`experience.html`, `projects.html`, `publications.html`, `contact.html`) sont conservées uniquement comme **redirections** instantanées vers les ancres `index.html#...` pour préserver les anciens liens.

## Comment éditer rapidement le contenu

### 1) Publications

Dans `index.html`, section `#publications`, chaque publication est un bloc `<li class="pub-item">`.

Pour en ajouter/éditer une :
- mettre à jour les auteurs (`.pub-authors`),
- le titre et l’URL (`.pub-title-link`),
- la venue (`.pub-venue`),
- le DOI (`.pub-doi`),
- les boutons (`Paper`, `DOI`, `Cite`, `Code/Website`) dans `.pub-links`.

### 2) Liens (navigation, externes, CTA)

Dans `index.html` :
- navigation principale : `<nav id="primary-navigation">` (liens `#about`, `#experience`, etc.),
- liens sociaux du hero : bloc `.about-hero__links`,
- liens sociaux de contact : section `#contact`, classe `.contact-link`,
- liens projets/publications : boutons `.project-cta` et `.c-secondary-link`.

### 3) Texte (bio, expérience, projets, contact)

Tout le texte est éditable directement dans `index.html` :
- bio et résumé de recherche : section `#about`,
- parcours : section `#experience`,
- projets : section `#projects`,
- message de contact : section `#contact`.

## Où modifier rapidement le style

### Couleurs (variables CSS)

Dans `style.css`, bloc `:root` :
- `--bg`, `--surface`, `--surface-2`
- `--text`, `--muted`, `--accent`

### Tailles de police

Dans `style.css` :
- taille globale : `body { font: ... }`
- titres : règles `h1`, `h2`, `h3`
- textes spécifiques : ex. `.about-hero__eyebrow`, `.c-header__name`, etc.

### Espacements

Dans `style.css`, variables d’échelle :
- `--space-1` à `--space-5`
- `--gutter` (marges latérales globales)

Ces variables pilotent la majorité des `gap`, `padding`, `margin`.

### Photo de profil

- Fichier image : `images/identite_sanou.jpg`
- Référence HTML : `<img class="about-hero__image" src="images/identite_sanou.jpg" ...>` dans `index.html`.

## Favicon (maintenance)

- **Source unique** : `assets/favicon.png`.
- **Fichiers HTML à maintenir** : `index.html`, `contact.html`, `experience.html`, `projects.html`, `publications.html`.
- **Versioning recommandé** : ajouter/mettre à jour `?v=...` sur les URLs du favicon (ex. `assets/favicon.png?v=20260317`) à chaque changement d’image.
- **Vérification rapide navigateur** : ouvrir `index.html` puis les 4 pages legacy, confirmer l’icône dans l’onglet, puis refaire un test après mise à jour de la version `?v=...`.
- **Rappel Windows 11** : pendant les tests, faire un hard refresh (`Ctrl+F5`) et vider le cache navigateur si l’ancienne icône persiste.

### Validation automatique des conventions `<head>`

Un script Python dédié permet de sécuriser les futures modifications sur toutes les pages `*.html` à la racine.

Fichier : `scripts/validate_head_conventions.py`

Vérifications effectuées (échec si un seul point manque sur une page) :
- présence de `rel="icon"` pointant vers `assets/favicon.png` (avec ou sans query string),
- présence de `rel="shortcut icon"`,
- présence de `rel="apple-touch-icon"`,
- présence de `meta name="theme-color"`,
- présence de `rel="manifest"`.

Exécution locale :

```bash
python3 scripts/validate_head_conventions.py
```

Le script retourne un code de sortie `1` si une convention n’est pas respectée, ce qui le rend exploitable en CI.

### Liens sociaux

Dans `index.html` :
- hero About : bloc `.about-hero__links`
- section Contact : liens `.contact-link`

## Gestion des anciennes URLs

Les anciennes pages (`experience.html`, `projects.html`, `publications.html`, `contact.html`) sont conservées comme **pages de redirection** vers `index.html#...` afin de préserver les liens entrants existants.

## Vérification des URLs après refonte

### Vérification locale (liens internes + fichiers)

Commande de vérification locale :

```bash
python3 - <<'PY'
import re
from pathlib import Path

root = Path('.')
html_files = sorted(root.glob('*.html'))
errors = []
index_ids = set(re.findall(r'id="([^"]+)"', Path('index.html').read_text(encoding='utf-8')))

for html in html_files:
    text = html.read_text(encoding='utf-8')
    ids = set(re.findall(r'id="([^"]+)"', text))
    refs = re.findall(r'(?:href|src)="([^"]+)"', text)

    for ref in refs:
        if ref.startswith(('http://', 'https://', 'mailto:', 'tel:')):
            continue
        if ref.startswith('#'):
            if ref[1:] and ref[1:] not in ids and html.name == 'index.html':
                errors.append(f'{html}: ancre manquante {ref}')
            continue

        path, _, anchor = ref.partition('#')
        target = Path(path)
        if path and not target.exists():
            errors.append(f'{html}: cible locale introuvable {ref}')
        if anchor and target.name == 'index.html' and anchor not in index_ids:
            errors.append(f'{html}: ancre index introuvable #{anchor}')

if errors:
    print('ERREURS:')
    print('\n'.join(errors))
    raise SystemExit(1)
print('OK: aucun lien local cassé détecté.')
PY
```

### Vérification des URLs externes

- Conseillé : tester régulièrement les URLs externes (GitHub, LinkedIn, IEEE, Netlify) depuis un environnement ayant accès Internet sortant.
- En CI/terminal restreint, un blocage réseau peut produire de faux négatifs.
- URL officielle LoRaFlexSim à conserver dans le site : `https://loraflexsim.org` (et remplacer tout ancien domaine résiduel).

## Mini checklist “avant déploiement Netlify”

- [ ] Vérifier `index.html` en desktop + mobile (menu, lisibilité, pas de débordement horizontal).
- [ ] Valider les ancres (`#about`, `#experience`, `#projects`, `#publications`, `#contact`).
- [ ] Tester les pages legacy (`experience.html`, `projects.html`, `publications.html`, `contact.html`) : redirection correcte vers la bonne section.
- [ ] Exécuter la vérification des liens locaux (script Python ci-dessus).
- [ ] Ouvrir et tester manuellement les principaux liens externes.
- [ ] Confirmer que la photo de profil se charge correctement.
- [ ] Déployer sur Netlify puis revalider les liens sur l’URL publique.

## Déploiement (Netlify)

1. Connecter le dépôt Git au dashboard Netlify.
2. Build command : *(aucune, site statique)*.
3. Publish directory : `.` (racine du dépôt).
4. Déployer puis tester l’URL de preview.
5. Promouvoir en production une fois la checklist validée.
