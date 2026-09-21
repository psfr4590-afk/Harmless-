# Harm.Less

> A privacy-conscious harm-reduction companion for people seeking practical safety information and real-world support.

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

The application distinguishes documented evidence from unknown, unavailable, or insufficient evidence. A missing interaction record is not presented as proof of safety. Source links and review metadata are exposed where applicable.

Live integrations currently include NLM RxNorm, FDA openFDA drug labeling, and SAMHSA FindTreatment.gov. External services are queried only when the relevant feature is used.

## Privacy

Harm.Less does not require an account or application-managed cloud profile.

Some features communicate with external public services. In particular, location-based resource searches can transmit location information to the selected search providers. The application presents disclosures before relevant use.

Do not enter secrets, credentials, or unnecessary personal information into external searches.

## Technology

React · TypeScript · Vite · Tailwind CSS · Framer Motion · local browser APIs

## Development

Requires Node.js 20.

    npm ci
    npm run dev

Open the local Vite development address shown by the command.

## Verification

    npm run lint
    npm test
    npm run build

GitHub Actions runs the verification suite on pushes to `main` and pull requests.

Runtime/browser verification is environment-dependent and should be performed in the deployment environment before a production release.

## Project documentation

- [Contributing](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [License](LICENSE)

## Scope

Harm.Less provides educational harm-reduction information and access to resources. It does not replace emergency services, medical diagnosis, treatment, or professional legal advice.

If someone is in immediate danger, contact local emergency services.
