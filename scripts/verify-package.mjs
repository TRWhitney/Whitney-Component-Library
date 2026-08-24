import {execFileSync} from 'node:child_process';
import {mkdtemp, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';

import {
  findBrowserBundleHazards,
  findNodeOnlyReferences,
  findStyleImports,
} from './package-safety.mjs';
import {createConsumerVerificationSource} from './consumer-verification-source.mjs';

const projectRoot = resolve(import.meta.dirname, '..');
const packageJson = JSON.parse(await readFile(resolve(projectRoot, 'package.json'), 'utf8'));
const temporaryRoot = await mkdtemp(join(tmpdir(), 'wcl-package-verification-'));

try {
  execFileSync('npm', ['pack', '--pack-destination', temporaryRoot], {
    cwd: projectRoot,
    stdio: 'inherit',
  });

  const archiveName = (await readdir(temporaryRoot)).find((name) => name.endsWith('.tgz'));
  if (!archiveName) {
    throw new Error('npm pack did not produce an archive.');
  }
  const archivePath = resolve(temporaryRoot, archiveName);

  await assertBrowserSafeDistribution(resolve(projectRoot, 'dist'));

  for (const reactVersion of ['18.3.1', '19.2.8']) {
    await verifyConsumer({
      archivePath,
      packageName: packageJson.name,
      reactVersion,
      tooling: packageJson.devDependencies,
      viteVersion: packageJson.devDependencies.vite,
      workspace: resolve(temporaryRoot, `react-${reactVersion}`),
    });
    process.stdout.write(
      `Packed SSR, hydration, types, and browser build verified with React ${reactVersion}.\n`,
    );
  }
} finally {
  await rm(temporaryRoot, {force: true, recursive: true});
}

async function assertBrowserSafeDistribution(directory) {
  const files = await walk(directory);

  for (const file of files.filter((candidate) => candidate.endsWith('.js'))) {
    const source = await readFile(file, 'utf8');
    assertNoNodeReferences(source, file);
    if (findStyleImports(source).length > 0) {
      throw new Error(
        `JavaScript imports static styles instead of using the CSS subpath in ${file}.`,
      );
    }
  }

  for (const file of files.filter((candidate) => candidate.endsWith('.d.ts'))) {
    const declaration = await readFile(file, 'utf8');
    if (declaration.includes('react-aria')) {
      throw new Error(`Public declarations expose the private React Aria foundation in ${file}.`);
    }
  }
}

async function verifyConsumer({
  archivePath,
  packageName,
  reactVersion,
  tooling,
  viteVersion,
  workspace,
}) {
  const reactTypes = reactVersion.startsWith('18.')
    ? {react: '18.3.31', reactDom: '18.3.7'}
    : {react: tooling['@types/react'], reactDom: tooling['@types/react-dom']};
  await import('node:fs/promises').then(({mkdir}) => mkdir(workspace, {recursive: true}));
  await writeFile(
    resolve(workspace, 'package.json'),
    `${JSON.stringify(
      {
        name: `wcl-react-${reactVersion}-consumer`,
        private: true,
        type: 'module',
        dependencies: {
          [packageName]: `file:${archivePath}`,
          '@types/react': reactTypes.react,
          '@types/react-dom': reactTypes.reactDom,
          jsdom: tooling.jsdom,
          react: reactVersion,
          'react-dom': reactVersion,
          typescript: tooling.typescript,
          vite: viteVersion,
        },
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(resolve(workspace, 'verify.mjs'), createConsumerVerificationSource(packageName));
  await writeFile(
    resolve(workspace, 'index.html'),
    '<!doctype html><html><body><div id="root"></div><script type="module" src="/main.jsx"></script></body></html>\n',
  );
  await writeFile(resolve(workspace, 'main.jsx'), createBrowserConsumerSource(packageName));
  await writeFile(resolve(workspace, 'public-api.tsx'), createTypeConsumerSource(packageName));
  await writeFile(
    resolve(workspace, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          jsx: 'react-jsx',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          noEmit: true,
          strict: true,
          target: 'ES2022',
        },
        files: ['./public-api.tsx'],
      },
      null,
      2,
    )}\n`,
  );

  execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], {
    cwd: workspace,
    stdio: 'inherit',
  });
  execFileSync(process.execPath, ['verify.mjs'], {cwd: workspace, stdio: 'inherit'});
  execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json'], {
    cwd: workspace,
    stdio: 'inherit',
  });
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], {
    cwd: workspace,
    stdio: 'inherit',
  });

  const browserFiles = await walk(resolve(workspace, 'dist'));
  const builtStyles = await Promise.all(
    browserFiles.filter((file) => file.endsWith('.css')).map((file) => readFile(file, 'utf8')),
  );
  if (!builtStyles.some((styles) => styles.includes('--wcl-canvas'))) {
    throw new Error('The clean browser consumer did not load the explicit stylesheet subpath.');
  }
  const combinedStyles = builtStyles.join('\n');
  for (const requiredRule of ['prefers-reduced-motion:reduce', 'forced-colors:active']) {
    if (!combinedStyles.includes(requiredRule)) {
      throw new Error(`The built stylesheet omitted ${requiredRule}.`);
    }
  }
  for (const file of browserFiles.filter((candidate) => candidate.endsWith('.js'))) {
    const browserSource = await readFile(file, 'utf8');
    const hazards = findBrowserBundleHazards(browserSource);
    if (hazards.length > 0) {
      throw new Error(
        `Built browser output retains a Node-only module in ${file}: ${hazards.join(', ')}.`,
      );
    }
  }
}

