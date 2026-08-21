# FileTrigger

FileTrigger acquires consumer-owned files through a named native-picker action.

## Use for

- files should be chosen through the native picker and a persistent drag or paste target would add unnecessary prominence

## Do not use for

- drag or paste acquisition, upload progress, remote storage, persistence, file editing, directory traversal, or displaying an acquired-file collection

## Prefer instead

- Use DropZone when drag, paste, and picker paths should share one persistent target, or a later collection component to review and remove already acquired files.

## Composition and parts

- Render FileTrigger inside AppearanceProvider, provide explicit type and size constraints with matching human guidance, and transfer accepted File references to application logic through onFiles.
- FileTrigger owns one secondary action, hidden native file input, and stable support track.

## Preferred higher-level compositions

- Compose the accepted files into a workflow that explicitly owns upload, storage, asset insertion, or local processing.

## Content

- Use an action label that names what will be chosen; state accepted types, multiplicity, and maximum per-file size in description whenever constrained.

## States

- Idle, focused, disabled, invalid, pending, accepted, and rejected states remain distinct; a result does not become an owned selected-file state.

## Control, events, validation, and forms

- Each picker selection produces one immutable result with accepted files, rejected files and their reasons, and the picker source; File objects remain browser-created and consumer-owned.
- onFiles reports accepted and rejected browser File objects after a non-cancelled picker selection; cancellation produces no callback, and getAnnouncement supplies localized live-region copy.
- acceptedFileTypes checks MIME types, wildcards, and filename extensions; maxFileSize is a per-file byte limit; multiplicity rejects the whole multi-file attempt when allowsMultiple is false.
- The hidden picker deliberately has no name and does not serialize files; native form reset clears browser picker state and component feedback without recalling onFiles or changing consumer-owned File references.

## Accessibility

- FileTrigger exposes one correctly named button backed by a hidden native file input; generated description, invalid, pending, and result-announcement relationships require no consumer-authored ids.

## Keyboard, labeling, localization, and direction

- Tab reaches the named action and Enter or Space opens the native picker; disabled and pending states prevent another picker request without moving focus.
- label is the action name rather than a generic “Browse”; description explains constraints, errorMessage explains external invalidity, and getAnnouncement localizes each accepted or rejected result.
- Supply localized labels, descriptions, errors, pending copy, action labels, and getAnnouncement output; file type strings and byte limits remain machine constraints and need matching human guidance.
- The action and support copy follow inherited writing direction while consumer-owned file order remains unchanged.

## Appearance and responsive behavior

- FileTrigger uses the standard secondary action geometry with one stable support track for guidance, errors, pending work, and acquisition results.
- The control fills a bounded parent, wraps its guidance, and keeps its picker action operable without horizontal overflow at compact widths.

## Accent, forced colors, and reduced motion

- Focus uses saturated same-hue structure; invalidity and rejected-file feedback remain dangerous rather than becoming the application accent.
- Forced colors preserve the picker action, focus, invalid state, and rejected-file state with system colors and non-color structure.
- Reduced motion removes pending transitions while retaining settled pending structure and live announcements.

## Examples

### Choose reference images

Choose several bounded image files without implying what happens after acquisition.

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
