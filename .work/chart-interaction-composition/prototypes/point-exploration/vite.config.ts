import {defineConfig} from 'vite';

// Isolated experiment: keep the bubble magnitude reference at the full fixture maximum.
// Both the production marks and interaction geometry use this same radius calculation.
export default defineConfig({
  plugins: [
    {
      name: 'prototype-bubble-reference',
      transform(code, id) {
        if (!id.endsWith('/src/charts/statistical-chart.tsx')) return;
        const source = 'Math.sqrt((point.magnitude ?? 0) / maximum)';
        if (!code.includes(source))
          throw new Error('Update the isolated bubble-reference adapter.');
        return code
          .replace(source, 'Math.sqrt((point.magnitude ?? 0) / 100)')
          .replace(
            'clipPath={visibilityLabels ? `url(#${marksClipId})` : undefined}',
            'clipPath={`url(#${clipId})`}',
          );
      },
    },
  ],
});
