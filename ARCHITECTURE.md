# Harm.Less Architecture

Harm.Less is a privacy-conscious, globally oriented harm-reduction information and resource application. Its architecture separates application behavior from the evidence and coverage boundaries of the information it presents.

## Information contract

Every safety-relevant information path should distinguish:

- **Evidence status:** verified, source-reported, directory discovery, insufficient evidence, upstream unavailable, or unknown.
- **Coverage:** global, country-specific, state/province-specific, local, source-dependent, or unknown.
- **Freshness:** retrieval time for live data and review/effective dates where the upstream source provides them.
- **Scope:** the population, product, jurisdiction, or service scope supported by the source.

Global discovery does not mean universal completeness. A missing directory result does not establish that a service is absent.

## External-source boundaries

- OpenStreetMap/Nominatim/Overpass provide geographic directory discovery.
- SAMHSA FindTreatment.gov is used only for U.S. locations.
- NLM RxNorm provides medication normalization.
- FDA openFDA label data provides documented label evidence, not a complete personalized interaction determination.
- Find A Helpline provides country-specific crisis-directory coverage.
- External providers control their own availability, freshness, and retention.

## Safety boundaries

The interaction checker distinguishes documented interaction evidence from severity. An unavailable upstream source is never presented as a safety clearance.

The dose calculator performs mathematical concentration-to-volume conversion only. It does not select or recommend a target amount.

The pill workflow is an image inspection and imprint lookup aid. A visual or database match is not proof of contents or safety.

## Location privacy

Geolocation is requested only after an explicit user action. Manual location entry remains available. Coordinates are used for the selected geographic search workflow and are not required for the rest of the application.

## Verification contract

The release gate must cover lint, unit/contract tests, TypeScript type checking, and production build. Browser-level verification remains the final layer for validating permission flows, deployed PWA behavior, mobile interaction, and critical end-to-end workflows.

## Architectural direction

The project should evolve by strengthening evidence, coverage, provenance, and runtime verification rather than replacing the existing client-first architecture with a centralized account or telemetry system.
