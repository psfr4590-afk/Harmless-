# Deployment

Harm.Less is a Vite-built client-side application. A deployment target must serve the generated `dist/` directory as static web content.

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
- Resource search handles location permission denial and service failure without presenting unavailable data as confirmed.
- Pill identification does not upload the selected image through the application workflow.
- External evidence links resolve to the documented source domains.
- Geolocation is requested only when the user invokes a location-dependent workflow.
- No deployment secret or credential is embedded in the client bundle.

## Deployment boundary

CI proves the repository can install, lint, test, typecheck, build, and serve a production preview. It does not prove the behavior of a specific hosting provider, browser permission model, camera implementation, geolocation environment, or live upstream API.

Those checks belong to the deployment target and should be recorded with the release.
