'use client';
import {useState} from 'react';
import {RadioGroup} from '@trwhitney/component-library';
import '@trwhitney/component-library/styles.css';

// Render beneath the application's AppearanceProvider.
// Consumer-owned state and options. Place the control in any layout.
const options = [
  {value: 'daily', label: 'Daily'},
  {value: 'weekly', label: 'Weekly'},
  {value: 'never', label: 'Never'},
] as const;
type Frequency = (typeof options)[number]['value'];

export function FrequencyExample() {
  const [value, setValue] = useState<Frequency | null>('weekly');
  return (
    <RadioGroup
      label="Digest frequency"
      name="frequency"
      options={options}
      value={value}
      onChange={setValue}
    />
  );
}
