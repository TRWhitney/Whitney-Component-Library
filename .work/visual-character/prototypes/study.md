# Publication review: space for depth

## Decision

Does a composition with separate document and publication regions restore noticeable, coherent depth
while keeping the controls compact? This third study is limited to Fieldnotes' review view.

Whitney authorized changes to spacing and grouping around major regions. The first study's broad
emphasis and gradients confused elevation in dense layouts. The second removed the perceived depth
and substituted accent rails that failed to meet the intent. Neither is an accepted direction.

## Design proposal

- Preserve the library's palette. Light canvas #e9edef supports white #ffffff document and publication
  surfaces. Dark canvas #11171b supports a #182126 document surface and a #202b31 raised publication
  panel. Neutral text and borders use their existing tokens. Application accent remains the existing
  Fieldnotes blue; semantic stage colors stay independent.
- Keep existing compact controls and body typography. A 28px sans heading names the overall task;
  17px and 20px headings distinguish document review and publication status. Existing 11px monospace
  identifies the field guide, document count, and publication role.
- The broad document surface contains the actual review list. The smaller publication panel groups
  stage progression, readiness, and export. Grouping follows the relationship between reviewing the
  source documents and producing the guide.
- Give the publication panel 24px of surrounding space and a stronger downward shadow. The document
  surface has a lower, shorter shadow. Faces are opaque and solid. No gradients change the apparent
  height within a panel; no colored rails replace depth.
- Idle depth remains visible without glow. In the emphasized state, anchor the atmosphere to a
  panel chosen for the composition. Here that panel is Included documents. Its center shifts
  slightly toward available space, excluding the publication panel. Spread is independent of this
  offset and scales with the document panel and its frame. The glow retains the same radial falloff
  in every direction. A soft blur replaces the frame-edge masks that previously suppressed the
  upper and side glow. Geometry is recalculated on resize and content changes.
  Panel positions, fills, and shadows stay identical between idle and emphasized states.
  Replay start briefly blooms the shared field once; idle does not animate.
- Below 1250px, the document review and publication panel stack in reading order. Compact controls
  retain their sizing. Smaller screens scroll to reach publication and export. Reduced motion
  disables the atmospheric animation; forced colors removes atmosphere and shadows.

## Critique and boundaries

This composition changes grouping and available space instead of spreading effects across dense
existing regions. Its atmosphere responds to the space available around opaque foreground panels. Elevation has one direction and a named owner.

The document list and publication state are real demo interactions, not screenshot content.
Current/Proposed changes presentation while the original app retains reviewed versions, inclusion,
and export state. The custom review component is resolved only by the isolated study server.
Regular demo scripts and library components remain unchanged. Other Fieldnotes views retain their
current presentation, and the study now opens directly to Review & export.

The study does not settle a reusable component API, application-wide styling, or Header Route.
It also does not claim that rendering without errors establishes visual success. Whitney's reaction
must establish whether the idle depth and active character meet the original intent.

## Run and inspect

From the repository root:

```sh
npm run build
node node_modules/vite/bin/vite.js --config .work/visual-character/prototypes/vite.config.ts
```

Open http://localhost:5180/.work/visual-character/prototypes/index.html.
The heading identifies Study 3, Publication review. Compare Current/Proposed, light/dark, and
Idle/Emphasized. Replay start demonstrates the atmospheric transition. Identify elements names the
Document review surface, Responsive review atmosphere, and Raised publication panel on hover; controls
also report names on keyboard focus.

Mark a document reviewed, switch Current/Proposed, and confirm the review remains. Review all three
included documents to enable Export field guide. Export downloads the actual Markdown guide and
updates the publication status. On phones, scroll the content region to reach publication.

## Result

Whitney accepted the corrected appearance and authorized library implementation after reviewing
the summary of depth, atmosphere, sizing, placement, and grouping. These qualities are binding. See [status](../status.md) for verification evidence and continuation.

Earlier treatments failed through obscured glow, small isolated coverage, and poor placement.
Anchoring the field to the publication panel also failed. Whitney clarified that Included documents
is the appropriate anchor in this composition and that an offset must preserve glow in every
direction. The accepted revision applies that rule. Its geometry implementation is flexible; the visual
relationship, compact controls, opaque faces, and all-direction spread must be preserved.
