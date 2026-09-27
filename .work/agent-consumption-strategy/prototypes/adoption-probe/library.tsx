import {
  AppearanceProvider,
  Button,
  RadioGroup,
  Switch,
  TextField,
} from '@trwhitney/component-library';
import {defaults, Frame, options, usePreferences} from './shared';

export function LibraryPreferences() {
  const {desktop, setDesktop, saved, save} = usePreferences();
  return (
    <AppearanceProvider appearance="light" accent="#375950">
      <Frame desktop={desktop} saved={saved}>
        <div className="immediate">
          <Switch
            label="Desktop alerts"
            isSelected={desktop}
            onChange={setDesktop}
            reserveSupportSpace={false}
          />
        </div>
        <form onSubmit={save} data-probe="form">
          <TextField
            label="Recipient email"
            inputType="email"
            name="email"
            autoComplete="email"
            isRequired
            defaultValue={defaults.email}
          />
          <RadioGroup
            label="Digest frequency"
            name="frequency"
            options={options}
            defaultValue="weekly"
            reserveSupportSpace={false}
          />
          <div className="actions">
            <Button type="reset">Reset</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Frame>
    </AppearanceProvider>
  );
}
