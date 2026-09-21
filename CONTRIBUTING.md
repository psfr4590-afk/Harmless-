# Contributing to Harm.Less

Thank you for helping improve a safety-focused project.

## Before you change code

- Keep safety-critical behavior conservative. Unknown or unavailable evidence must never be presented as safe.
- Preserve source attribution and review dates when changing health, treatment, emergency, or legal information.
- Do not add credentials, API keys, personal data, or generated build artifacts to the repository.
- Prefer small, reviewable changes with tests for safety-critical behavior.

## Local development

Requires Node.js 20.

    npm ci
    npm run lint
    npm test
    npm run build
    npm run dev

## Pull requests

Describe the user-facing change, affected safety behavior, sources consulted for factual data changes, and verification performed. Do not claim runtime verification that was not actually performed.

## Scope

Harm.Less is an educational harm-reduction application. It is not a substitute for emergency services, diagnosis, or professional medical or legal advice.
