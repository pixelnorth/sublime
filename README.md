# Sublime

**Éditeur de sous-titres animés style TikTok, gratuit, open source et 100 % dans ton navigateur.**
Glisse une vidéo, l'IA écrit les sous-titres, tu choisis un style, tu exportes. Rien à installer, aucune vidéo envoyée sur un serveur.

[🇬🇧 English below](#english)

![Interface de Sublime](docs/screenshot.png)

## Fonctionnalités

### Transcription IA, sur ton ordinateur
- Whisper (OpenAI) tourne **dans le navigateur** : ta vidéo ne quitte jamais ton PC.
- 3 modèles : **Ultra précis** (large-v3-turbo, carte graphique), **Précis** et **Rapide**.
- Timing **mot par mot**, pour surligner chaque mot au moment où il est dit.
- Français, anglais, espagnol, allemand, italien, portugais, ou détection automatique.

### Orthographe
- **Dictionnaire perso** : tu écris `Etsy`, l'IA ne mettra plus « ETIS ». Corrige aussi les mots qui sonnent pareil.
- Morceaux de mots recollés automatiquement (`aujourd'hui`, `l'homme`, `-t-il`).
- Correcteur du navigateur dans l'éditeur (soulignement rouge + suggestions au clic droit).
- Rechercher / remplacer dans tous les sous-titres.

### Édition
- Texte et timings modifiables directement dans la liste.
- **Timeline** avec piste de sous-titres et miniatures vidéo : glisse un bloc pour le déplacer, tire ses bords pour l'allonger.
- Couper, scinder, fusionner, dupliquer, marqueurs, annuler / rétablir.
- Import et export **.srt**.

### Styles
- **8 modèles** prêts à l'emploi (Hormozi, Néon, Comic, Box…) + tes propres modèles enregistrés.
- Police, graisse, taille, couleurs, contour, ombre, arrière-plan, marges.
- Animations : Pop, Reveal mot par mot, Fondu, Glisse. Mot actif en couleur ou en boîte.
- Formats **16:9, 9:16, 1:1, 4:5**.

### Export rapide
- MP4 encodé par la **carte graphique** (WebCodecs) : bien plus rapide que la durée de la vidéo.
- Fenêtre **« Enregistrer sous »** : tu choisis le dossier sur ton PC.
- Qualité et images par seconde réglables. Export `.srt` et image `.png` aussi.

### Et aussi
- **Projets** sauvegardés automatiquement dans le navigateur, vidéo comprise.
- **Statistiques** : mots par minute, lignes trop rapides à lire, activité.
- Interface en **français, anglais et espagnol**. Thème sombre ou clair.
- Raccourcis : `Espace` lecture, `S` scinder, `M` marqueur, `Suppr`, `Ctrl+Z` / `Ctrl+Y`, `Ctrl+S`.

## Utiliser

**En ligne :** https://legameurdupond-dot.github.io/sublime/

**En local :** il faut un petit serveur (un double-clic sur `index.html` ne suffit pas).

```bash
python -m http.server 5173
```

Puis ouvre http://localhost:5173.

**Navigateur conseillé :** Chrome ou Edge récent. Firefox et Safari marchent, mais sans la fenêtre « Enregistrer sous », et l'export peut y être plus lent.

> Au premier usage, le modèle d'IA se télécharge une fois (80 Mo à 1 Go selon le modèle), puis reste en cache.

## Technique

HTML, CSS et JavaScript, **sans build ni dépendance à installer**.

| Fichier | Rôle |
|---|---|
| `index.html` | Interface |
| `style.css` | Thèmes sombre et clair |
| `app.js` | Éditeur, rendu des sous-titres, projets, export |
| `worker.js` | Transcription Whisper (Transformers.js) |
| `i18n.js` | Traductions de l'interface |

Bibliothèques chargées depuis un CDN : [Transformers.js](https://github.com/huggingface/transformers.js) pour la transcription, [Mediabunny](https://github.com/Vanilagy/mediabunny) pour l'export vidéo.

**Ajouter une langue :** copie le bloc `en` dans `i18n.js` et traduis les textes.

## Contribuer

Les issues et pull requests sont les bienvenues : nouveaux styles, nouvelles langues, corrections.

## Licence

MIT. Libre d'utilisation, de modification et de partage.

---

## English

**Free, open-source TikTok-style animated subtitle editor that runs 100% in your browser.** Drop a video, AI writes the subtitles word by word, pick a style, export a fast MP4. Your video never leaves your computer.

- Local Whisper transcription (3 models, word-level timing, 6 languages + auto)
- Custom dictionary for brand names and proper nouns, automatic word re-joining, spell check
- Timeline editing (drag, resize, split, merge, markers, undo), `.srt` import / export
- 8 built-in styles + your own templates, Pop / Reveal / Fade / Slide animations, 16:9 · 9:16 · 1:1 · 4:5
- GPU-accelerated MP4 export with a "Save as" dialog
- Projects auto-saved in the browser, readability stats, UI in English, French and Spanish

Run locally with `python -m http.server 5173` and open http://localhost:5173 (Chrome or Edge recommended). MIT license.
