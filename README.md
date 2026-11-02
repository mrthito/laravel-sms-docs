# Laravel SMS — Documentation

The documentation site for [mr-rijal/laravel-sms](https://github.com/mr-rijal/laravel-sms), built with [VitePress](https://vitepress.dev).

## Working on the docs

```bash
npm install
npm run dev       # http://localhost:5173, reloads as you edit
npm run build     # production build in dist/ (fails on dead links)
npm run preview   # serve the production build
```

## Layout

```text
index.md                  home page
guide/                    task-oriented guides, read in sidebar order
providers/                one page per provider, plus the overview
reference/                configuration, API, Artisan commands, upgrade guide
.vitepress/config.mts     navigation, sidebar, search
.vitepress/theme/         brand colours and layout tweaks
public/                   logo and static files
zh/ es/ fr/ pt/ ko/ ja/   translations, mirroring the English file layout
```

## Languages

English is the source. Each translation lives in its own folder with the same file names: `guide/failover.md` becomes `ja/guide/failover.md`. Navigation labels and interface text for every language live in `.vitepress/config.mts`.

Translations adapt meaning rather than words: they should read as if a native-speaking developer wrote them. When you change an English page, update every translation in the same pull request, or open an issue for the languages you can't write.

Headings in translations carry the English anchor, so links like `/ja/guide/events#cancelling-a-send` work in every language:

```md
## 送信をキャンセルする {#cancelling-a-send}
```

## Diagrams

Diagrams are written in [Mermaid](https://mermaid.js.org) inside ```` ```mermaid ```` blocks and follow the site's light and dark themes automatically.

## Writing style

- Lead with what the reader is trying to do, then show the code.
- Prefer concrete numbers and names to adjectives: "ten requests at a time", not "blazing fast".
- Every claim should match the package's behaviour. If you're not sure, check the source or write a test.
- Keep examples copy-pasteable, with real-looking values (`+15551234567`, `ACME`).

## Deploying

Pushing to `main` builds the site and publishes it with GitHub Pages (`.github/workflows/deploy.yml`). Enable Pages for the repository with **Source: GitHub Actions**.
