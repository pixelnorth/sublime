// Traduction de l'interface. Le texte source est le français : chaque texte affiché est traduit
// à la volée (y compris ce qui apparaît plus tard : menus, messages, pages).
// Les zones marquées data-notr (texte des sous-titres, noms de projets) ne sont jamais traduites.
// Pour ajouter une langue : copier le bloc `en` sous un nouveau code et traduire les valeurs.

const D = {
  en: {
    'Prévisualiser': 'Preview', 'Exporter': 'Export', 'Éditeur': 'Editor', 'Projets': 'Projects', 'Modèles': 'Templates', 'Statistiques': 'Statistics', 'Paramètres': 'Settings',
    'Sous-titres': 'Subtitles', 'Transcription': 'Transcription', 'Éditer': 'Edit', 'Styles': 'Styles', 'Générer les sous-titres': 'Generate subtitles', 'Préparation…': 'Preparing…',
    'Whisper tourne sur ton ordinateur. Rien n\'est envoyé.': 'Whisper runs on your computer. Nothing is uploaded.',
    'Transcription terminée': 'Transcription complete', 'Vous pouvez maintenant modifier vos sous-titres.': 'You can now edit your subtitles.',
    'Remplacer tout': 'Replace all', 'Appliquer mon dictionnaire': 'Apply my dictionary', 'Placer le texte': 'Place the text', 'Importer .srt': 'Import .srt',
    'Enregistrer comme modèle': 'Save as template', 'Ajouter un sous-titre': 'Add a subtitle', 'Glisse ta vidéo ici': 'Drop your video here', 'MP4, MOV ou WebM · ou clique pour choisir': 'MP4, MOV or WebM · or click to browse',
    'Style': 'Style', 'Animation': 'Animation', 'Position': 'Position', 'Police': 'Font', 'Taille': 'Size', 'Couleur du texte': 'Text color', 'Mot actif': 'Active word', 'Contour': 'Outline', 'Épaisseur': 'Thickness',
    'Ombre': 'Shadow', 'Arrière-plan': 'Background', 'Couleur': 'Color', 'Opacité': 'Opacity', 'Marges': 'Padding', 'Haut': 'Top', 'Gauche': 'Left', 'Bas': 'Bottom', 'Droite': 'Right',
    'Entrée de la ligne': 'Line entrance', 'Pop': 'Pop', 'Rebond': 'Bounce', 'Reveal': 'Reveal', 'Mot par mot': 'Word by word', 'Fondu': 'Fade', 'Apparition douce': 'Soft fade-in', 'Glisse': 'Slide', 'Monte du bas': 'Rises from below',
    'Aucune': 'None', 'Statique': 'Static', 'Boîte': 'Box', 'Fond coloré': 'Colored box', 'Texte coloré': 'Colored text', 'Aucun': 'None', 'Sans surlignage': 'No highlight', 'Durée': 'Duration',
    'Placement': 'Placement', 'Milieu': 'Middle', 'Vertical': 'Vertical', 'Largeur max': 'Max width', 'Mots / ligne': 'Words / line', 'Majuscules': 'Uppercase',
    'Couper': 'Cut', 'Supprimer': 'Delete', 'Scinder': 'Split', 'Ajouter un marqueur': 'Add marker', 'Adapter': 'Fit', 'Vidéo': 'Video',
    'Tes projets sont enregistrés dans ce navigateur, vidéo comprise.': 'Your projects are saved in this browser, video included.', 'Nouveau projet': 'New project',
    'Applique un style en un clic. Enregistre tes propres styles pour les réutiliser.': 'Apply a style in one click. Save your own styles to reuse them.',
    'Enregistrer le style actuel': 'Save current style', 'Mes modèles': 'My templates', 'Modèles intégrés': 'Built-in templates',
    'Calculées à partir de tes projets enregistrés.': 'Computed from your saved projects.', 'Activité · 7 derniers jours': 'Activity · last 7 days', 'Styles les plus utilisés': 'Most used styles',
    'Projet ouvert · lisibilité': 'Open project · readability', 'Valeurs par défaut pour tes nouveaux projets. Enregistré automatiquement.': 'Defaults for your new projects. Saved automatically.',
    'Langue par défaut': 'Default language', 'Modèle par défaut': 'Default model', 'Dictionnaire · orthographe des noms et mots spéciaux': 'Dictionary · spelling of names and special words',
    'Un mot par ligne, écrit correctement. Pour forcer une correction, ajoute après « = » les mauvaises versions entendues.': 'One word per line, spelled correctly. To force a fix, add the wrong versions heard after "=".',
    'Ex. :': 'E.g.:', '. Appliqué automatiquement à chaque transcription.': '. Applied automatically to every transcription.',
    'Édition': 'Editing', 'Mots par ligne': 'Words per line', 'Format par défaut': 'Default format', 'Comme la vidéo': 'Same as video', 'Sauvegarde automatique': 'Autosave',
    'Export': 'Export', 'Qualité vidéo': 'Video quality', 'Standard · 6 Mb/s': 'Standard · 6 Mb/s', 'Haute · 12 Mb/s': 'High · 12 Mb/s', 'Maximale · 20 Mb/s': 'Maximum · 20 Mb/s', 'Images par seconde': 'Frames per second',
    'Apparence & données': 'Appearance & data', 'Thème': 'Theme', 'Sombre': 'Dark', 'Clair': 'Light', 'Langue de l\'application': 'App language', 'Stockage utilisé': 'Storage used',
    'Effacer tous les projets et modèles': 'Erase all projects and templates', 'Tout effacer': 'Erase all', 'Export en cours…': 'Exporting…', 'Garde cet onglet ouvert.': 'Keep this tab open.', 'Annuler': 'Cancel',
    'Rechercher': 'Search', 'Remplacer par': 'Replace with', 'Ou colle ton texte : il sera réparti sur toute la vidéo.': 'Or paste your text: it will be spread over the whole video.',
    'Annuler (Ctrl+Z)': 'Undo (Ctrl+Z)', 'Rétablir (Ctrl+Y)': 'Redo (Ctrl+Y)', 'Rétablir': 'Redo', 'Changer de thème': 'Switch theme', 'Aide': 'Help', 'Sous-titre précédent': 'Previous subtitle',
    'Sous-titre suivant': 'Next subtitle', 'Aller à la fin': 'Go to end', 'Plein écran': 'Fullscreen', 'Son': 'Sound', 'Lier les marges': 'Link padding', 'Couper (Ctrl+X, coller avec Ctrl+V)': 'Cut (Ctrl+X, paste with Ctrl+V)',
    'Supprimer (Suppr)': 'Delete (Del)', 'Scinder au curseur (S)': 'Split at playhead (S)', 'Ajouter un marqueur (M)': 'Add marker (M)', 'Dézoomer': 'Zoom out', 'Zoomer': 'Zoom in', 'Relancer une transcription': 'Run transcription again',
    'Lire cette ligne': 'Play this line', 'Options': 'Options', 'Menu du projet': 'Project menu', 'Nom du projet': 'Project name', 'Lecture': 'Play', 'Position ': 'Position', 'Double-clic pour supprimer': 'Double-click to delete',
    'Ce fichier n\'est pas une vidéo': 'This file is not a video', 'Vidéo trop lourde pour être sauvegardée, le projet reste ouvert': 'Video too large to save, the project stays open',
    'Projet introuvable': 'Project not found', 'Sauvegarde impossible': 'Could not save', 'Projet enregistré': 'Project saved', 'Projet restauré': 'Project restored',
    'Place le curseur sur une ligne pour la scinder': 'Put the playhead on a line to split it', 'Il faut au moins un mot de chaque côté': 'You need at least one word on each side',
    'Sélectionne une ligne': 'Select a line', 'Coupé. Ctrl+V pour coller au curseur': 'Cut. Ctrl+V to paste at the playhead',
    'Espace : lecture / pause': 'Space: play / pause', 'S : scinder · M : marqueur': 'S: split · M: marker', 'Suppr : supprimer la ligne': 'Del: delete the line',
    'Ctrl+Z / Ctrl+Y : annuler / rétablir': 'Ctrl+Z / Ctrl+Y: undo / redo', 'Ctrl+S : enregistrer': 'Ctrl+S: save',
    'Extraction de l\'audio…': 'Extracting audio…', 'Transcription en cours…': 'Transcribing…', 'Aucune parole détectée': 'No speech detected', 'Écris le mot à chercher': 'Type the word to search',
    'Aucun résultat': 'No results', 'Colle d\'abord ton texte': 'Paste your text first', 'Texte placé. Ajuste les blocs dans la timeline': 'Text placed. Adjust the blocks in the timeline',
    'Ouvre d\'abord une vidéo': 'Open a video first', 'Fichier .srt illisible': 'Unreadable .srt file', 'Ton dictionnaire est vide : ajoute des mots dans Paramètres': 'Your dictionary is empty: add words in Settings',
    'Rien à corriger': 'Nothing to fix', 'Modèle enregistré': 'Template saved', 'Style appliqué': 'Style applied', 'Paramètre enregistré': 'Setting saved', 'Dictionnaire enregistré': 'Dictionary saved',
    'Export annulé': 'Export canceled', 'Export rapide indisponible, export en temps réel…': 'Fast export unavailable, exporting in real time…', 'Export en temps réel…': 'Exporting in real time…',
    'Export terminé': 'Export finished', 'Aucun sous-titre à exporter': 'No subtitles to export', 'Nouveau sous-titre': 'New subtitle',
    'Dupliquer': 'Duplicate', 'Corriger un mot (dictionnaire)…': 'Fix a word (dictionary)…', 'Fusionner avec la suivante': 'Merge with next', 'Pas de ligne suivante': 'No next line',
    'Ouvrir': 'Open', 'Renommer': 'Rename', 'Exporter les sous-titres (.srt)': 'Export subtitles (.srt)', 'Enregistrer (Ctrl+S)': 'Save (Ctrl+S)', 'Nouveau projet…': 'New project…', 'Tous les projets': 'All projects',
    'Sous-titres (.srt)': 'Subtitles (.srt)', 'Image actuelle (.png)': 'Current frame (.png)',
    'Aucun modèle perso. Règle un style dans l\'éditeur puis « Enregistrer le style actuel ».': 'No custom templates. Tune a style in the editor, then "Save current style".',
    'Aucun projet pour l\'instant. Clique sur « Nouveau projet » et choisis une vidéo.': 'No projects yet. Click "New project" and pick a video.',
    'Pas encore de données.': 'No data yet.', 'Ouvre un projet avec des sous-titres pour voir son analyse.': 'Open a project with subtitles to see its analysis.',
    'Toutes les lignes se lisent confortablement.': 'Every line is comfortable to read.',
    'Au-delà de 20 caractères par seconde, la ligne est dure à lire. Clique pour la corriger :': 'Above 20 characters per second, a line is hard to read. Click to fix it:',
    'Ouvert': 'Open', 'Mots transcrits': 'Words transcribed', 'Vidéo traitée': 'Video processed', 'mots / minute': 'words / minute', 'durée moyenne d\'une ligne': 'average line duration',
    'mots par ligne': 'words per line', 'lignes trop rapides': 'lines too fast', 'Perso': 'Custom', 'à l\'instant': 'just now',
    'Ultra précis · ~1 Go': 'Ultra accurate · ~1 GB', 'Précis · ~250 Mo': 'Accurate · ~250 MB', 'Rapide · ~80 Mo': 'Fast · ~80 MB',
    'Classique': 'Classic', 'Glace': 'Ice', 'Rose': 'Pink', 'Nom du modèle': 'Template name', 'Nouveau nom': 'New name', 'Quel mot est mal écrit ?': 'Which word is misspelled?',
    'Supprimer ce projet et sa vidéo ? C\'est définitif.': 'Delete this project and its video? This cannot be undone.',
    'Effacer tous les projets, vidéos et modèles enregistrés dans ce navigateur ? C\'est définitif.': 'Erase all projects, videos and templates saved in this browser? This cannot be undone.',
    'Afficher les sous-titres': 'Show subtitles', 'Afficher la vidéo': 'Show video', 'Zoom': 'Zoom', 'Sans titre': 'Untitled', 'Bientôt disponible': 'Coming soon',
  },
  es: {
    'Prévisualiser': 'Vista previa', 'Exporter': 'Exportar', 'Éditeur': 'Editor', 'Projets': 'Proyectos', 'Modèles': 'Plantillas', 'Statistiques': 'Estadísticas', 'Paramètres': 'Ajustes',
    'Sous-titres': 'Subtítulos', 'Transcription': 'Transcripción', 'Éditer': 'Editar', 'Styles': 'Estilos', 'Générer les sous-titres': 'Generar subtítulos', 'Préparation…': 'Preparando…',
    'Whisper tourne sur ton ordinateur. Rien n\'est envoyé.': 'Whisper funciona en tu ordenador. No se envía nada.',
    'Transcription terminée': 'Transcripción terminada', 'Vous pouvez maintenant modifier vos sous-titres.': 'Ya puedes editar tus subtítulos.',
    'Remplacer tout': 'Reemplazar todo', 'Appliquer mon dictionnaire': 'Aplicar mi diccionario', 'Placer le texte': 'Colocar el texto', 'Importer .srt': 'Importar .srt',
    'Enregistrer comme modèle': 'Guardar como plantilla', 'Ajouter un sous-titre': 'Añadir un subtítulo', 'Glisse ta vidéo ici': 'Arrastra tu vídeo aquí', 'MP4, MOV ou WebM · ou clique pour choisir': 'MP4, MOV o WebM · o haz clic para elegir',
    'Style': 'Estilo', 'Animation': 'Animación', 'Position': 'Posición', 'Police': 'Fuente', 'Taille': 'Tamaño', 'Couleur du texte': 'Color del texto', 'Mot actif': 'Palabra activa', 'Contour': 'Contorno', 'Épaisseur': 'Grosor',
    'Ombre': 'Sombra', 'Arrière-plan': 'Fondo', 'Couleur': 'Color', 'Opacité': 'Opacidad', 'Marges': 'Márgenes', 'Haut': 'Arriba', 'Gauche': 'Izquierda', 'Bas': 'Abajo', 'Droite': 'Derecha',
    'Entrée de la ligne': 'Entrada de la línea', 'Pop': 'Pop', 'Rebond': 'Rebote', 'Reveal': 'Revelar', 'Mot par mot': 'Palabra a palabra', 'Fondu': 'Fundido', 'Apparition douce': 'Aparición suave', 'Glisse': 'Deslizar', 'Monte du bas': 'Sube desde abajo',
    'Aucune': 'Ninguna', 'Statique': 'Estático', 'Boîte': 'Caja', 'Fond coloré': 'Fondo de color', 'Texte coloré': 'Texto de color', 'Aucun': 'Ninguno', 'Sans surlignage': 'Sin resaltado', 'Durée': 'Duración',
    'Placement': 'Colocación', 'Milieu': 'Centro', 'Vertical': 'Vertical', 'Largeur max': 'Ancho máx.', 'Mots / ligne': 'Palabras / línea', 'Majuscules': 'Mayúsculas',
    'Couper': 'Cortar', 'Supprimer': 'Eliminar', 'Scinder': 'Dividir', 'Ajouter un marqueur': 'Añadir marcador', 'Adapter': 'Ajustar', 'Vidéo': 'Vídeo',
    'Tes projets sont enregistrés dans ce navigateur, vidéo comprise.': 'Tus proyectos se guardan en este navegador, vídeo incluido.', 'Nouveau projet': 'Nuevo proyecto',
    'Applique un style en un clic. Enregistre tes propres styles pour les réutiliser.': 'Aplica un estilo con un clic. Guarda tus propios estilos para reutilizarlos.',
    'Enregistrer le style actuel': 'Guardar el estilo actual', 'Mes modèles': 'Mis plantillas', 'Modèles intégrés': 'Plantillas incluidas',
    'Calculées à partir de tes projets enregistrés.': 'Calculadas a partir de tus proyectos guardados.', 'Activité · 7 derniers jours': 'Actividad · últimos 7 días', 'Styles les plus utilisés': 'Estilos más usados',
    'Projet ouvert · lisibilité': 'Proyecto abierto · legibilidad', 'Valeurs par défaut pour tes nouveaux projets. Enregistré automatiquement.': 'Valores por defecto para tus nuevos proyectos. Se guarda automáticamente.',
    'Langue par défaut': 'Idioma por defecto', 'Modèle par défaut': 'Modelo por defecto', 'Dictionnaire · orthographe des noms et mots spéciaux': 'Diccionario · ortografía de nombres y palabras especiales',
    'Un mot par ligne, écrit correctement. Pour forcer une correction, ajoute après « = » les mauvaises versions entendues.': 'Una palabra por línea, bien escrita. Para forzar una corrección, añade tras «=» las versiones erróneas oídas.',
    'Ex. :': 'Ej.:', '. Appliqué automatiquement à chaque transcription.': '. Se aplica automáticamente en cada transcripción.',
    'Édition': 'Edición', 'Mots par ligne': 'Palabras por línea', 'Format par défaut': 'Formato por defecto', 'Comme la vidéo': 'Igual que el vídeo', 'Sauvegarde automatique': 'Guardado automático',
    'Export': 'Exportación', 'Qualité vidéo': 'Calidad de vídeo', 'Standard · 6 Mb/s': 'Estándar · 6 Mb/s', 'Haute · 12 Mb/s': 'Alta · 12 Mb/s', 'Maximale · 20 Mb/s': 'Máxima · 20 Mb/s', 'Images par seconde': 'Imágenes por segundo',
    'Apparence & données': 'Apariencia y datos', 'Thème': 'Tema', 'Sombre': 'Oscuro', 'Clair': 'Claro', 'Langue de l\'application': 'Idioma de la aplicación', 'Stockage utilisé': 'Almacenamiento usado',
    'Effacer tous les projets et modèles': 'Borrar todos los proyectos y plantillas', 'Tout effacer': 'Borrar todo', 'Export en cours…': 'Exportando…', 'Garde cet onglet ouvert.': 'Mantén esta pestaña abierta.', 'Annuler': 'Cancelar',
    'Rechercher': 'Buscar', 'Remplacer par': 'Reemplazar por', 'Ou colle ton texte : il sera réparti sur toute la vidéo.': 'O pega tu texto: se repartirá por todo el vídeo.',
    'Annuler (Ctrl+Z)': 'Deshacer (Ctrl+Z)', 'Rétablir (Ctrl+Y)': 'Rehacer (Ctrl+Y)', 'Rétablir': 'Rehacer', 'Changer de thème': 'Cambiar de tema', 'Aide': 'Ayuda', 'Sous-titre précédent': 'Subtítulo anterior',
    'Sous-titre suivant': 'Subtítulo siguiente', 'Aller à la fin': 'Ir al final', 'Plein écran': 'Pantalla completa', 'Son': 'Sonido', 'Lier les marges': 'Vincular márgenes', 'Couper (Ctrl+X, coller avec Ctrl+V)': 'Cortar (Ctrl+X, pegar con Ctrl+V)',
    'Supprimer (Suppr)': 'Eliminar (Supr)', 'Scinder au curseur (S)': 'Dividir en el cursor (S)', 'Ajouter un marqueur (M)': 'Añadir marcador (M)', 'Dézoomer': 'Alejar', 'Zoomer': 'Acercar', 'Relancer une transcription': 'Volver a transcribir',
    'Lire cette ligne': 'Reproducir esta línea', 'Options': 'Opciones', 'Menu du projet': 'Menú del proyecto', 'Nom du projet': 'Nombre del proyecto', 'Lecture': 'Reproducir', 'Double-clic pour supprimer': 'Doble clic para eliminar',
    'Ce fichier n\'est pas une vidéo': 'Este archivo no es un vídeo', 'Vidéo trop lourde pour être sauvegardée, le projet reste ouvert': 'Vídeo demasiado pesado para guardarlo, el proyecto sigue abierto',
    'Projet introuvable': 'Proyecto no encontrado', 'Sauvegarde impossible': 'No se pudo guardar', 'Projet enregistré': 'Proyecto guardado', 'Projet restauré': 'Proyecto restaurado',
    'Place le curseur sur une ligne pour la scinder': 'Coloca el cursor sobre una línea para dividirla', 'Il faut au moins un mot de chaque côté': 'Hace falta al menos una palabra a cada lado',
    'Sélectionne une ligne': 'Selecciona una línea', 'Coupé. Ctrl+V pour coller au curseur': 'Cortado. Ctrl+V para pegar en el cursor',
    'Espace : lecture / pause': 'Espacio: reproducir / pausa', 'S : scinder · M : marqueur': 'S: dividir · M: marcador', 'Suppr : supprimer la ligne': 'Supr: eliminar la línea',
    'Ctrl+Z / Ctrl+Y : annuler / rétablir': 'Ctrl+Z / Ctrl+Y: deshacer / rehacer', 'Ctrl+S : enregistrer': 'Ctrl+S: guardar',
    'Extraction de l\'audio…': 'Extrayendo el audio…', 'Transcription en cours…': 'Transcribiendo…', 'Aucune parole détectée': 'No se detectó voz', 'Écris le mot à chercher': 'Escribe la palabra a buscar',
    'Aucun résultat': 'Sin resultados', 'Colle d\'abord ton texte': 'Pega primero tu texto', 'Texte placé. Ajuste les blocs dans la timeline': 'Texto colocado. Ajusta los bloques en la línea de tiempo',
    'Ouvre d\'abord une vidéo': 'Abre primero un vídeo', 'Fichier .srt illisible': 'Archivo .srt ilegible', 'Ton dictionnaire est vide : ajoute des mots dans Paramètres': 'Tu diccionario está vacío: añade palabras en Ajustes',
    'Rien à corriger': 'Nada que corregir', 'Modèle enregistré': 'Plantilla guardada', 'Style appliqué': 'Estilo aplicado', 'Paramètre enregistré': 'Ajuste guardado', 'Dictionnaire enregistré': 'Diccionario guardado',
    'Export annulé': 'Exportación cancelada', 'Export rapide indisponible, export en temps réel…': 'Exportación rápida no disponible, exportando en tiempo real…', 'Export en temps réel…': 'Exportando en tiempo real…',
    'Export terminé': 'Exportación terminada', 'Aucun sous-titre à exporter': 'No hay subtítulos que exportar', 'Nouveau sous-titre': 'Nuevo subtítulo',
    'Dupliquer': 'Duplicar', 'Corriger un mot (dictionnaire)…': 'Corregir una palabra (diccionario)…', 'Fusionner avec la suivante': 'Fusionar con la siguiente', 'Pas de ligne suivante': 'No hay línea siguiente',
    'Ouvrir': 'Abrir', 'Renommer': 'Renombrar', 'Exporter les sous-titres (.srt)': 'Exportar subtítulos (.srt)', 'Enregistrer (Ctrl+S)': 'Guardar (Ctrl+S)', 'Nouveau projet…': 'Nuevo proyecto…', 'Tous les projets': 'Todos los proyectos',
    'Sous-titres (.srt)': 'Subtítulos (.srt)', 'Image actuelle (.png)': 'Imagen actual (.png)',
    'Aucun modèle perso. Règle un style dans l\'éditeur puis « Enregistrer le style actuel ».': 'Ninguna plantilla propia. Ajusta un estilo en el editor y luego «Guardar el estilo actual».',
    'Aucun projet pour l\'instant. Clique sur « Nouveau projet » et choisis une vidéo.': 'Aún no hay proyectos. Haz clic en «Nuevo proyecto» y elige un vídeo.',
    'Pas encore de données.': 'Aún no hay datos.', 'Ouvre un projet avec des sous-titres pour voir son analyse.': 'Abre un proyecto con subtítulos para ver su análisis.',
    'Toutes les lignes se lisent confortablement.': 'Todas las líneas se leen con comodidad.',
    'Au-delà de 20 caractères par seconde, la ligne est dure à lire. Clique pour la corriger :': 'Por encima de 20 caracteres por segundo, la línea cuesta leerla. Haz clic para corregirla:',
    'Ouvert': 'Abierto', 'Mots transcrits': 'Palabras transcritas', 'Vidéo traitée': 'Vídeo procesado', 'mots / minute': 'palabras / minuto', 'durée moyenne d\'une ligne': 'duración media de una línea',
    'mots par ligne': 'palabras por línea', 'lignes trop rapides': 'líneas demasiado rápidas', 'Perso': 'Propio', 'à l\'instant': 'ahora mismo',
    'Ultra précis · ~1 Go': 'Ultra preciso · ~1 GB', 'Précis · ~250 Mo': 'Preciso · ~250 MB', 'Rapide · ~80 Mo': 'Rápido · ~80 MB',
    'Classique': 'Clásico', 'Glace': 'Hielo', 'Rose': 'Rosa', 'Nom du modèle': 'Nombre de la plantilla', 'Nouveau nom': 'Nuevo nombre', 'Quel mot est mal écrit ?': '¿Qué palabra está mal escrita?',
    'Supprimer ce projet et sa vidéo ? C\'est définitif.': '¿Eliminar este proyecto y su vídeo? Es definitivo.',
    'Effacer tous les projets, vidéos et modèles enregistrés dans ce navigateur ? C\'est définitif.': '¿Borrar todos los proyectos, vídeos y plantillas guardados en este navegador? Es definitivo.',
    'Afficher les sous-titres': 'Mostrar subtítulos', 'Afficher la vidéo': 'Mostrar vídeo', 'Zoom': 'Zoom', 'Sans titre': 'Sin título', 'Bientôt disponible': 'Próximamente',
  },
};

