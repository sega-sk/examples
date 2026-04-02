# Deploying to Vercel

Recommended option: use Vercel's Serverless Functions (Node.js) — choose "Other" / "Node.js" when creating the project on Vercel, not Vite.

What I added
- `api/generate.js`: a serverless API route that proxies requests to the Signus.ai API using the `SIGNUS_API_TOKEN` env var (keeps your secret on the server).
- `vercel.json`: pins the functions runtime to Node 18.

How to deploy
1. In the Vercel dashboard create a new project and import this repository (point the root to the `examples` folder if you only want to deploy that app).
2. When asked what to choose, select "Other" / "Node.js" (do not choose Vite unless you have a Vite frontend).
3. Add an environment variable named `SIGNUS_API_TOKEN` with your API token (Project Settings → Environment Variables).
4. Deploy. The serverless endpoint will be available at `/api/generate`.

Local testing
1. Install the Vercel CLI: `npm i -g vercel`
2. From `examples/` run:
```bash
vercel dev
```
3. POST JSON to `http://127.0.0.1:3000/api/generate` with body `{ "prompt": "A sunset over mountains" }`.

Notes
- Keep your `SIGNUS_API_TOKEN` only in Vercel env variables — do not commit tokens.
- If you need a browser frontend built with Vite, deploy that separately (or in the same project) and have it call `/api/generate`.
