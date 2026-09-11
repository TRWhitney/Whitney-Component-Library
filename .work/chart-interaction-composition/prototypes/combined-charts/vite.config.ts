import {defineConfig} from 'vite';
// Prototype-only transforms: keep production gestures, reading, visibility and navigation.
export default defineConfig({
  plugins: [
    {
      name: 'combined-chart-study',
      enforce: 'pre',
      transform(code, id) {
        if (id.endsWith('/src/charts/cartesian-chart.tsx')) {
          const start = code.indexOf('function coordinates<'),
            end = code.indexOf('function displayedValues', start);
          let fn = code
            .slice(start, end)
            .replace(
              'layout: ChartBarLayout | ChartStacking,',
              'layout: ChartBarLayout | ChartStacking,\n  series: readonly InternalSeries<Datum>[] = [],',
            );
          fn = fn.replace(
            'const value = row.values[seriesIndex] ?? 0;',
            `const value = row.values[seriesIndex] ?? 0;
  if (series[seriesIndex]?.id === 'range') return {start: (row.datum as {lower:number}).lower, end: (row.datum as {upper:number}).upper};`,
          );
          code = code.slice(0, start) + fn + code.slice(end);
          code = code
            .replaceAll(
              'coordinates(row, seriesIndex, layout)',
              'coordinates(row, seriesIndex, layout, series)',
            )
            .replaceAll(
              'coordinates(next, seriesIndex, layout)',
              'coordinates(next, seriesIndex, layout, series)',
            )
            .replace(
              'coordinates(prepared.rows[rowIndex]!, index, layout)',
              'coordinates(prepared.rows[rowIndex]!, index, layout, series)',
            );
          code = code.replace(
            "const needsZero = series.some((item) => item.kind !== 'line');",
            "const needsZero = series.some((item) => item.kind !== 'line' && item.id !== 'range');",
          );
          code = code.replace(
            '...(needsZero ? [0] : []), ...row.values',
            '...(needsZero ? [0] : []), ...(series.some(s => s.id === "range") ? [(row.datum as {lower:number}).lower] : []), ...row.values',
          );
          code = code.replace(
            `const formattedValues = series.map((_, seriesIndex) =>
    formatReadingValue(values[seriesIndex] ?? 0, valueAxis),
  );`,
            `const formattedValues = series.map((item, seriesIndex) => item.id === 'range' && row ? formatReadingValue((row.datum as {lower:number}).lower, valueAxis) + ' to ' + formatReadingValue((row.datum as {upper:number}).upper, valueAxis) : formatReadingValue(values[seriesIndex] ?? 0, valueAxis));`,
          );
          code = code.replace(
            `displayedValues(readingRow, layout).map((value) => formatReadingValue(value, valueAxis))`,
            `displayedValues(readingRow, layout).map((value, index) => series[index]?.id === 'range' ? formatReadingValue((readingRow.datum as {lower:number}).lower,valueAxis) + ' to ' + formatReadingValue((readingRow.datum as {upper:number}).upper,valueAxis) : formatReadingValue(value, valueAxis))`,
          );
          code = code.replace(
            '<td key={series[index]?.id ?? index}>',
            '<td key={series[index]?.id ?? index}>{series[index]?.id === "range" ? `${(row.datum as {lower:number}).lower} to ` : null}',
          );
          // Add the lower endpoint alongside the native upper value marker. Both form one range target.
          const cues = `{interaction && series.some(s=>s.id==='range') ? <g pointerEvents="none" clipPath={\`url(#\${plotClipId})\`}>
   {prepared.rows.map((row,index)=>{
    const isSelected=actions.selected.some(item=>item.rowId===rowIds[row.index] && item.seriesId==='range');
    const isReading=activeReading?.index===index && (interaction.target==='category'||activeReading?.seriesId==='range');
    const isPulse=actions.pulse?.item.rowId===rowIds[row.index] && (actions.pulse.item.seriesId==='range'||interaction.target==='category');
    if(!isSelected&&!isReading&&!isPulse)return null;
    const x=categoryProjection.position(row.category), y=valueProjection.position((row.datum as {lower:number}).lower), top=valueProjection.position((row.datum as {upper:number}).upper);
    if(x===undefined||y===undefined||top===undefined)return null;
    const radius=presentation.pointRadius/presentation.viewScale, stroke=presentation.pointStrokeWidth*(emphasizedSeriesId==='range'?1.5:1);
    return <g key={row.index} data-color="series-2" data-study-range-cue="" data-row-id={rowIds[row.index]}>
     <line data-study-range-stem="" data-selected={isSelected?'':undefined} x1={x} x2={x} y1={top} y2={y}/>
     <circle data-wcl-chart-reading-outline="" cx={x} cy={y} r={radius} style={{strokeWidth:stroke}}/>
     {isReading?<circle data-wcl-chart-reading-node="" data-filled="" cx={x} cy={y} style={{r:(presentation.pointRadius-stroke/2+0.35)/presentation.viewScale}}/>:null}
     {isSelected?<circle data-wcl-chart-selected-point="" cx={x} cy={y} r={(presentation.pointRadius+stroke/2+1)/presentation.viewScale}/>:null}
     {isPulse?<g key={actions.pulse?.sequence} data-wcl-chart-activation=""><circle data-wcl-chart-activation-dot="" cx={x} cy={y} r={chartActivationPointRadius/presentation.viewScale}/></g>:null}
    </g>;
   })}
  </g>:null}`;
          code = code.replace(
            "{interaction?.target === 'point' && !isBarInteraction ? (",
            cues + "{interaction?.target === 'point' && !isBarInteraction ? (",
          );
          return code;
        }
        if (id.endsWith('/src/charts/chart-rectangular-exploration-controls.tsx')) {
          const button = (label: string) =>
            code.match(
              new RegExp(
                '<IconButton(?:(?!<IconButton)[\\s\\S])*?label=\\{labels\\.' +
                  label +
                  '\\}[\\s\\S]*?</IconButton>',
              ),
            )?.[0] ?? '';
          const up = button('panUp'),
            down = button('panDown');
          if (!up || !down) throw new Error('Update the prototype vertical pan adapter.');
          code = code.replace(up, '').replace(down, '');
          const end = code.lastIndexOf('</>');
          return (
            code.slice(0, end) +
            '<div data-study-vertical-pan="" onClick={stopPropagation} onPointerDown={stopPropagation} onKeyDown={stopPropagation}>' +
            up +
            down +
            '</div>' +
            code.slice(end)
          );
        }
        if (id.endsWith('/src/charts/statistical-chart.tsx')) {
          code = code.replace(
            'const initialPlot = plotForPresentation(presentation);',
            'const studyPlot = plotForPresentation(presentation); const initialPlot = {...studyPlot, right: studyPlot.right - 36 / presentation.viewScale};',
          );
          code = code.replace(
            '<PointShape cx={10} cy={6} radius={4} shape={series.shape} swatch />',
            '<>{series.id === \'trend\' ? <path d="M0 6H20" data-study-trend=""/> : <PointShape cx={10} cy={6} radius={4} shape={series.shape} swatch />}</>',
          );
          code = code.replace('shape: index};', "shape: item.id === 'trend' ? 0 : index};");
          code = code.replace(
            '...visiblePointModel,\n          points:',
            "...visiblePointModel,\n          studyLine: visiblePointModel.points.filter(p=>p.series.id==='trend'),\n          points:",
          );
          code = code.replace(
            '{pointRows.map(({index, point, reading}) => {',
            `<path data-study-trend="" data-muted={legendSeriesId && legendSeriesId !== 'trend' || directIndex!==null && model.points[directIndex]?.series.id!=='trend' ? '' : undefined} d={((model as typeof model & {studyLine?: typeof model.points}).studyLine ?? model.points.filter(p=>p.series.id==='trend')).map((p,i)=>\`\${i?'L':'M'}\${projections.xNumber?.position(p.x)},\${projections.y.position(p.y)}\`).join(' ')}/>
        {pointRows.map(({index, point, reading}) => {`,
          );
          code = code.replace(
            '{visiblePointModel.points.map((point) => {',
            `<path data-study-trend="" d={visiblePointModel.points.filter(p=>p.series.id==='trend').map((p,i)=>\`\${i?'L':'M'}\${navigation.x.position(p.x)*plotWidth(plot)},\${(1-navigation.y.position(p.y))*plotHeight(plot)}\`).join(' ')}/>
                            {visiblePointModel.points.map((point) => {`,
          );
          code = code.replace(
            'const preferred =\n      hits.length > 1',
            `const linePoints=points.filter(p=>p.seriesId==='trend');
    let lineHit: typeof points[number] | undefined; let nearest=Infinity;
    linePoints.slice(1).forEach((b,i)=>{const a=linePoints[i]!;const dx=b.x-a.x,dy=b.y-a.y;const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));const distance=Math.hypot(x-a.x-t*dx,y-a.y-t*dy);if(distance<8/presentation.viewScale&&distance<nearest){nearest=distance;lineHit=t<0.5?a:b;}});
    if(lineHit&&!hits.includes(lineHit))hits.push(lineHit);
    const preferred =
      hits.length > 1`,
          );
          return code;
        }
      },
    },
  ],
});
