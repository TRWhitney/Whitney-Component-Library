import {
  DonutChart,
  PieChart,
  type PartToWholeAggregateSizing,
  type PartToWholeChartLabels,
} from '../src/index.js';

interface Category {
  readonly id: string;
  readonly label: string;
  readonly value: number;
}

const data: readonly Category[] = [{id: 'residential', label: 'Residential', value: 43}];
const aggregateSizing: PartToWholeAggregateSizing = 'proportional';
const labels: PartToWholeChartLabels = {
  back: 'Back',
  category: 'Category',
  categoryRange: ({end, start, total}) => `Categories ${start} to ${end} of ${total}`,
  moreCategories: (count) => `More categories (${count})`,
  shareOfTotal: 'Share of total',
  shareOnPage: 'Share on this page',
};
const common = {
  aggregateSizing,
  data,
  dataTableLabel: 'Annual energy by category',
  description: 'Annual energy use by category.',
  emptyState: {description: 'Choose a year with recorded use.', title: 'No energy use'},
  idAccessor: 'id',
  invalidData: {description: 'Correct invalid values.', title: 'Invalid energy use'},
  labelAccessor: (category: Category) => category.label,
  labels,
  legend: {label: 'Visible categories'},
  title: 'Community energy use',
  visibilityLabels: {
    hidden: 'Hidden',
    hideSeries: (label: string) => `Hide ${label}`,
    showSeries: (label: string) => `Show ${label}`,
    showAll: 'Show all',
    allHidden: {title: 'No visible slices on this page', description: 'Restore a category.'},
  },
  value: {accessor: 'value', formatValue: (value: number) => value.toFixed(1), label: 'Energy'},
} as const;

export const pieChart = <PieChart {...common} />;
export const donutChart = <DonutChart {...common} totalLabel="MWh total" />;

export const invalidAggregateSizing = (
  // @ts-expect-error Aggregate sizing uses the bounded public vocabulary.
  <PieChart {...common} aggregateSizing="equal" />
);

export const invalidValueAccessor = (
  <PieChart
    {...common}
    // @ts-expect-error Part-to-whole values must resolve to numbers.
    value={{accessor: 'label', label: 'Energy'}}
  />
);

export const rendererDoesNotBelongToThePublicProps = (
  // @ts-expect-error Consumers cannot replace the chart renderer.
  <PieChart {...common} renderer="canvas" />
);

export const donutRequiresTotalCopy = (
  // @ts-expect-error DonutChart requires a localized center-total label.
  <DonutChart {...common} />
);
