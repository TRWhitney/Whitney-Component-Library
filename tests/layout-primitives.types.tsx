import {
  FocusField,
  InlineGroup,
  ResponsiveGrid,
  ScrollRegion,
  Section,
  Stack,
  Surface,
} from '../src/index.js';

export const boundedLayout = (
  <Stack gap="tight" align="stretch">
    <InlineGroup equalItems>
      <span>Solver</span>
      <span>Tolerance</span>
    </InlineGroup>
    <ResponsiveGrid minimumItemWidth="regular">
      <Surface variant="subtle" padding="compact">
        <Section title="Boundary conditions" headingLevel={2}>
          <ScrollRegion label="Condition history" size="regular">
            Ready
          </ScrollRegion>
        </Section>
      </Surface>
    </ResponsiveGrid>
  </Stack>
);

// @ts-expect-error Arbitrary spacing values are outside the public spatial grammar.
export const arbitraryGap = <Stack gap="13px">Unsupported spacing</Stack>;

// @ts-expect-error Consumer class injection is intentionally excluded.
export const injectedClass = <Surface className="consumer-card">Unsupported styling</Surface>;

export const ineffectiveEqualAlignment = (
  // @ts-expect-error Equal peers own stretch alignment so every peer shares both dimensions.
  <InlineGroup equalItems align="center">
    Unsupported alignment
  </InlineGroup>
);

export function DynamicEqualItems({shouldEqual}: {readonly shouldEqual: boolean}) {
  return <InlineGroup equalItems={shouldEqual}>Runtime-controlled equal sizing</InlineGroup>;
}

export const arbitraryGridWidth = (
  // @ts-expect-error Grid breakpoints are semantic rather than arbitrary CSS lengths.
  <ResponsiveGrid minimumItemWidth="18rem">Unsupported grid width</ResponsiveGrid>
);

export const focusField = (
  <FocusField isActive>
    <Surface focusFieldAnchor>Review</Surface>
  </FocusField>
);
export const missingFieldState = (
  // @ts-expect-error Activity is an explicit consumer decision.
  <FocusField>
    <Surface focusFieldAnchor>Review</Surface>
  </FocusField>
);
export const customFieldOffset = (
  // @ts-expect-error Effect geometry belongs to the library.
  <FocusField isActive offset={24}>
    <Surface>Review</Surface>
  </FocusField>
);
export const customFieldStyle = (
  // @ts-expect-error Custom CSS is outside the visual contract.
  <FocusField isActive style={{color: 'red'}}>
    <Surface>Review</Surface>
  </FocusField>
);
