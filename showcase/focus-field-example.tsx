import {useState} from 'react';
import {Button, FocusField, Section, Stack, Surface, Switch} from '../src/index.js';

export function FocusFieldExample() {
  const [active, setActive] = useState(true);
  const [reviewed, setReviewed] = useState(false);
  return (
    <Stack gap="relaxed">
      <Switch label="Emphasize document review" isSelected={active} onChange={setActive} />
      <p>
        Included documents is the chosen anchor. Toggle emphasis to see the startup bloom. The solid
        panels keep their depth in both states.
      </p>
      <div className="showcase-focus-frame">
        <FocusField isActive={active}>
          <div className="showcase-focus-regions">
            <Surface focusFieldAnchor padding="spacious">
              <Section
                title="Included documents"
                headingLevel={4}
                description="Review the saved field notes before publication."
              >
                <Stack>
                  <p>Arrival brief · Site observations · Review agenda</p>
                  <Button size="compact" onPress={() => setReviewed(!reviewed)}>
                    {reviewed ? 'Reopen review' : 'Mark documents reviewed'}
                  </Button>
                </Stack>
              </Section>
            </Surface>
            <div className="showcase-focus-support">
              <Surface variant="raised" padding="spacious">
                <Section title="Publication" headingLevel={4}>
                  <p>{reviewed ? 'Ready to export' : 'Review in progress'}</p>
                </Section>
              </Surface>
            </div>
          </div>
        </FocusField>
      </div>
      <p>
        Choose the anchor from the task hierarchy. Leave space around major regions while keeping
        controls compact. The field scales with its frame and surrounds the panel on every side.
      </p>
    </Stack>
  );
}