function createTypeConsumerSource(packageName) {
  return `
import {
  AlertBanner,
  AppearanceProvider,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  DateField,
  DatePicker,
  DateRangePicker,
  Divider,
  Field,
  FieldGroup,
  FormSection,
  IconButton,
  InlineAlert,
  InlineGroup,
  Link,
  Meter,
  NumberField,
  ProcessTracker,
  ProgressBar,
  RadioGroup,
  RangeSlider,
  ResponsiveGrid,
  ScrollRegion,
  SearchField,
  Section,
  Select,
  SegmentedControl,
  Slider,
  Spinner,
  Stack,
  StatusIndicator,
  Surface,
  Switch,
  TextArea,
  TextField,
  TimeField,
  ToggleButton,
  Toolbar,
  type AccentColor,
  type LayoutGap,
} from '${packageName}';

const accent: AccentColor = '#2474ff';
const gap: LayoutGap = 'regular';
const choiceOptions = [
  {label: 'Conservative', value: 'conservative'},
  {label: 'Balanced', value: 'balanced'},
] as const;
export const provider = (
  <AppearanceProvider appearance="dark" accent={accent}>
    <Surface variant="raised">
      <Section title="Thermal envelope">
        <ResponsiveGrid minimumItemWidth="compact" equalItems>
          <Stack gap={gap}>
            <strong>Solver</strong>
            <span>Adaptive mesh</span>
          </Stack>
          <Stack gap="tight">
            <InlineGroup equalItems>
              <span>Ready</span>
              <span>Review</span>
            </InlineGroup>
            <Divider />
            <ScrollRegion label="Run history" size="compact">
              Iteration 0284
            </ScrollRegion>
          </Stack>
        </ResponsiveGrid>
        <Link href="/runs/0284">Open run</Link>
        <FormSection title="Solver setup">
          <FieldGroup legend="Boundary inputs">
            <TextField label="Run name" defaultValue="North chamber" />
            <NumberField label="Tolerance" locale="en-US" defaultValue={0.0025} />
            <SearchField label="Search runs" clearLabel="Clear query" />
            <TextArea label="Notes" rows={3} />
            <Field label="Queue">
              {(controlProps) => <select {...controlProps}><option>Standard</option></select>}
            </Field>
          </FieldGroup>
        </FormSection>
        <ButtonGroup label="Profile actions" equalItems>
          <Button>Review conditions</Button>
          <Button variant="primary" type="submit">Run profile</Button>
        </ButtonGroup>
        <Checkbox label="Include mesh" defaultSelected />
        <CheckboxGroup label="Layers" options={choiceOptions} defaultValue={['balanced']} />
        <RadioGroup
          label="Optional mode"
          options={choiceOptions}
          value={null}
          onChange={() => undefined}
        />
        <Switch label="Pin result" defaultSelected />
        <SegmentedControl label="Density" options={choiceOptions} defaultValue="balanced" />
        <Select
          label="Bounded mode"
          emptyMessage="No modes"
          options={choiceOptions}
          defaultValue="balanced"
        />
        <ComboBox
          label="Filter mode"
          emptyMessage="No matching modes"
          options={choiceOptions}
        />
        <DateField
          calendar="gregory"
          defaultValue={{year: 2026, month: 8, day: 20}}
          label="Run date"
          locale="en-US"
        />
        <TimeField
          defaultValue={{hour: 14, minute: 30, second: 0}}
          granularity="minute"
          hourCycle={24}
          label="Run time"
          locale="en-US"
        />
        <DatePicker
          calendar="japanese"
          calendarButtonLabel="Choose review date"
          label="Review date"
          locale="ja-JP"
          placeholderValue={{year: 2026, month: 8, day: 20}}
        />
        <DateRangePicker
          calendar="gregory"
          calendarButtonLabel="Choose review window"
          label="Review window"
          locale="en-US"
          placeholderValue={{year: 2026, month: 8, day: 20}}
        />
        <Slider
          defaultValue={0.4}
          formatOptions={{style: 'percent'}}
          label="Confidence"
          locale="en-US"
          maxValue={1}
          minValue={0}
          step={0.05}
        />
        <RangeSlider
          defaultValue={[20, 80]}
          label="Review window"
          locale="en-US"
          maxValue={100}
          minValue={0}
          step={5}
          thumbLabels={['Window start', 'Window end']}
        />
        <StatusIndicator announcement="polite" label="Solving" tone="warning" />
        <Badge tone="accent">RUN 0284</Badge>
        <ProcessTracker
          ariaLabel="Thermal solve stages"
          stages={[
            {id: 'geometry', label: 'Geometry validated', status: 'complete'},
            {id: 'boundary', label: 'Boundary pass', status: 'active'},
            {id: 'solve', label: 'Solve pending', status: 'pending'},
          ]}
          statusLabels={{
            active: 'Active',
            complete: 'Complete',
            failed: 'Failed',
            pending: 'Pending',
            warning: 'Needs review',
          }}
        />
        <InlineAlert title="Boundary review" tone="warning">
          Check the north wall coefficient.
        </InlineAlert>
        <AlertBanner title="Solver connected" tone="success">
          Runs can start.
        </AlertBanner>
        <ProgressBar
          completionLabel="Complete when all 25 boundary passes are solved."
          isActive
          label="Solving boundary passes"
          maxValue={25}
          minValue={0}
          value={18}
          valueLabel="18 of 25 passes"
        />
        <ProgressBar
          completionLabel="Complete after convergence."
          isActive
          isIndeterminate
          label="Preparing solver"
          statusLabel="Estimating remaining work"
        />
        <ProgressBar
          completionLabel="Complete when all 25 boundary passes are solved."
          isActive={false}
          label="Boundary solve paused"
          maxValue={25}
          minValue={0}
          value={18}
          valueLabel="18 of 25 passes"
        />
        <Meter
          label="Thermal load"
          maxValue={100}
          minValue={0}
          thresholds={[
            {label: 'Review begins', tone: 'warning', value: 70, valueLabel: '70 kilowatts'},
            {label: 'Unsafe begins', tone: 'danger', value: 90, valueLabel: '90 kilowatts'},
          ]}
          tone="warning"
          value={76}
          valueLabel="76 kilowatts"
        />
        <Spinner isActive label="Preparing solver" />
        <Toolbar label="Inspector commands">
          <IconButton label="More actions" variant="quiet">
            <span aria-hidden="true">•••</span>
          </IconButton>
          <ToggleButton defaultSelected variant="quiet">Pin inspector</ToggleButton>
        </Toolbar>
      </Section>
    </Surface>
  </AppearanceProvider>
);

// @ts-expect-error Exclusive values are bounded by the supplied literal options.
export const invalidChoice = <RadioGroup label="Mode" options={choiceOptions} value="unknown" onChange={() => undefined} />;

// @ts-expect-error Select values are bounded by the supplied literal options.
export const invalidSelection = <Select label="Mode" emptyMessage="No modes" options={choiceOptions} value="unknown" onChange={() => undefined} />;
`;
}

