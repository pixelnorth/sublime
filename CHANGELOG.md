# Changelog

## v0.9.0-beta — 2026-11-18

First public release.

### Added
- Local AI transcription with Whisper (Ultra, Accurate and Fast models), word-level timestamps, 6 languages + auto-detect.
- Personal dictionary for names and brands, automatic re-joining of word fragments, spell-check, find & replace.
- Subtitle list and timeline editing: drag, resize, cut, split, merge, duplicate, markers, undo / redo.
- `.srt` import and export.
- 8 built-in styles, custom templates, Pop / Reveal / Fade / Slide animations, 16:9 · 9:16 · 1:1 · 4:5 formats.
- GPU-accelerated MP4 export with a "Save as" dialog, real-time fallback.
- Projects saved in the browser, readability statistics, settings.
- Interface in English, French and Spanish; dark and light themes.

### Known issues
- Not yet tested on Firefox and Safari.
- The Ultra model is a ~1 GB one-time download and is slow without WebGPU.
- Very large videos may not fit in browser storage.
