# Repository Verification Evidence

This project includes the required verification path described in the repository documentation and package scripts. The repository is structured so the application can be checked for correctness before release or local launch.

## Evidence in the repository

### 1) Required runtime and toolchain
- `.nvmrc` pins Node.js `20.20.2`.
- `package.json` declares the supported engine range as `>=20.19 <25`.
- The README explicitly says the repo requires Node.js `20.19 through 24.x` and that CI verifies Node `20.20.2` and `24.18.0`.

### 2) Verification commands are defined
`package.json` includes:

```json
"scripts": {
  "dev": "vite --port 3000",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "test": "node --test tests/*.test.mjs",
  "typecheck": "tsc --noEmit",
  "verify:release": "npm run lint && npm test && npm run typecheck && npm run build"
}
```

This is the repository's release-verification gate and is the exact validation path documented in the project README.

### 3) Test infrastructure is present
- The repository contains a `tests/` directory.
- `npm test` calls `node --test tests/*.test.mjs`, which is a valid Node-based test runner setup.

### 4) Build configuration is present
- `vite.config.ts` configures Vite and React support.
- `tsconfig.json` configures TypeScript with strict checking and no-emit validation.
- `eslint.config.js` configures ESLint for JavaScript and TypeScript, including React hooks and refresh rules.

### 5) App entry files are present
- `index.html` declares the root mount element.
- `src/main.tsx` mounts the React application.

### 6) Project documentation explicitly describes the verification process
The README says:

```md
npm ci
npm run lint
npm test
npm run typecheck
npm run build
npm run dev
```

and also defines the release-candidate gate:

```md
npm ci
npm audit --audit-level=high
npm run lint
npm test
npm run typecheck
npm run build
npm run preview -- --host 127.0.0.1
```

This confirms the repository intentionally includes a complete validation flow for release confidence and local verification.

## Interpretation

This repository does not rely on undocumented, ad hoc, or missing verification steps. The evidence shows a complete and repeatable validation workflow: install, lint, test, typecheck, build, and preview/dev launch. The repo's own configuration and docs are aligned on that process.

## Important note

This document captures repository evidence and the explicit verification path defined by the project itself. It reflects the project's configuration and documented checks, rather than a claim that a particular runtime environment has been exercised in this session.
