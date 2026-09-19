# Visual character

## Destination

Recover the library's visual character and prove its appropriate use in the application demos before
the next foundation ticket. Explore noticeable idle depth as well as active emphasis.

## Current state

Complete. Validation and both independent review axes pass. Whitney accepted Study 3 and authorized implementation. Both
[the library ticket](tickets/01-library-visual-character.md) and
[demo adoption](tickets/02-demo-adoption.md) are complete.

## Progress

Surface owns low base and stronger raised shadows. FocusField owns responsive atmosphere behind
a Surface selected with focusFieldAnchor; applications supply isActive and own layout. Typed
exports, canonical contracts, generated docs and the human showcase explain composition and use.
All three demos consume the public components. Fieldnotes preserves the accepted composition.
The isolated study retains its original baseline for comparison.

## Verification

[Validation evidence](validation.md) records passing repository checks with 1,196 tests, packed
React 18/19 verification, all demo and showcase builds, direct browser review/export and emphasis
operation, responsive/theme inspection, and Chromium/Firefox commissioning layout regression.
Review corrections for hidden-view spacing, text-only reflow and inherited direction changes
pass their regression checks and bounded independent correction reviews.

## Accepted sources

- Whitney's clarification that panel anchoring is a general rule, Included documents is the anchor
  here, and offset must preserve glow in every direction.
- Whitney's clarification that emphasis should adjust to available frame space.
- Whitney's authorization to adjust spacing and grouping while retaining compact controls.
- Whitney's feedback on haphazard emphasis, conflicting depth cues, and insufficient depth and rails.
- [Original visual decision](../library-foundation/decisions/05-visual-direction.md)
- [Original interactive reference](../library-foundation/prototypes/visual-directions.html)
- [Reusable concept boundary](../../docs/adr/0012-own-reusable-concepts-not-applications.md)
- [Study and run instructions](prototypes/study.md)

## Out of scope

Header Route, application-shell components, theme customization, continuous idle motion, and the
next foundation ticket.

## Delivery

- `16d757f` [Feature] Add responsive panel emphasis
- `912e5ef` [Feature] Restore depth in publication review
- `0e3a04a` [Feature] Emphasize energy refresh
- The commit containing this completed record delivers [Feature] Emphasize commissioning review.

All task-owned changes are committed on main. No history was squashed or pushed. The next
foundation ticket remains separate work.

## Continuation

This effort is complete; no active workflow remains. The accepted study, specification, public
contracts and validation record provide the continuation sources for later library work.
Preview user services: wcl-visual-study on 5180, wcl-fieldnotes on 5176, wcl-showcase on 5173,
wcl-energy on 5177, and wcl-workbench on 5178. Stop an unneeded preview with
`systemctl --user stop <service-name>.service`.
