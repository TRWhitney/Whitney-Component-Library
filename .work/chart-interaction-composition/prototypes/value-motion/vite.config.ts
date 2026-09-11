import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
const motion = fileURLToPath(new URL('./motion.tsx', import.meta.url));
export default defineConfig({
  plugins: [
    {
      name: 'value-motion-study',
      enforce: 'pre',
      transform(code, id) {
        if (id.endsWith('/src/charts/cartesian-chart.tsx')) {
          code = `import {useMovingRows} from ${JSON.stringify(motion)};\n` + code;
          code = code.replace('const prepared = {', 'const targetPrepared = {');
          code = code.replace(
            '  const navigation = useChartExploration(',
            '  const prepared = {...targetPrepared, rows:useMovingRows(targetPrepared.rows, series)};\n  const navigation = useChartExploration(',
          );
          code = code.replace(
            '  const value = displayedValues(row, layout)[seriesIndex];',
            '  row = row.__studyActual ?? row;\n  const value = displayedValues(row, layout)[seriesIndex];',
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
          return code;
        }
        if (id.endsWith('/src/charts/part-to-whole-chart.tsx')) {
          return (
            `import {useContext as useStudyContext} from 'react';\nimport {MotionContext} from ${JSON.stringify(motion)};\n` +
            code
              .replace(
                'JSON.stringify([modelIdentity, safePageIndex, kind]),',
                'JSON.stringify([model.positiveCategories.map(c => c.id), safePageIndex, kind]),',
              )
              .replace(
                '    !!visibilityLabels &&\n      targetSegments.length > 0',
                '    useStudyContext(MotionContext) &&\n      targetSegments.length > 0',
              )
          );
        }
      },
    },
  ],
});
