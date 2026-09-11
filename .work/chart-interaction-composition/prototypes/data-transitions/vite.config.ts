import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
const motion = fileURLToPath(new URL('./motion.tsx', import.meta.url));
export default defineConfig({
  plugins: [
    {
      name: 'data-transition-study',
      enforce: 'pre',
      transform(code, id) {
        if (id.endsWith('/src/charts/use-animated-chart-domain.ts'))
          return (
            `import {useContext as useStudyContext} from 'react';\nimport {MotionContext} from ${JSON.stringify(motion)};\n` +
            code.replace(
              'const animate = enabled && !reducedMotion;',
              'const animate = useStudyContext(MotionContext) && enabled && !reducedMotion;',
            )
          );
        if (id.endsWith('/src/charts/cartesian-chart.tsx')) {
          code =
            `import {useMovingRows,useMovingProjection} from ${JSON.stringify(motion)};\n` + code;
          code = code.replace('const prepared = {', 'const targetPrepared = {');
          code = code.replace(
            '  const navigation = useChartExploration(',
            '  const prepared = {...targetPrepared, rows:useMovingRows(targetPrepared.rows, series)};\n  const navigation = useChartExploration(',
          );
          code = code.replace(
            '  const value = displayedValues(row, layout)[seriesIndex];',
            '  row = row.__studyActual ?? row;\n  const value = displayedValues(row, layout)[seriesIndex];',
          );
          code = code.replace(
            'const fullValueDomain = valueDomain(prepared.rows, layout, series);',
            'const fullValueDomain = valueDomain(targetPrepared.rows, layout, series);',
          );
          code = code.replace(
            '  let content: ReactNode;',
            '  const studyCategory = useMovingProjection(createProjection(categoryAxis.scale, categoryValues, [0,1], categoryAxis.tickCount ?? 6, usesBars));\n  let content: ReactNode;',
          );
          const start = code.indexOf(
            '      categoryProjection: createProjection(',
            code.indexOf('const createPlotProjections'),
          );
          const end = code.indexOf('      valueProjection:', start);
          code =
            code.slice(0, start) +
            "      categoryProjection: studyCategory(categoryPlacement === 'x' ? [bounds.left,bounds.right] : [bounds.top,bounds.bottom]),\n" +
            code.slice(end);
          code = code.replaceAll(
            'data-row-index={rowIndex}',
            'data-study-id={String(row.category)+"|"+item.id} data-row-index={rowIndex}',
          );
          code = code.replace(
            'key={`${item.id}-${row.index}`}',
            'key={`${item.id}-${row.category}`}',
          );
          return code;
        }
        if (id.endsWith('/src/charts/statistical-chart.tsx')) {
          code = `import {useMovingModel} from ${JSON.stringify(motion)};\n` + code;
          code = code.replace(
            'const model = modelWithDomains(viewportModel, xDomain, yDomain);',
            'const model = useMovingModel(modelWithDomains(viewportModel, xDomain, yDomain));',
          );
          code = code.replace(
            '      const magnitudeRows =',
            '      const actual = point.__studyActual ?? point;\n      const magnitudeRows =',
          );
          code = code.replace(
            'formatMagnitude(point.magnitude, model.magnitude)',
            'formatMagnitude(actual.magnitude, model.magnitude)',
          );
          code = code
            .replace(
              'formatAxisValue(point.x, model.xAxis)',
              'formatAxisValue(actual.x, model.xAxis)',
            )
            .replace(
              'formatAxisValue(point.y, model.yAxis)',
              'formatAxisValue(actual.y, model.yAxis)',
            );
          code = code.replace(
            'x: point.x,\n                      y: point.y,',
            'x: (point.__studyActual ?? point).x,\n                      y: (point.__studyActual ?? point).y,',
          );
          code = code.replace(
            'data-point-id={point.id}',
            'data-study-id={point.id+"|"+point.series.id} data-point-id={point.id}',
          );
          return code;
        }
        if (id.endsWith('/src/charts/part-to-whole-chart.tsx')) {
          code = `import {useMovingAngles} from ${JSON.stringify(motion)};\n` + code;
          const start = code.indexOf('  const angles = useAnimatedRadialAngles(');
          const end = code.indexOf('  const segments =', start);
          code =
            code.slice(0, start) +
            '  const angles = useMovingAngles(targetSegments);\n' +
            code.slice(end);
          code = code.replace(
            'const index = styleIndices.get(category.id)!;',
            "const index = ['North','South','East','West','Annex','Studio'].indexOf(category.id);",
          );
          code = code.replace(
            'data-segment-id={segment.id}',
            'data-study-id={segment.identity} data-segment-id={segment.id}',
          );
          return code;
        }
      },
    },
  ],
});
