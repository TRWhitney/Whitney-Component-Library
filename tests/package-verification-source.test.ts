import {describe, expect, it} from 'vitest';

import {createConsumerVerificationSource} from '../scripts/consumer-verification-source.mjs';

describe('packed consumer verification source', () => {
  it('locates provider guidance without depending on manifest ordering', () => {
    const source = createConsumerVerificationSource('@fixture/component-library');

    expect(source).toContain(
      "manifest.exports.some((component) => component.name === 'AppearanceProvider')",
    );
    expect(source).not.toContain("manifest.exports[0]?.name !== 'AppearanceProvider'");
  });

  it('captures server and hydration warnings before rendering starts', () => {
    const source = createConsumerVerificationSource('@fixture/component-library');
    const serverRender = source.indexOf('renderToString(view)');

    expect(source.indexOf('console.error =', 0)).toBeLessThan(serverRender);
    expect(source.indexOf('console.warn =', 0)).toBeLessThan(serverRender);
    expect(source).toContain('SSR or hydration emitted warnings or recoverable errors.');
  });

  it('exercises the layout primitives through the packed public API', () => {
    const source = createConsumerVerificationSource('@fixture/component-library');

    for (const exportName of [
      'Divider',
      'InlineGroup',
      'ResponsiveGrid',
      'ScrollRegion',
      'Section',
      'Stack',
      'Surface',
    ]) {
      expect(source).toContain(exportName);
    }
    expect(source).toContain('data-wcl-responsive-grid');
    expect(source).toContain("label: 'Run history'");
  });

  it('exercises every action primitive and its packed semantics', () => {
    const source = createConsumerVerificationSource('@fixture/component-library');

    for (const exportName of [
      'Button',
      'ButtonGroup',
      'IconButton',
      'Link',
      'ToggleButton',
      'Toolbar',
    ]) {
      expect(source).toContain(exportName);
    }
    expect(source).toContain('data-wcl-toolbar');
    expect(source).toContain('aria-pressed');
    expect(source).toContain("type: 'submit'");
  });

  it('exercises every field-family export and its packed relationships', () => {
    const source = createConsumerVerificationSource('@fixture/component-library');

    for (const exportName of [
      'Field',
      'FieldGroup',
      'FormSection',
      'NumberField',
      'SearchField',
      'TextArea',
      'TextField',
    ]) {
      expect(source).toContain(exportName);
    }
    expect(source).toContain('data-wcl-number-field');
    expect(source).toContain('aria-describedby');
    expect(source).toContain("locale: 'en-US'");
    expect(source).toContain('globalThis.InputEvent = dom.window.InputEvent');
    expect(source).toContain('globalThis.CustomEvent = dom.window.CustomEvent');
    expect(source).toContain('globalThis.HTMLTemplateElement = dom.window.HTMLTemplateElement');
  });

  it('exercises every choice-family export and its packed native semantics', () => {
    const source = createConsumerVerificationSource('@fixture/component-library');

    for (const exportName of [
      'Checkbox',
      'CheckboxGroup',
      'RadioGroup',
      'SegmentedControl',
      'Switch',
    ]) {
      expect(source).toContain(exportName);
    }
    expect(source).toContain('data-wcl-checkbox-group');
    expect(source).toContain('data-wcl-segmented-control');
    expect(source).toContain("getAttribute('role') !== 'switch'");
    expect(source).toContain("form: 'packed-choice-form'");
    expect(source).toContain('external native form association');
  });

  it('exercises bounded and editable collection selection through the packed API', () => {
    const source = createConsumerVerificationSource('@fixture/component-library');

    for (const exportName of ['ComboBox', 'Select']) {
      expect(source).toContain(exportName);
    }
    expect(source).toContain('data-wcl-selection-field');
    expect(source).toContain("getAttribute('role') !== 'combobox'");
    expect(source).toContain("['select-mode', 'balanced']");
    expect(source).toContain("['combo-mode', 'balanced']");
  });

  it('exercises single and paired range entry through the packed API', () => {
    const source = createConsumerVerificationSource('@fixture/component-library');

    for (const exportName of ['RangeSlider', 'Slider']) {
      expect(source).toContain(exportName);
    }
    expect(source).toContain('data-wcl-range-field');
    expect(source).toContain("['confidence', '0.4']");
    expect(source).toContain("['window-start', '20']");
    expect(source).toContain("['window-end', '80']");
    expect(source).toContain('Packed ranges did not accept stepped changes.');
    expect(source).toContain('Packed ranges did not restore defaults on form reset.');
  });

  it('exercises the complete feedback family through packed SSR and hydration', () => {
    const source = createConsumerVerificationSource('@fixture/component-library');

    for (const exportName of [
      'AlertBanner',
      'Badge',
      'EmptyState',
      'InlineAlert',
      'Meter',
      'NotificationProvider',
      'ProgressBar',
      'Skeleton',
      'Spinner',
      'StatusIndicator',
    ]) {
      expect(source).toContain(exportName);
    }
    expect(source).toContain('data-wcl-status-indicator');
    expect(source).toContain('data-wcl-alert-banner');
    expect(source).toContain('data-wcl-skeleton');
    expect(source).toContain('data-wcl-empty-state');
    expect(source).toContain('data-wcl-notification');
    expect(source).toContain("getAttribute('aria-valuenow') !== '18'");
    expect(source).toContain("getAttribute('aria-valuetext') !== '76 kilowatts'");
    expect(source).toContain('Packed feedback family did not preserve semantic relationships.');
  });
});
