import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
const motion = fileURLToPath(new URL('./motion.tsx', import.meta.url));
export default defineConfig({
  plugins: [
    {
      name: 'remaining-motion-study',
      enforce: 'pre',
      transform(code, id) {
        const inject = `import {useRadarMotion,useSparkMotion,useDistributionMotion,MotionContext} from ${JSON.stringify(motion)};\nimport {useContext as useStudyContext} from 'react';\n`;
        if (id.endsWith('/src/charts/use-animated-chart-domain.ts'))
          return (
            inject +
            code.replace(
              'const animate = enabled && !reducedMotion;',
              'const animate = useStudyContext(MotionContext) && enabled && !reducedMotion;',
            )
          );
        if (id.endsWith('/src/charts/radar-chart.tsx')) {
          code = inject + code;
          code = code.replace(
            '  const model: RadarModel = {',
            '  const moving = useRadarMotion({...fullModel,series:visibleSeries}, JSON.stringify([hiddenIds,props.dimensions.map(d=>d.id),visibleSeries.map(s=>s.id)]));\n  const model: RadarModel = {',
          );
          code = code.replace(
            'series: visibleSeries.map((series) => ({',
            'series: moving.series.map((series) => ({',
          );
          code = code.replace(
            'const values = model.series.map((series) => ({',
            'const values = visibleSeries.map((series) => ({',
          );
          code = code.replace(
            'formatRadarValue(item.values[activeIndex]!, props.value)',
            'formatRadarValue(fullModel.series.find(s=>s.id===item.id)!.values[activeIndex]!, props.value)',
          );
          code = code.replace(
            'series={readingSeries}',
            'series={readingSeries.map(s=>fullModel.series.find(actual=>actual.id===s.id)!)}',
          );
          return code;
        }
        if (id.endsWith('/src/charts/sparkline.tsx')) {
          code = inject + code;
          code = code.replace(
            '  const model = prepareModel(props);',
            '  const sourceModel = prepareModel(props);\n  const model = useSparkMotion(sourceModel, JSON.stringify(sourceModel.rows.map(r=>[r.position,r.value===undefined])));',
          );
          code = code.replace(
            'model.rows.map((row) => [positionKey(row.position), row.value ?? null])',
            'sourceModel.rows.map((row) => [positionKey(row.position), row.value ?? null])',
          );
          code = code.replace(
            'value: row.value, hidden: false',
            'value: sourceModel.rows[index].value, hidden: false',
          );
          code = code.replaceAll(
            '<SparklineTable model={model}',
            '<SparklineTable model={sourceModel}',
          );
          code = code
            .replace(
              'const isLowest = row.value === model.lowest;',
              'const isLowest = row.lowestWeight > 0;',
            )
            .replace(
              'const isHighest = row.value === model.highest;',
              'const isHighest = row.highestWeight > 0;',
            );
          code = code.replace(
            'formatValue(activeRow.value, props.value)',
            'formatValue(sourceModel.rows[activeReading.index].value, props.value)',
          );
          code = code.replace('row={activeRow}', 'row={sourceModel.rows[activeReading.index]}');
          code = code.replace(
            'data-wcl-sparkline-cue={cue} key={row.index}',
            'data-wcl-sparkline-cue={cue} opacity={cue === "current" ? 1 : Math.max(row.lowestWeight, row.highestWeight)} key={row.index}',
          );
          code = code
            .replace(
              'formatValue(firstRow.value!, props.value)',
              'formatValue(sourceModel.rows[sourceModel.firstIndex].value, props.value)',
            )
            .replace(
              'formatValue(lastRow.value!, props.value)',
              'formatValue(sourceModel.rows[sourceModel.lastIndex].value, props.value)',
            );
          return code;
        }
        if (id.endsWith('/src/charts/statistical-chart.tsx')) {
          code = inject + code;
          code = code.replace(
            '  const displayModel =',
            '  const movingDistribution = useDistributionMotion(model);\n  const displayModel =',
          );
          code = code.replace(
            '      : model;\n  const targetReadings',
            '      : movingDistribution;\n  const targetReadings',
          );
          code = code.replace(
            'distributionPoints(model, projections, readings, presentation)',
            'distributionPoints(displayModel, projections, readings, presentation)',
          );
          code = code.replace(
            'distribution: distributionGeometry.map((point) => [point.bounds, point.whiskers]),',
            'distribution: statisticalModelGeometry(model),',
          );
          code = code.replace(
            '!!visibilityLabels || !!visiblePointModel',
            '!!visibilityLabels || !!visiblePointModel || modelKindForStudy',
          );
          // Histogram has no visibility control; its source count changes still fit the axis.
          code = code.replace(
            '  const animate =',
            '  const modelKindForStudy = visibleModel.kind === "histogram";\n  const animate =',
          );
          return code;
        }
      },
    },
  ],
});
