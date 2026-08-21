# DropZone

DropZone accepts application-managed files through drag, paste, or a native picker.

## Use for

- drag, paste, and native-picker acquisition should share one persistent and clearly explained file target

## Do not use for

- upload or storage ownership, directory traversal, free-form text paste, sortable acquired-file collections, or a picker-only action that does not need a persistent target

## Prefer instead

- Use FileTrigger for picker-only acquisition and a later collection component to review, reorder, or remove acquired files.

## Composition and parts

- Render DropZone inside AppearanceProvider; optional children may add concise domain context but cannot replace its required label, description, constraints, action, or callback.
- DropZone includes an accessible target, active border, named file-icon picker action, label and optional content, hidden native input, and fixed support area.

## Preferred higher-level compositions

- Pass accepted files to the application's Markdown asset callback, upload workflow, local parser, or file collection.

## Content

- Use label for the target purpose and actionLabel for the picker command; state accepted types, multiplicity, and maximum per-file size in description whenever constrained.

## States

- Idle, hovered, focused, active drag target, accepted, rejected, invalid, disabled, and pending states are distinguishable without color alone.

## Control, events, validation, and forms

- Picker, drop, and paste return the same accepted and rejected result shape. The control rejects non-file transfers. The application manages the browser-created File objects.
- onFiles reports accepted and rejected files with picker, drop, or paste source; getAnnouncement supplies localized result copy, and no upload or persistence event is implied.
- acceptedFileTypes, maxFileSize, and allowsMultiple apply identically after every acquisition path; per-file type and size reasons are reported and a disallowed multi-file attempt accepts none.
- DropZone does not submit files as a form control. Native reset clears its picker and feedback without calling onFiles or changing application-held files.

## Accessibility

- DropZone exposes one labeled drop affordance for pointer, keyboard, and assistive-technology drag operations plus one distinctly named file-icon picker action and localized live result feedback.

## Keyboard, labeling, localization, and direction

- Tab reaches the drop affordance and file-icon picker action; keyboard drag-and-drop follows the platform announcement path, paste is accepted while the affordance is focused, and Enter or Space on the named icon action opens the native picker.
- label names the drop target, actionLabel names the picker command, description explains constraints, and generated error, pending, and announcement relationships require no consumer ids.
- Localize labels, descriptions, errors, pending text, action labels, and getAnnouncement output. Explain file type and byte constraints in human-readable text.
- Text, icon-action placement, and the active border follow inherited writing direction. File order stays unchanged.

## Appearance and responsive behavior

- DropZone uses a neutral dashed border and a compact file icon as its picker action. The original glyph moves only on enabled pointer hover without adding a hover container or leaving a transformed focus state. Disabled targets and picker actions remain visually inert, while focus, valid drag target, rejection, invalid, and pending states use distinct shapes or colors.
- The control fills its parent, wraps guidance and custom content, and keeps the icon action beside its label without horizontal overflow on narrow screens.

## Accent, forced colors, and reduced motion

- Focus and the active drop border use a more saturated version of the accent hue. Invalid and rejected-file feedback use danger colors.
- Forced colors use system colors and non-color cues for the icon action, focus border, active drop target, invalid state, and rejected files.
- Reduced motion removes icon-action, active-boundary, and pending transitions while retaining their settled structure and live announcements.

## Examples

### Acquire evidence files

Accept picker, drop, and paste input through one target.

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
