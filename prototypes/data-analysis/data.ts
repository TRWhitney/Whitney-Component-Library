// Fictional, deterministic records for the prototype. No network or persistence.
export interface Building {
  id: string;
  name: string;
  campus: string;
  kind: string;
  area: number;
  intensity: number;
  monthly: number[];
}

const names = [
  'Alder Hall',
  'Engineering Lab',
  'North Library',
  'Birch Hall',
  'Materials Lab',
  'Archive Library',
  'Cedar Hall',
  'Chemistry Lab',
  'Central Library',
  'Elm Hall',
  'Robotics Lab',
  'Arts Library',
  'Fir Hall',
  'Biology Lab',
  'South Library',
  'Maple Hall',
  'Physics Lab',
  'Law Library',
];
const intensities = [
  128, 246, 142, 175, 218, 116, 151, 279, 132, 188, 231, 124, 139, 264, 148, 167, 202, 109,
];
const seasonalWeights = [12, 11, 9, 7, 6, 6, 7, 7, 6, 8, 10, 11];

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
export const buildings: Building[] = names.map((name, index) => {
  const intensity = intensities[index]!;
  const weights = seasonalWeights.map((weight, month) => weight + ((index + month * 3) % 5));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const monthly = weights.map(
    (weight) => Math.round(((intensity * weight) / totalWeight) * 10) / 10,
  );
  monthly[11] =
    Math.round((intensity - monthly.slice(0, 11).reduce((sum, value) => sum + value, 0)) * 10) / 10;
  return {
    id: `building-${index + 1}`,
    name,
    campus: ['North', 'Central', 'South'][Math.floor(index / 6)]!,
    kind: ['Office', 'Laboratory', 'Library'][index % 3]!,
    area: 1800 + ((index * 1741) % 12500),
    intensity,
    monthly,
  };
});

export const filters = [
  {
    id: 'campus',
    label: 'Campus',
    placeholder: 'All campuses',
    emptyMessage: 'No campuses',
    options: ['North', 'Central', 'South'].map((value) => ({label: value, value})),
  },
  {
    id: 'kind',
    label: 'Building use',
    placeholder: 'All uses',
    emptyMessage: 'No building uses',
    options: ['Office', 'Laboratory', 'Library'].map((value) => ({label: value, value})),
  },
] as const;

export const scenarios = [
  {value: 'ready', label: 'Ready'},
  {value: 'loading', label: 'First load'},
  {value: 'empty', label: 'No data'},
  {value: 'partial', label: 'Partial data'},
  {value: 'stale', label: 'Stale data'},
  {value: 'error', label: 'Refresh error'},
  {value: 'unavailable', label: 'First-load error'},
] as const;
export type Scenario = (typeof scenarios)[number]['value'];
