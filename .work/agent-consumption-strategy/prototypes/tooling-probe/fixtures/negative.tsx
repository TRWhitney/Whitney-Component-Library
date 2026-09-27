import {AppearanceProvider, Switch as Setting} from '@trwhitney/component-library';

// A provider in a different branch makes the file-presence heuristic inconclusive.
export function UnrelatedProvider() {
  return (
    <AppearanceProvider appearance="light" accent="#123456">
      <p>Other subtree</p>
    </AppearanceProvider>
  );
}
export function EmptyLabel() {
  return <Setting label="" defaultSelected />;
}
// Semantic misuse is intentionally undetected: a submitted acknowledgement uses Switch.
export function Acknowledgement() {
  return (
    <form>
      <Setting label="I accept the terms" name="terms" />
      <button>Submit</button>
    </form>
  );
}
