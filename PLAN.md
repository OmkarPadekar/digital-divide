# Execution Plan: Digital Divide Frontend

Goal: a frontend-only site (no backend, no database) that explains the digital divide as a multi-layered framework (infrastructure, digital literacy, affordability, socio-economic outcomes) using charts and interactive visuals.

## Phases (v1 draft)

| Phase | Scope | Output |
|---|---|---|
| 0. Discovery | Define audience, story, data shape | Content outline, illustrative dataset |
| 1. Design system | Color, type, spacing, components | CSS tokens |
| 2. Layout | Page structure and navigation | Static page |
| 3. Data visuals | Charts for each question the framework answers | SVG charts |
| 4. Interaction | Explorer, tabs, sliders | Live scoring |
| 5. Quality | Accessibility, performance, responsiveness | Audit pass |
| 6. Ship | Push to GitHub, enable Pages | Live URL |

## UX refactor (Apple-style frontend review)

Review lens: an Apple-style frontend engineer's principles of clarity, deference (content over chrome) and depth (hierarchy through layering and motion). This is a design review approach, not an Apple product.

Findings on the v1 build and changes made:

| v1 problem | Refactor |
|---|---|
| Explainer and tool compete on one screen | One idea per screen: hero, layers, explorer, comparison, drop-off, trend, method |
| Only one chart (horizontal bars) | Five visuals, each answering one question (see below) |
| No persistent navigation | Frosted sticky nav with section links |
| Dense type, weak hierarchy | Large display headline, short subheads, generous spacing |
| Tab and slider state not shared | Single state drives hero ring, radar and scores |
| Color used decoratively | Fixed color per layer everywhere, so color always means the same layer |
| Motion absent or scattered | One reveal per chart on scroll; honors reduced motion |
| Charts not described for screen readers | Each chart has a text summary label |

## Visual map

| Question | Visual |
|---|---|
| How does a place score overall? | Concentric activity rings (hero) |
| Where is the shape of the gap? | Radar chart vs national average |
| What does a single metric hide? | Grouped bars: access-only vs layered |
| Where do people drop out? | Funnel: covered, can afford, can use, benefit |
| Is the gap closing? | Line chart 2018 to 2025 by layer |

## Phases (refactored, with status)

- [x] Phase 0: story and illustrative data model
- [x] Phase 1: design tokens (system font stack, layer colors, light and dark)
- [x] Phase 2: sticky nav, hero, one-idea sections
- [x] Phase 3: rings, radar, grouped bars, funnel, line chart (vanilla SVG, no libraries)
- [x] Phase 4: shared state between profile selector, sliders and all visuals
- [x] Phase 5: keyboard focus, labels, reduced motion, responsive layout, dark mode
- [x] Phase 6: GitHub push and Pages deploy

## Next
- Replace illustrative data with a sourced dataset (for example ITU or national surveys)
- Add per-layer indicator drill-down
- Add CSV export
