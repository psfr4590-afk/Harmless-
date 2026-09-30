# Harm.Less Beta Testing

Harm.Less is intended for people anywhere in the world who have a cellphone and need practical harm-reduction information or help finding local support.

## What beta testers should test

Use a real phone when possible. Test the application in your actual country and region.

1. Open the app and verify that it loads cleanly.
2. Test the location permission flow.
3. Deny location permission and verify that manual location search still works.
4. Test at least three local-resource categories.
5. Test at least one category that is likely to have sparse local data.
6. Test both a larger city and a smaller/rural location when practical.
7. Verify that result names, addresses, phone numbers, websites, sources, and retrieval information are understandable.
8. If no results appear, verify that Harm.Less says the directory may be incomplete rather than claiming that help does not exist.
9. Test crisis/support links and confirm that they do not assume a U.S.-specific emergency number in another country.
10. Test the interaction checker with a known pair and with an unknown pair. Unknown evidence must remain explicitly unverified.
11. Test the pill-image workflow and verify that the app does not unexpectedly upload the selected image.
12. Test the app on both a modern Android/iPhone browser and a desktop browser if available.

## Report a problem

For each problem, record:

- Country and approximate region. Do not include a precise home address.
- Device and browser.
- Feature or resource category.
- GPS or manual location.
- What you expected.
- What Harm.Less actually displayed.
- Whether an external source was unavailable.
- Screenshot if it does not reveal private information.

Do not post personal medical information, names, phone numbers, exact addresses, or other sensitive information in a public issue.

## What counts as a release blocker

Treat these as release-blocking:

- A resource is presented as real when it was not returned by a connected source.
- Missing data is presented as proof that help does not exist.
- A country-specific emergency number is presented as universal.
- A safety-critical evidence failure is displayed as a reassuring result.
- A selected pill image is unexpectedly uploaded.
- A resource category consistently fails in locations where its connected sources provide data.
- The application cannot load or recover from a normal upstream service failure.

Beta testing is not a substitute for automated verification. It is the final layer for browser, device, geographic, and real-world behavior that CI cannot prove.
