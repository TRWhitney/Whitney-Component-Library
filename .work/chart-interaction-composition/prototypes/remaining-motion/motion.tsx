// Prototype-only display adapters. Source models remain the reading/callback authority.
import {useMotion, MotionContext} from '../value-motion/motion.js';
export {MotionContext};
export function useRadarMotion(model, identity) {
  const values = useMotion(
    model.series.map((s) => s.values),
    identity,
  );
  return {...model, series: model.series.map((s, i) => ({...s, values: values[i] ?? s.values}))};
}
export function useSparkMotion(model, identity) {
  const values = useMotion(
    model.rows.map((r) => [
      r.value,
      r.value === model.lowest ? 1 : 0,
      r.value === model.highest ? 1 : 0,
    ]),
    identity,
  );
  return {
    ...model,
    rows: model.rows.map((r, i) => ({
      ...r,
      value: values[i]?.[0],
      lowestWeight: values[i]?.[1] ?? 0,
      highestWeight: values[i]?.[2] ?? 0,
    })),
  };
}
const fields = ['lowerWhisker', 'q1', 'median', 'q3', 'upperWhisker'];
export function useDistributionMotion(model) {
  const histogram = model.kind === 'histogram',
    box = model.kind === 'box';
  const values = useMotion(
    histogram
      ? model.bins.map((b) => [b.value])
      : box
        ? model.boxes.map((b) => [...fields.map((k) => b[k]), ...b.outliers])
        : [],
    JSON.stringify(
      histogram
        ? model.bins.map((b) => [b.lower, b.upper])
        : box
          ? model.boxes.map((b) => [b.series.id, b.outlierIds])
          : [],
    ),
  );
  if (histogram)
    return {...model, bins: model.bins.map((b, i) => ({...b, value: values[i]?.[0] ?? b.value}))};
  if (box)
    return {
      ...model,
      boxes: model.boxes.map((b, i) => ({
        ...b,
        ...Object.fromEntries(fields.map((k, j) => [k, values[i]?.[j] ?? b[k]])),
        outliers: b.outliers.map((v, j) => values[i]?.[j + 5] ?? v),
      })),
    };
  return model;
}