const plural = (n, one, many) => (+n > 1 ? many : one);
const AGO = { en: { min: 'min', h: 'h', j: 'd' }, es: { min: 'min', h: 'h', j: 'd' } };
// Textes avec des nombres ou des noms dedans
const P = [
  [/^(\d+) mots? corrigés? par ton dictionnaire$/, (l, n) => (l === 'en' ? `${n} ${plural(n, 'word', 'words')} fixed by your dictionary` : `${n} ${plural(n, 'palabra corregida', 'palabras corregidas')} por tu diccionario`)],
  [/^(\d+) corrections? appliquées?$/, (l, n) => (l === 'en' ? `${n} ${plural(n, 'fix', 'fixes')} applied` : `${n} ${plural(n, 'corrección aplicada', 'correcciones aplicadas')}`)],
  [/^(\d+) remplacements?$/, (l, n) => (l === 'en' ? `${n} ${plural(n, 'replacement', 'replacements')}` : `${n} ${plural(n, 'reemplazo', 'reemplazos')}`)],
  [/^(\d+) sous-titres importés$/, (l, n) => (l === 'en' ? `${n} subtitles imported` : `${n} subtítulos importados`)],
  [/^Vidéo enregistrée en ([\d.]+) s$/, (l, s) => (l === 'en' ? `Video saved in ${s} s` : `Vídeo guardado en ${s} s`)],
  [/^Vidéo (\S+) avec sous-titres$/, (l, a) => (l === 'en' ? `${a} video with subtitles` : `Vídeo ${a} con subtítulos`)],
  [/^Téléchargement du modèle \(une seule fois\)… (\d+) %$/, (l, n) => (l === 'en' ? `Downloading model (one time only)… ${n} %` : `Descargando el modelo (solo una vez)… ${n} %`)],
  [/^il y a (\d+) (min|h|j)$/, (l, n, u) => (l === 'en' ? `${n} ${AGO.en[u]} ago` : `hace ${n} ${AGO.es[u]}`)],
  [/^(\d+) sous-titres · (\S+) · (.+)$/, (l, n, d, a) => `${n} ${l === 'en' ? 'subtitles' : 'subtítulos'} · ${d} · ${tr(a)}`],
  [/^Créé (.+)$/, (l, a) => `${l === 'en' ? 'Created' : 'Creado'} ${tr(a)}`],
  [/^Erreur : (.*)$/, (l, m) => `${l === 'en' ? 'Error' : 'Error'}: ${m}`],
  [/^Impossible de lire l'audio : (.*)$/, (l, m) => `${l === 'en' ? 'Can\'t read the audio' : 'No se puede leer el audio'}: ${m}`],
  [/^(\d+) car\/s$/, (l, n) => `${n} ${l === 'en' ? 'chars/s' : 'car/s'}`],
  [/^Mon style (\d+)$/, (l, n) => `${l === 'en' ? 'My style' : 'Mi estilo'} ${n}`],
  [/^Bonne orthographe pour « (.+) » \?$/, (l, w) => (l === 'en' ? `Correct spelling for "${w}"?` : `¿Ortografía correcta de «${w}»?`)],
  [/^(.+) \(lent sans carte graphique\)$/, (l, m) => `${tr(m)} (${l === 'en' ? 'slow without a graphics card' : 'lento sin tarjeta gráfica'})`],
  [/^Vidéo (\S+) avec sous-titres$/, (l, a) => (l === 'en' ? `${a} video with subtitles` : `Vídeo ${a} con subtítulos`)],
];

export const LANGS = { fr: 'Français', en: 'English', es: 'Español' };
export let lang = 'fr';

// Traduit un texte français dans la langue de l'interface
export function tr(s) {
  if (lang === 'fr' || !s) return s;
  const d = D[lang][s];
  if (d !== undefined) return d;
  for (const [re, fn] of P) { const m = s.match(re); if (m) return fn(lang, ...m.slice(1)); }
  return s;
}

const SKIP = 'script,style,svg,textarea,[data-notr],[contenteditable]';
const textSrc = new WeakMap(), attrSrc = new WeakMap();
const ATTRS = ['title', 'placeholder', 'aria-label'];

function doText(node) {
  if (node.parentElement?.closest(SKIP)) return;
  const rec = textSrc.get(node), cur = node.data;
  const src = rec && rec.out === cur ? rec.src : cur; // texte d'origine, même après traduction
  const key = src.trim();
  if (!key) return;
  const out = src.replace(key, tr(key));
  textSrc.set(node, { src, out });
  if (out !== cur) node.data = out;
}
function doAttrs(el) {
  if (el.closest('[data-notr]')) return;
  let m = attrSrc.get(el);
  for (const a of ATTRS) {
    if (!el.hasAttribute(a)) continue;
    m ??= {};
    const cur = el.getAttribute(a);
    if (!m[a] || m[a].out !== cur) m[a] = { src: cur };
    m[a].out = tr(m[a].src);
    if (m[a].out !== cur) el.setAttribute(a, m[a].out);
  }
  if (m) attrSrc.set(el, m);
}
function walk(root) {
  if (root.nodeType === 3) return doText(root);
  if (root.nodeType !== 1 || root.closest(SKIP)) return;
  doAttrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let n = w.nextNode(); n; n = w.nextNode()) n.nodeType === 3 ? doText(n) : doAttrs(n);
}

export function setLang(l) {
  lang = D[l] || l === 'fr' ? l : 'fr';
  document.documentElement.lang = lang;
  walk(document.body);
}
export const detectLang = () => (navigator.language || 'fr').slice(0, 2).replace(/^(?!en|es).*/, 'fr');

// Tout ce qui apparaît ou change ensuite est traduit automatiquement
new MutationObserver((muts) => {
  for (const m of muts) {
    if (m.type === 'childList') m.addedNodes.forEach(walk);
    else if (m.type === 'characterData') doText(m.target);
    else doAttrs(m.target);
  }
}).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
