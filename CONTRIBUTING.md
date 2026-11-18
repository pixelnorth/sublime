# Contributing to SUBLIME

Thanks for helping! SUBLIME is a small, dependency-free project, so getting started takes a minute.

## Run it

```bash
git clone https://github.com/pixelnorth/sublime.git
cd sublime
python -m http.server 5173
```

Open http://localhost:5173 in Chrome or Edge. There is no build step: edit a file, reload the page.

## Ways to help

- **Report a bug**: open an issue with the browser, OS, video format and the steps to reproduce.
- **Suggest an idea**: open an issue and describe the problem it solves.
- **Add a subtitle style**: add an entry to `PRESETS` in `app.js`.
- **Add a language**: copy the `en` block in `i18n.js`, translate the values, and add the language to `LANGS`.
- **Test on other browsers**: Firefox and Safari feedback is especially welcome.

## Pull requests

1. Fork the repo and create a branch: `git checkout -b my-change`.
2. Keep changes focused: one fix or feature per pull request.
3. Keep the project dependency-free (no npm packages, no bundler).
4. Check that transcription, editing and export still work before submitting.
5. Describe what you changed and how you tested it.

## Code style

- Plain modern JavaScript (ES modules), 2-space indentation, single quotes.
- Prefer small, readable functions over abstractions.
- User-facing text goes through `i18n.js` (French is the source language).

By contributing, you agree that your work is released under the [MIT License](LICENSE).
