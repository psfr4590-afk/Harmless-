# Harm.Less

A privacy-conscious harm-reduction companion for people seeking practical safety information and real-world support.

Harm.Less brings harm-reduction education, emergency support, treatment-resource discovery, and safety tools into one focused interface. It is designed to reduce friction when someone needs useful information quickly.

## Features

- **Urgent support** for emergency and crisis resources.
- **Local resources** using connected public-service data when an online search is requested.
- **Interaction checking** with medication-name normalization, live evidence lookup, and explicit unverified states.
- **Volumetric calculations** for mathematical conversion, with safety-focused framing.
- **Pill identification** through imprint information supplied by the user.
- **Safer-use education** covering routes of administration, overdose response, and risk reduction.
- **Lab testing and support resources** for practical harm-reduction needs.
- **Legal references** routed to current jurisdictional legislative information.

## Safety and evidence

Health, emergency, treatment, and legal information is treated as safety-sensitive content.

The application distinguishes documented evidence from unknown, unavailable, or insufficient evidence. A missing interaction record is not presented as proof of safety. Source links and retrieval metadata are exposed where applicable.

Live integrations currently include NLM RxNorm, NLM MedlinePlus, FDA openFDA drug labeling/recalls/shortages, and SAMHSA FindTreatment.gov. CDC's Overdose Prevention Data Channel is linked as an authoritative current-data reference. Public geographic searches may also use OpenStreetMap/Nominatim and Overpass.

A live-service failure is presented as unavailable evidence rather than silently converted into a reassuring result.

## Architecture

The application is a client-side React/TypeScript application built with Vite. Safety-sensitive logic is separated into small utility modules and covered by regression tests. Static health and legal content carries source metadata, while live integrations are isolated behind explicit adapters. The current-evidence search layer preserves source identity, retrieval timestamps, and partial-upstream states rather than converting unavailable data into reassurance.

The application has no application-managed user account or cloud profile. Browser APIs are used only for current feature workflows such as geolocation and local image selection.

## Privacy

Harm.Less does not require an account or application-managed cloud profile.

Some features communicate with external public services. Location-based searches can transmit coordinates or a manually entered location to the services required for that search. Interaction checks send the entered substance names to NLM RxNorm and query FDA openFDA labeling. Other resource lookups can contact public mapping or treatment-service endpoints. Pill images are handled locally by the current identifier workflow and are not uploaded by the application.

External providers have their own privacy policies and operational practices. Do not enter secrets, credentials, or unnecessary personal information into external searches.

## Development

Requires Node.js 20.19 through 24.x. The repository pins Node 20.20.2 in `.nvmrc` and CI verifies Node 20.20.2 and Node 24.18.0.

    npm ci
    npm run lint
    npm test
    npm run typecheck
    npm run build
    npm run dev

The development server binds to localhost by default. If you intentionally need LAN access for device testing, use `npm run dev -- --host 0.0.0.0` and only do so on a trusted network.

## Release candidate verification

The release candidate gate is the same verification path used by CI:

    npm ci
    npm audit --audit-level=high
    npm run lint
    npm test
    npm run typecheck
    npm run build
    npm run preview -- --host 127.0.0.1

CI executes that gate on Node 20.20.2 and Node 24.18.0 and performs an HTTP smoke check against the production preview. A release candidate is not considered verified until the corresponding GitHub Actions run is successful.

The CI gate verifies the repository build and local production preview. Browser permissions, camera behavior, geolocation behavior, live third-party service behavior, and the final hosting environment remain deployment-environment checks and must be verified against the actual deployment target.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the deployment procedure and post-deploy checks.

## Project documentation

- [Deployment](DEPLOYMENT.md)
- [Contributing](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [License](LICENSE)

## Scope

Harm.Less provides educational harm-reduction information and access to resources. It does not replace emergency services, medical diagnosis, treatment, or professional legal advice.

If someone is in immediate danger, contact local emergency services.

## Trusted public evidence sources

The current evidence layer uses public services from NLM, FDA, and SAMHSA:

- **NLM MedlinePlus**: searchable health-topic summaries and links.
- **FDA openFDA**: public drug-labeling, drug-enforcement/recall, and drug-shortage datasets.
- **CDC Overdose Prevention Data Channel**: current overdose surveillance reference.
- **SAMHSA FindTreatment.gov**: current treatment-resource locator.
- **NLM RxNorm**: medication-name normalization used before interaction evidence lookup.

The app does not treat any public API response as automatically equivalent to clinical verification. Search results retain source, date, and limitation context.
