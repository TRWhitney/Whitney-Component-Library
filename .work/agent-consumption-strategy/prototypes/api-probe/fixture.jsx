// Non-production probe. Unsupported props are deliberate runtime observations.
import React, {createRef} from 'react';
import {createRoot} from 'react-dom/client';
import {
  AppearanceProvider,
  Button,
  Checkbox,
  Dialog,
  Field,
  Stack,
  TextField,
} from '@trwhitney/component-library';
import '@trwhitney/component-library/styles.css';

window.probe = {
  presses: [],
  nativeClicks: 0,
  nativePointerDown: 0,
  nativeKeyDown: 0,
  changes: [],
  choices: [],
  refs: {},
};
const refs = Object.fromEntries(
  ['stack', 'field', 'button', 'choice'].map((name) => [name, createRef()]),
);
window.probe.refs = refs;
window.probe.customFieldRef = createRef();
const extension = (name) => ({
  id: `consumer-${name}`,
  className: `consumer-${name}`,
  style: {outline: '7px solid red'},
  'data-consumer': name,
  'aria-description': `Consumer ${name}`,
  ref: refs[name],
});
class Boundary extends React.Component {
  state = {error: null};
  static getDerivedStateFromError(error) {
    return {error: error.message};
  }
  render() {
    return this.state.error ? <p role="alert">{this.state.error}</p> : this.props.children;
  }
}
function CustomAction() {
  return <Button>Open probe dialog</Button>;
}
const triggerMode = new URLSearchParams(location.search).get('trigger');

createRoot(document.getElementById('root')).render(
  <AppearanceProvider appearance="light" accent="#49634f">
    <h1>Non-production API probe</h1>
    {triggerMode ? (
      <Boundary>
        <Dialog
          title="Probe dialog"
          description="Trigger compatibility"
          closeLabel="Close probe dialog"
          trigger={triggerMode === 'native' ? <button>Open probe dialog</button> : <CustomAction />}
        >
          <p>Dialog content</p>
        </Dialog>
      </Boundary>
    ) : (
      <Stack {...extension('stack')}>
        <TextField
          {...extension('field')}
          label="Probe text"
          name="probe-text"
          defaultValue="initial"
          autoComplete="given-name"
          inputType="text"
          onChange={(value) => window.probe.changes.push({type: typeof value, value})}
        />
        <Button
          {...extension('button')}
          onPress={(event) => window.probe.presses.push(event.pointerType)}
        >
          Library action
        </Button>
        <button
          onPointerDown={() => window.probe.nativePointerDown++}
          onKeyDown={() => window.probe.nativeKeyDown++}
          onClick={() => window.probe.nativeClicks++}
        >
          Native action
        </button>
        <Checkbox
          {...extension('choice')}
          label="Probe choice"
          name="probe-choice"
          value="yes"
          onChange={(value) => window.probe.choices.push({type: typeof value, value})}
        />
        <Field label="Custom native field">
          {(props) => (
            <input {...props} ref={window.probe.customFieldRef} data-native-field="yes" />
          )}
        </Field>
      </Stack>
    )}
  </AppearanceProvider>,
);
