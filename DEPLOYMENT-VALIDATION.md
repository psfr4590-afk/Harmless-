# Deployment validation matrix

This document is the deployment-boundary checklist for Harm.Less. Repository CI verifies source contracts and the production build. The checks below require the actual deployed application and must not be inferred from unit tests.

| Check | Status | Evidence / limitation |
| --- | --- | --- |
| Android Chrome | PENDING | Requires physical Android Chrome session |
| Desktop Chrome | PENDING | Requires deployed browser session |
| Desktop Firefox | PENDING | Requires deployed browser session |
| GPS allowed | PENDING | Requires browser permission flow |
| GPS denied | PENDING | Requires browser permission flow |
| Manual location | PENDING | Must verify geocoding and source attribution |
| Camera permission | PENDING | Must verify local image selection |
| Local image upload | PENDING | Must verify image is not uploaded by app workflow |
| API failure / timeout | PENDING | Must verify explicit unavailable state |
| Empty resource results | PENDING | Must verify no-result is not presented as no-service |
| U.S. location | PENDING | Must exercise U.S. resource path |
| Non-U.S. location | PENDING | Must exercise worldwide OSM path |
| PWA installation | PENDING | Must verify manifest, installability, and project-relative paths |
| `/Harmless-/` production path | VERIFIED BY CI/DEPLOYMENT | Pages workflow builds with `VITE_BASE_PATH=/Harmless-/` |
| Offline / poor network | PENDING | Must verify cached/static shell and clear upstream-unavailable messaging |
| Provider outage / rate limit | PENDING | Must verify timeout, retry, rate-limit, and normalized failure states |
| Pill malformed/ambiguous/no/multiple match | PENDING | Must exercise external imprint lookup failure modes |
| Sensitive-input privacy regression | VERIFIED BY CONTRACT TESTS | No application-managed profile or image upload path is allowed |

A PENDING item is not a failed test. It means the evidence must be collected against the real deployment before a release is described as fully deployment-verified.
