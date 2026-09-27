# Whitney Component Library

React and TypeScript components with shared styles and keyboard behavior.

Use the [component guide](dist/agent-index.md) to choose a component. It ships with the package
and is exported as `@trwhitney/component-library/agent-index.md`.

Import the stylesheet once and wrap your application in `AppearanceProvider`:

```tsx
import '@trwhitney/component-library/styles.css';
import {AppearanceProvider, TextField} from '@trwhitney/component-library';

export function App() {
  return (
    <AppearanceProvider appearance="light" accent="#2878ff">
      <TextField label="Name" />
    </AppearanceProvider>
  );
}
```

Use the package's public props. The underlying React Aria APIs are private. Applications own
routing, data, persistence, and page layout.

The package is ESM. React and React DOM are peer dependencies; supported versions are listed in
`package.json`.
