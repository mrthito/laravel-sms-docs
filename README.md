# Laravel SMS — Documentation

The documentation site for [mr-rijal/laravel-sms](https://github.com/mr-rijal/laravel-sms), built with [VitePress](https://vitepress.dev).

## Working on the docs

```bash
npm install
npm run dev       # http://localhost:5173, reloads as you edit
npm run build     # production build in .vitepress/dist (fails on dead links)
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
```

## Writing style

- Lead with what the reader is trying to do, then show the code.
- Prefer concrete numbers and names to adjectives: "ten requests at a time", not "blazing fast".
- Every claim should match the package's behaviour. If you're not sure, check the source or write a test.
- Keep examples copy-pasteable, with real-looking values (`+15551234567`, `ACME`).

## Deploying

Pushing to `main` builds the site and publishes it with GitHub Pages (`.github/workflows/deploy.yml`). Enable Pages for the repository with **Source: GitHub Actions**.
