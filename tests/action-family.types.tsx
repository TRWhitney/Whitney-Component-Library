import {Button, ButtonGroup, IconButton, Link, ToggleButton, Toolbar} from '../src/index.js';

export const actions = (
  <>
    <Toolbar label="Editing commands">
      <Button variant="primary" type="submit" form="profile-form">
        Save profile
      </Button>
      <IconButton label="Close panel">
        <span aria-hidden="true">×</span>
      </IconButton>
      <ToggleButton defaultSelected onChange={() => undefined}>
        Pin inspector
      </ToggleButton>
    </Toolbar>
    <Link href="/runs/0284" current="page">
      Run 0284
    </Link>
  </>
);

export const groupedActions = (
  <ButtonGroup label="Run actions" orientation="horizontal" equalItems>
    <Button size="compact">Review</Button>
    <Button size="compact">Run profile</Button>
  </ButtonGroup>
);

function ConsumerActionBundle() {
  return (
    <>
      <Button>Undo</Button>
      <ToggleButton>Bold</ToggleButton>
    </>
  );
}

export const composedToolbar = (
  <Toolbar label="Formatting commands">
    <ConsumerActionBundle />
  </Toolbar>
);

// @ts-expect-error Pending commands require a localized assistive description.
export const undescribedPending = <Button isPending>Run profile</Button>;

export const disabledPending = (
  // @ts-expect-error Pending commands remain focusable and cannot also be natively disabled.
  <Button isDisabled isPending pendingLabel="Running profile">
    Run profile
  </Button>
);

// @ts-expect-error Commands cannot become navigation links through a polymorphic escape hatch.
export const polymorphicButton = <Button href="/runs">Runs</Button>;

export const commandLink = Link({
  children: 'Run',
  href: '/runs',
  // @ts-expect-error Links navigate by href and do not expose command press callbacks.
  onPress: () => undefined,
});

// @ts-expect-error Icon-only commands always require an accessible label.
export const unnamedIcon = <IconButton>×</IconButton>;

// @ts-expect-error Variants are semantic rather than arbitrary style names.
export const arbitraryVariant = <Button variant="loud">Run</Button>;

// @ts-expect-error A toolbar requires an accessible label.
export const unnamedToolbar = <Toolbar>Commands</Toolbar>;

// @ts-expect-error Consumer class injection is outside the action-family contract.
export const styledGroup = <ButtonGroup label="Commands" className="actions" />;

// @ts-expect-error Controlled toggle state requires an ownership callback.
export const inertControlledToggle = <ToggleButton isSelected>Pin inspector</ToggleButton>;

// @ts-expect-error Controlled and uncontrolled toggle ownership cannot be combined.
export const ambiguousToggle = ToggleButton({
  children: 'Pin inspector',
  defaultSelected: true,
  isSelected: true,
  onChange: () => undefined,
});

export const namedIconToggle = (
  <ToggleButton label="Bold">
    <span aria-hidden="true">B</span>
  </ToggleButton>
);
