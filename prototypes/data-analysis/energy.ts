import type {Building} from './data.js';
export const number = new Intl.NumberFormat('en-US', {maximumFractionDigits: 1});
export const integer = new Intl.NumberFormat('en-US', {maximumFractionDigits: 0});
export function peerMedian(building: Building, records: Building[]) {
  const values = records
    .filter((item) => item.kind === building.kind)
    .map((item) => item.intensity)
    .sort((a, b) => a - b);
  if (!values.length) return building.intensity;
  const middle = Math.floor(values.length / 2);
  return values.length % 2 ? values[middle]! : (values[middle - 1]! + values[middle]!) / 2;
}
export const difference = (building: Building, records: Building[]) =>
  (building.intensity / peerMedian(building, records) - 1) * 100;
export const differenceLabel = (value: number) => `${value > 0 ? '+' : ''}${number.format(value)}%`;
export function paddedDomain(records: Building[], key: 'area' | 'intensity'): [number, number] {
  const values = records.map((record) => record[key]);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const pad = Math.max((max - min) * 0.12, max * 0.05, 1);
  return [Math.max(0, min - pad), max + pad];
}