function assertNoNodeReferences(source, file) {
  const nodeReferences = findNodeOnlyReferences(source);
  if (nodeReferences.length > 0) {
    throw new Error(
      `Browser output contains Node-only references in ${file}: ${nodeReferences.join(', ')}.`,
    );
  }
}

function createBrowserConsumerSource(packageName) {
  return `
import React from 'react';
import {createRoot} from 'react-dom/client';
import {
  AlertBanner,
  AppearanceProvider,
  Badge,
  Button,
  ButtonGroup,
  ComboBox,
  DateField,
  DatePicker,
  DateRangePicker,
  FieldGroup,
  IconButton,
  InlineAlert,
  Link,
  Meter,
  NumberField,
  ProcessTracker,
  ProgressBar,
  RangeSlider,
  ResponsiveGrid,
  Section,
  Select,
  Slider,
  Spinner,
  StatusIndicator,
  Surface,
  TextField,
  TimeField,
  ToggleButton,
  Toolbar,
} from '${packageName}';
import '${packageName}/styles.css';

createRoot(document.getElementById('root')).render(
  React.createElement(
    AppearanceProvider,
    {appearance: 'dark', accent: '#2474ff'},
    React.createElement(
      Surface,
      {variant: 'raised'},
      React.createElement(
        Section,
        {title: 'Thermal envelope'},
        React.createElement(ResponsiveGrid, {minimumItemWidth: 'compact'},
          React.createElement('span', null, 'Solver'),
          React.createElement('span', null, 'Adaptive mesh')),
        React.createElement(Link, {href: '/runs/0284'}, 'Open run'),
        React.createElement(FieldGroup, {legend: 'Boundary inputs'},
          React.createElement(TextField, {label: 'Run name', defaultValue: 'North chamber'}),
          React.createElement(NumberField, {label: 'Tolerance', locale: 'en-US', defaultValue: 0.0025})),
        React.createElement(ButtonGroup, {label: 'Profile actions', equalItems: true},
          React.createElement(Button, null, 'Review conditions'),
          React.createElement(Button, {variant: 'primary'}, 'Run profile')),
        React.createElement(Select, {label: 'Bounded mode', emptyMessage: 'No modes', options: [
          {label: 'Conservative', value: 'conservative'},
          {label: 'Balanced', value: 'balanced'}]}),
        React.createElement(ComboBox, {label: 'Filter mode', emptyMessage: 'No matching modes', options: [
          {label: 'Conservative', value: 'conservative'},
          {label: 'Balanced', value: 'balanced'}]}),
        React.createElement(DateField, {calendar: 'gregory', defaultValue: {year: 2026, month: 8, day: 20}, label: 'Run date', locale: 'en-US'}),
        React.createElement(TimeField, {defaultValue: {hour: 14, minute: 30, second: 0}, granularity: 'minute', hourCycle: 24, label: 'Run time', locale: 'en-US'}),
        React.createElement(DatePicker, {calendar: 'gregory', calendarButtonLabel: 'Choose date', label: 'Review date', locale: 'en-US', placeholderValue: {year: 2026, month: 8, day: 20}}),
        React.createElement(DateRangePicker, {calendar: 'gregory', calendarButtonLabel: 'Choose range', label: 'Review window', locale: 'en-US', placeholderValue: {year: 2026, month: 8, day: 20}}),
        React.createElement(Slider, {defaultValue: 0.4, formatOptions: {style: 'percent'}, label: 'Confidence', locale: 'en-US', minValue: 0, maxValue: 1, step: 0.05}),
        React.createElement(RangeSlider, {defaultValue: [20, 80], label: 'Review window', locale: 'en-US', minValue: 0, maxValue: 100, step: 5, thumbLabels: ['Window start', 'Window end']}),
        React.createElement(StatusIndicator, {label: 'Solving', tone: 'warning'}),
        React.createElement(Badge, {tone: 'accent'}, 'RUN 0284'),
        React.createElement(ProcessTracker, {ariaLabel: 'Thermal solve stages', stages: [
          {id: 'geometry', label: 'Geometry validated', status: 'complete'},
          {id: 'boundary', label: 'Boundary pass', status: 'active'},
          {id: 'solve', label: 'Solve pending', status: 'pending'}], statusLabels: {
          active: 'Active', complete: 'Complete', failed: 'Failed', pending: 'Pending', warning: 'Needs review'}}),
        React.createElement(InlineAlert, {title: 'Boundary review', tone: 'warning'}, 'Check one coefficient.'),
        React.createElement(AlertBanner, {title: 'Solver connected', tone: 'success'}, 'Runs can start.'),
        React.createElement(ProgressBar, {completionLabel: 'Complete after all passes.', isActive: true, label: 'Boundary solve', value: 18, valueLabel: '18 passes'}),
        React.createElement(Meter, {label: 'Thermal load', minValue: 0, maxValue: 100, value: 76, valueLabel: '76 kilowatts'}),
        React.createElement(Spinner, {isActive: true, label: 'Preparing solver'}),
        React.createElement(Toolbar, {label: 'Inspector commands'},
          React.createElement(IconButton, {label: 'More actions'},
            React.createElement('span', {'aria-hidden': true}, '•••')),
          React.createElement(ToggleButton, {defaultSelected: true}, 'Pin inspector')),
      ),
    ),
  ),
);
`;
}

async function walk(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const paths = await Promise.all(
    entries.map((entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    }),
  );
  return paths.flat();
}
