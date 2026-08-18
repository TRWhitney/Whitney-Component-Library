import {describe, expect, it} from 'vitest';

import {createConsumerVerificationSource} from '../scripts/consumer-verification-source.mjs';

describe('packed consumer verification source', () => {
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
});
