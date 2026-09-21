# Harm.Less

> A privacy-first harm reduction reference and local resource finder.

Built for people who need real help finding real resources, without surveillance or barriers.

## What it does

- **Local Resources** — searches public OpenStreetMap data for harm-reduction services, shelters, clinics, food support, and other assistance near a selected location.
- **Harm Reduction Tools** — interaction checking, volumetric measurement, pill-imprint lookup, safer-use information, emergency support, and legal-reference material.

## Stack

React · TypeScript · Vite · Tailwind CSS · local browser APIs

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Start the app:
   ```
   npm run dev
   ```

Open `http://localhost:3000`

## Verification

- `npm test` runs the deterministic safety and data-handling regression suite.
- `npm run lint` checks the current TypeScript/React source.
- `npm run build` performs the TypeScript and Vite production build.
- GitHub Actions runs all three checks on pushes to `main` and pull requests.

## Privacy

Harm.Less does not require an account or cloud service. Local browser data is not uploaded by the application. Some resource-search features use external public services when you request an online search, so location or search information may be transmitted to those providers. Review the in-app disclosures before using external search.

## Contributing

Issues and PRs welcome. See open issues for the roadmap.
