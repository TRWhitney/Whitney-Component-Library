import {Select, Stack, Switch, TextField} from '../src/index.js';

export function AppearanceProviderExample({reserve}: {readonly reserve: boolean}) {
  return (
    <div className="showcase-appearance-controls">
      <Stack gap="regular">
        <TextField label="Owner" reserveSupportSpace={reserve} />
        <Select
          label="Priority"
          defaultValue="normal"
          options={[
            {value: 'normal', label: 'Normal'},
            {value: 'high', label: 'High'},
          ]}
          emptyMessage="No priorities"
          reserveSupportSpace={reserve}
        />
        <Switch label="Notifications" defaultSelected reserveSupportSpace={reserve} />
      </Stack>
    </div>
  );
}
