# FileTrigger

FileTrigger acquires application-managed files through a named native-picker action.

## Use for

- files should be chosen through the native picker and a persistent drag or paste target would add unnecessary prominence

## Do not use for

- drag or paste acquisition, upload progress, remote storage, persistence, file editing, directory traversal, or displaying an acquired-file collection

## Prefer instead

- Use DropZone when drag, paste, and picker paths should share one persistent target, or a later collection component to review and remove already acquired files.

## Composition and parts

- Render FileTrigger inside AppearanceProvider. Provide type and size constraints with matching guidance, then handle accepted File objects in onFiles.
- FileTrigger includes one secondary action, hidden native file input, and fixed support area.

## Preferred higher-level compositions

- Pass accepted files to the workflow responsible for upload, storage, asset insertion, or local processing.

## Content

- Use an action label that names what will be chosen; state accepted types, multiplicity, and maximum per-file size in description whenever constrained.

## States

- Idle, focused, disabled, invalid, pending, accepted, and rejected states are visually distinct. Results do not become selected-file state.

## Control, events, validation, and forms

- Each picker selection returns accepted files, rejected files with reasons, and the picker source. The browser creates each File object, and the application manages it.
- onFiles reports accepted and rejected browser File objects after a non-cancelled picker selection; cancellation produces no callback, and getAnnouncement supplies localized live-region copy.
- acceptedFileTypes checks MIME types, wildcards, and filename extensions; maxFileSize is a per-file byte limit; multiplicity rejects the whole multi-file attempt when allowsMultiple is false.
- The hidden picker has no name and does not submit files. Native form reset clears picker state and feedback without calling onFiles or changing File references held by the application.

## Accessibility

- FileTrigger exposes one correctly named button backed by a hidden native file input; generated description, invalid, pending, and result-announcement relationships require no consumer-authored ids.

## Keyboard, labeling, localization, and direction

- Tab reaches the named action and Enter or Space opens the native picker; disabled and pending states prevent another picker request without moving focus.
- label names the action rather than using a generic "Browse." description explains constraints, errorMessage explains application errors, and getAnnouncement localizes each result.
- Localize labels, descriptions, errors, pending text, action labels, and getAnnouncement output. Explain file type and byte constraints in human-readable text.
- The action and support text follow inherited writing direction. File order stays unchanged.

## Appearance and responsive behavior

- FileTrigger uses the standard secondary action and a support area for guidance, errors, pending work, and results. Set reserveSupportSpace={false} to omit the empty row; the default reserves space for feedback.
- The control fills its parent, wraps guidance, and keeps the picker action usable without horizontal overflow on narrow screens.

## Accent, forced colors, and reduced motion

- Focus uses a more saturated version of the accent hue. Invalid and rejected-file feedback use danger colors.
- Forced colors use system colors and non-color cues for the picker action, focus, invalid state, and rejected files.
- Reduced motion removes pending transitions while retaining settled pending structure and live announcements.

## Examples

### Choose reference images

Choose several size-limited image files without implying what happens next.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, FileTrigger} from '@trwhitney/component-library';

export function ReferenceImageTrigger() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <FileTrigger acceptedFileTypes={['image/png', '.jpg']} allowsMultiple description="PNG or JPG, up to 2 MB each." label="Choose reference images" maxFileSize={2000000} onFiles={() => undefined} getAnnouncement={({files, rejectedFiles}) => `${files.length} accepted; ${rejectedFiles.length} rejected.`} />
    </AppearanceProvider>
  );
}
```

## Counterexamples

### Do not promise acquisition modes the trigger does not provide

A workflow that advertises dropping or pasting needs a persistent DropZone.

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, FileTrigger} from '@trwhitney/component-library';

export function PersistentDropTargetCounterexample() {
  return (
    <AppearanceProvider appearance="dark" accent="#2878ff">
      <FileTrigger label="Drop or choose evidence" onFiles={() => undefined} getAnnouncement={({files, rejectedFiles}) => `${files.length} accepted; ${rejectedFiles.length} rejected.`} />
    </AppearanceProvider>
  );
}
```
