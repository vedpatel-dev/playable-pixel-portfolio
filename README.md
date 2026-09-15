```
█▀▀ ▀▄▀ █▀▀ █▀▄   █▀█ ▄▀█ ▀█▀ █▀▀ █░░
██▄ █░█ ██▄ █▄▀   █▀▀ █▀█ ░█░ ██▄ █▄▄
```

# Ved Patel — Pixel Portfolio

A 16-bit-styled personal portfolio built with Next.js 15 (App Router), Tailwind v4
and TypeScript, with a Gemini-powered AI assistant ("PIXEL-BOT") docked in the
sidebar that answers questions about Ved's resume.

[![Live Demo](https://img.shields.io/badge/PRESS_START-Live_Demo-46e0d0?style=for-the-badge&labelColor=12131f)](https://playable-pixel-portfolio.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=46e0d0&labelColor=12131f)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-9d7bff?style=for-the-badge&logo=typescript&logoColor=fff&labelColor=12131f)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_v4-ff5fa2?style=for-the-badge&logo=tailwindcss&logoColor=fff&labelColor=12131f)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini-ffc24b?style=for-the-badge&logo=googlegemini&logoColor=12131f&labelColor=12131f)](https://aistudio.google.com/)

**>> [playable-pixel-portfolio.vercel.app](https://playable-pixel-portfolio.vercel.app/) <<**

## Quick start

The app lives in `pixel-folio/`.

```bash
cd pixel-folio
npm install
npm run dev          # http://localhost:3000
```

## Wiring up the AI assistant

The assistant needs a Google AI Studio API key. It is read **server-side only** —
it never reaches the browser.

1. Grab a key at <https://aistudio.google.com/apikey>
2. Create your local env file (git-ignored) and fill it in:

   ```
   cd pixel-folio
   cp .env.example .env.local
   ```

   Then set your key in `pixel-folio/.env.local`:

   ```
   GEMINI_API_KEY=your_key_here
   ```

3. Restart `npm run dev`.

Without a key the site works fine — the assistant just replies with a clear
"not configured yet" notice instead of an answer.

Optional: `GEMINI_MODEL` overrides the default `gemini-3.6-flash`, and
`GEMINI_BASE_URL` overrides the API host (useful for a self-hosted gateway or
for pointing at a local mock during testing).

## Deploying (Vercel)

Set the project's **Root Directory** to `pixel-folio` in Vercel's project
settings, then:

```bash
cd pixel-folio
npx vercel
```

Add `GEMINI_API_KEY` under **Project → Settings → Environment Variables**
and redeploy. Any Node host works (`npm run build && npm start`); plain static
hosts like GitHub Pages will not, because `/api/chat` needs a server to keep the
key secret.

## Where things live

| Path | What it is |
| --- | --- |
| `pixel-folio/data/content.ts` | **Every word of resume content.** Edit here, the whole site updates. |
| `pixel-folio/lib/systemPrompt.ts` | Flattens `content.ts` into the assistant's dossier + its rules. |
| `pixel-folio/app/api/chat/route.ts` | Server-side Gemini proxy. Streams replies, rate-limits by IP. |
| `pixel-folio/app/globals.css` | The 16-bit design system — colors, pixel frames, animations. |
| `pixel-folio/components/PixelIcon.tsx` | Icons authored as literal pixel art, rendered to SVG rects. |
| `pixel-folio/components/AgentDock.tsx` | The assistant sidebar UI. |
| `pixel-folio/components/SiteFx.tsx` | Scroll reveals + click sparks (one observer, one listener). |

### Updating your resume

Everything flows from `pixel-folio/data/content.ts`. Add a job to the `experience`
array and it appears in the timeline **and** the assistant knows about it
immediately — no second place to update.

## Notes on the effects

All motion is transform/opacity only (compositor-driven), reveals share a single
`IntersectionObserver`, the marquee and starfield are pure CSS, and everything is
disabled under `prefers-reduced-motion: reduce`.

---

```
█▀▄ █▀▀ █░█ █▀▀ █░░ █▀█ █▀█ █▀▀ █▀█
█▄▀ ██▄ ▀▄▀ ██▄ █▄▄ █▄█ █▀▀ ██▄ █▀▄
```

### Ved Patel

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ved_Rajeshkumar_Patel-46e0d0?style=for-the-badge&logo=linkedin&logoColor=fff&labelColor=12131f)](https://www.linkedin.com/in/ved-rajeshkumar-patel-vrp/)
