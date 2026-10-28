# Digital Divide — Refactor Plan

## Goal

Create a clearer, multi-page frontend that explains the digital divide across infrastructure, digital literacy, affordability and socio-economic outcomes, while giving users an interactive way to compare and calculate scores.

## Delivered structure

| Page | Purpose |
|---|---|
| `index.html` | Overview, framework introduction and entry points |
| `explore.html` | Profile selector, interactive concentric rings, calculator sliders and radar comparison |
| `compare.html` | Access-only vs layered bars, drop-off funnel and 2018–2025 trend |
| `method.html` | Framework definitions and scoring formula |
| `login.html` | Polished sign-in flow with local browser session state |

## Key design decisions

- Separate each idea into its own page rather than one long scrolling document.
- Preserve the original minimal, layered visual language while adding stronger spacing, page hierarchy and responsive cards.
- Keep one stable color for each layer across all charts.
- Make the selected ring state explicit: clicking or keyboard-selecting a ring highlights it, places its score in a non-overlapping badge on the ring, updates the center label and updates the detail panel.
- Keep the overall layered score in the chart center and show the access-only score beside it in the calculator.
- Use frontend-only login behavior with local storage; no credentials or personal data are sent anywhere.
- Respect reduced-motion preferences.

## Data note

Current values remain illustrative, as in the original repository. The method page calls out where sourced indicators should replace them for research use.
