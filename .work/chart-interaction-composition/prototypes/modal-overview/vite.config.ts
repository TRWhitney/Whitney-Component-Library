import {defineConfig} from 'vite';
// The fixture's last interval remains upper-inclusive when other intervals leave the viewport.
export default defineConfig({
  plugins: [
    {
      name: 'prototype-fixed-bin-identity',
      enforce: 'pre',
      transform(code, id) {
        const bridge =
          "import {useStudyVisibility} from '../../.work/chart-interaction-composition/prototypes/modal-overview/visibility-store.js';\n";
        if (id.endsWith('/src/charts/heatmap.tsx'))
          return (
            bridge +
            code.replace(
              /const \[hidden, setHidden\] = useState<\{rows: readonly string\[\]; columns: readonly string\[\]\}>\(\{\s*rows: \[\],\s*columns: \[\],\s*\}\);/,
              "const [hidden, setHidden] = useStudyVisibility('heatmap');",
            )
          );

        if (id.endsWith('/src/charts/cartesian-chart.tsx')) {
          return (
            bridge +
            code
              .replace(
                'const [hiddenSeriesIds, setHiddenSeriesIds] = useState<readonly string[]>([]);',
                "const [hiddenSeriesIds, setHiddenSeriesIds] = useStudyVisibility('bar');",
              )
              .replace('(categoryCount + categoryBandPadding)', '(12 + categoryBandPadding)')
          );
        }
        if (!id.endsWith('/src/charts/statistical-chart.tsx')) return;
        code = code
          .replace(
            'Math.sqrt((point.magnitude ?? 0) / maximum)',
            'Math.sqrt((point.magnitude ?? 0) / 100)',
          )
          .replace(
            'clipPath={visibilityLabels ? `url(#${marksClipId})` : undefined}',
            'clipPath={`url(#${clipId})`}',
          );
        return (
          bridge +
          code
            .replace(
              'const [hiddenSeriesIds, setHiddenSeriesIds] = useState<readonly string[]>([]);',
              "const [hiddenSeriesIds, setHiddenSeriesIds] = useStudyVisibility('box');",
            )
            .replace(
              'if (bins.length > 0) bins[bins.length - 1] = {...bins[bins.length - 1]!, final: true};',
              'if (bins.length > 0) bins[bins.length - 1] = {...bins[bins.length - 1]!, final: bins[bins.length - 1]!.upper === 240};',
            )
        );
      },
    },
  ],
});
