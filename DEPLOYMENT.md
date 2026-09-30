# Deployment

Harm.Less is a Vite-built client-side application. A deployment target must serve the generated `dist/` directory as static web content.

## Deployment target

Harm.Less is a static Vite application and can be deployed to GitHub Pages or another static HTTPS host. The included `pages.yml` workflow builds and deploys the production bundle after the full verification gate. GitHub Pages must be enabled for the repository with **Settings → Pages → Source → GitHub Actions** before the first deployment.

The included `release.yml` workflow publishes a tagged release with the exact `dist/` artifact and SHA-256 checksum after the release gate passes.

## Release procedure

1. Use the repository's release-candidate branch or the exact commit selected for release.
2. Use Node.js 20.20.2 or 24.18.0.
3. Install from the committed lockfile:

       npm ci

4. Run the release gate:

       npm audit --audit-level=high
       npm run lint
       npm test
       npm run typecheck
       npm run build

5. Start the production preview locally and verify it responds:

       npm run preview -- --host 127.0.0.1

6. Verify the deployed site from the actual hosting environment.

## Required post-deploy checks

- The application loads without a JavaScript or asset-loading error.
- The interaction checker renders documented, unknown, and unavailable evidence states correctly.
- At least one resource category is exercised from a U.S. location and at least one non-U.S. location.
- All user-facing resource categories are exercised at least once during beta validation.
- A location with sparse or missing directory coverage produces an explicit uncertainty/fallback state rather than a claim that help does not exist.
- Resource search handles location permission denial and service failure without presenting unavailable data as confirmed.
- Pill identification does not upload the selected image through the application workflow.
- External evidence links resolve to the documented source domains.
- Geolocation is requested only when the user invokes a location-dependent workflow.
- No deployment secret or credential is embedded in the client bundle.

## Deployment boundary

CI proves the repository can install, lint, test, typecheck, build, and serve a production preview. It does not prove the behavior of a specific hosting provider, browser permission model, camera implementation, geolocation environment, or live upstream API.

Those checks belong to the deployment target and should be recorded with the release. For the first public beta, record browser/device, country/region, resource category tested, whether GPS or manual location was used, sources returned, failures encountered, and whether the fallback behavior was understandable.
