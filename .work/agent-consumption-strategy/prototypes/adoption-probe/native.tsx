import {defaults, Frame, options, usePreferences} from './shared';

export function NativePreferences() {
  const {desktop, setDesktop, saved, save} = usePreferences();
  return (
    <Frame desktop={desktop} saved={saved}>
      <div className="immediate">
        <button
          type="button"
          role="switch"
          aria-checked={desktop}
          onClick={() => setDesktop(!desktop)}
        >
          Desktop alerts: {desktop ? 'On' : 'Off'}
        </button>
      </div>
      <form onSubmit={save} className="native-form" data-probe="form">
        <div className="field">
          <label htmlFor="recipient">Recipient email</label>
          <input
            id="recipient"
            type="email"
            name="email"
            autoComplete="email"
            required
            defaultValue={defaults.email}
          />
        </div>
        <fieldset>
          <legend>Digest frequency</legend>
          {options.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="frequency"
                value={option.value}
                defaultChecked={option.value === defaults.frequency}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
        <div className="actions">
          <button type="reset">Reset</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </Frame>
  );
}
