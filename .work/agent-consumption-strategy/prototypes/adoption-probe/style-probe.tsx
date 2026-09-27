import {AppearanceProvider, Button, TextField} from '@trwhitney/component-library';
import {Button as CustomButton, TextField as CustomTextField} from '@probe/custom-controls';

// This tests styling attachment only. It is not a proposed form or composite component.
export function StyleProbe({kind}: {kind: string}) {
  const field =
    kind === 'native' ? (
      <div className="bespoke-field">
        <label className="bespoke-label" htmlFor="email">
          Email
        </label>
        <div className="bespoke-control">
          <input
            id="email"
            className="bespoke-input"
            type="email"
            name="email"
            defaultValue="alex@example.test"
          />
        </div>
      </div>
    ) : kind === 'current' ? (
      <TextField label="Email" inputType="email" name="email" defaultValue="alex@example.test" />
    ) : (
      <CustomTextField
        label="Email"
        inputType="email"
        name="email"
        defaultValue="alex@example.test"
        classNames={{
          root: 'bespoke-field',
          label: 'bespoke-label',
          control: 'bespoke-control',
          input: 'bespoke-input',
        }}
      />
    );
  return (
    <AppearanceProvider appearance="light" accent="#375950">
      <main className="style-probe" data-probe="style-probe">
        <h1>Custom control treatment</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          {field}
          <div className="actions">
            {kind === 'native' ? (
              <button className="bespoke-button" type="submit">
                Save
              </button>
            ) : kind === 'current' ? (
              <Button type="submit">Save</Button>
            ) : (
              <CustomButton className="bespoke-button" type="submit">
                Save
              </CustomButton>
            )}
          </div>
        </form>
      </main>
    </AppearanceProvider>
  );
}
