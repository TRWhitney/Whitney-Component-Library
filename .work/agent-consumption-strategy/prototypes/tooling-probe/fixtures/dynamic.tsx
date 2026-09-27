import {AppearanceProvider, Switch} from '@trwhitney/component-library';

// Computed empty labels are outside the diagnostic's literal-only boundary.
export function DynamicLabel() {
  const label = [''].join('');
  return (
    <AppearanceProvider appearance="light" accent="#123456">
      <Switch label={label} />
    </AppearanceProvider>
  );
}
