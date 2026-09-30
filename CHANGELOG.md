# Changelog

## 1.1.0-rc.1 - 2026-09-30

Release candidate hardening and deployment documentation.

- Consolidated the current evidence-layer, safety-data, regression-test, and CI work on `main`.
- Added a repeatable deployment procedure and explicit post-deploy verification boundary.
- Documented the release-candidate verification gate and the Node.js versions exercised by CI.
- Corrected package-lock metadata so the committed engine range matches `package.json`.
- Versioned the application as `1.1.0-rc.1` for release-candidate validation.

## 1.0.0

- Prepared the repository for public publication with project governance, licensing, documentation, dependency policy, and CI hygiene.

## Unreleased

- Added live NLM MedlinePlus health-topic search and FDA label/recall/shortage evidence adapters with source and retrieval metadata.
- Added current trusted-evidence search UI to the harm-reduction reference screen.
- Added explicit partial-upstream handling so unavailable FDA datasets do not become implicit negative findings.
- Corrected several high-consequence harm-reduction statements that were too absolute or relied on visual/product heuristics.
- Updated static harm-reduction data review date to 2026-09-22.
- Corrected FDA openFDA search-term escaping so ordinary substance names are not altered by the query builder.
- Default development server binding is now localhost; LAN exposure requires an explicit opt-in host override.
- Documented that interaction substance names are transmitted to NLM RxNorm/FDA openFDA and that location searches can contact external services.
- CI now verifies the declared Node runtime range on Node 20.20.2 and Node 24.18.0.
- Expanded regression coverage for the FDA query builder.
- Expanded safety-data provenance and live-source handling.
- Added regression and UI contract coverage for high-consequence behavior.
