# DropZone

DropZone unifies drag, paste, and native-picker acquisition of consumer-owned files.

## Use for

- drag, paste, and native-picker acquisition should share one persistent and clearly explained file target

## Do not use for

- upload or storage ownership, directory traversal, free-form text paste, sortable acquired-file collections, or a picker-only action that does not need a persistent target

## Prefer instead

- Use FileTrigger for picker-only acquisition and a later collection component to review, reorder, or remove acquired files.

## Composition and parts

- Render DropZone inside AppearanceProvider; optional children may add concise domain context but cannot replace its required label, description, constraints, action, or callback.
- DropZone owns one accessible target, active boundary, file glyph, label and optional content, named picker action, hidden native input, and stable support track.

## Preferred higher-level compositions

- Pass accepted files to a consumer-owned Markdown asset-insertion callback, upload workflow, local parser, or acquired-file collection.

## Content

- Use label for the target purpose and actionLabel for the picker command; state accepted types, multiplicity, and maximum per-file size in description whenever constrained.

## States

- Idle, hovered, focused, active drag target, accepted, rejected, externally invalid, disabled, and pending states remain distinct without color-only meaning.

## Control, events, validation, and forms

- Picker, drop, and paste paths converge on the same immutable accepted/rejected result model; non-file transfers are not accepted, and browser File objects remain consumer-owned.
- onFiles reports accepted and rejected files with picker, drop, or paste source; getAnnouncement supplies localized result copy, and no upload or persistence event is implied.
- acceptedFileTypes, maxFileSize, and allowsMultiple apply identically after every acquisition path; per-file type and size reasons are reported and a disallowed multi-file attempt accepts none.
- DropZone does not serialize files or become a successful form control; native reset clears its picker and visible acquisition feedback without recalling onFiles or mutating consumer-owned files.

## Accessibility

- DropZone exposes one labeled drop affordance for pointer, keyboard, and assistive-technology drag operations plus one distinctly named native-picker action and localized live result feedback.

## Keyboard, labeling, localization, and direction

- Tab reaches the drop affordance and picker action; keyboard drag-and-drop follows the platform announcement path, paste is accepted while the affordance is focused, and Enter or Space on the named picker action opens the native picker.
- label names the drop target, actionLabel names the picker command, description explains constraints, and generated error, pending, and announcement relationships require no consumer ids.
- Supply localized labels, descriptions, errors, pending copy, action labels, and getAnnouncement output; file type strings and byte limits remain machine constraints and need matching human guidance.
- Copy, action placement, and the route-like active boundary follow inherited writing direction while consumer-owned file order remains unchanged.

## Appearance and responsive behavior

- DropZone uses a neutral dashed route boundary, a compact file glyph, and the standard secondary picker action; focus, valid drag target, rejection, invalidity, disabled, and pending treatments remain structurally distinct.
- The control fills a bounded parent, wraps guidance and custom content, and keeps its action operable without horizontal overflow at compact widths.

## Accent, forced colors, and reduced motion

- Focus and the active drop boundary use saturated same-hue structure; invalidity and rejected-file feedback remain dangerous rather than becoming the application accent.
- Forced colors preserve the action, focus boundary, active drop target, invalid state, and rejected-file state with system colors and non-color structure.
- Reduced motion removes active-boundary and pending transitions while retaining their settled structure and live announcements.

## Examples

### Acquire evidence files

Unify the three browser file-acquisition paths under one bounded target.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DropZone} from '@trwhitney/component-library';

export function EvidenceDropZone() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <DropZone acceptedFileTypes={['image/*', 'application/pdf']} actionLabel="Browse evidence" allowsMultiple description="Drop, paste, or browse for images and PDFs up to 10 MB each." label="Evidence" maxFileSize={10000000} onFiles={() => undefined} getAnnouncement={({files, rejectedFiles}) => `${files.length} accepted; ${rejectedFiles.length} rejected.`} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not present acquisition as upload

Acquisition does not define upload timing, progress, retry, or persistence.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, DropZone} from '@trwhitney/component-library';

export function UploadProgressCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <DropZone actionLabel="Upload evidence" description="Uploads immediately." label="Evidence upload" onFiles={() => undefined} getAnnouncement={({files, rejectedFiles}) => `${files.length} accepted; ${rejectedFiles.length} rejected.`} />
    </AppearanceProvider>
  );
}
```
