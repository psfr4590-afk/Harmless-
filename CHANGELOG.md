# Changelog

## 1.0.0

- Prepared the repository for public publication with project governance, licensing, documentation, dependency policy, and CI hygiene.

## Unreleased

- Corrected FDA openFDA search-term escaping so ordinary substance names are not altered by the query builder.
- Default development server binding is now localhost; LAN exposure requires an explicit opt-in host override.
- Documented that interaction substance names are transmitted to NLM RxNorm/FDA openFDA and that location searches can contact external services.
- CI now verifies the declared Node runtime range on Node 20.20.2 and Node 24.18.0.
- Expanded regression coverage for the FDA query builder.
- Expanded safety-data provenance and live-source handling.
- Added regression and UI contract coverage for high-consequence behavior.
