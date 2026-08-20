import {act, cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {hydrateRoot} from 'react-dom/client';
import {renderToString} from 'react-dom/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

import {RangeSlider, Slider} from '../src/index.js';

afterEach(cleanup);

describe('range entry family', () => {
  it('formats and updates one bounded value through its accessible slider', () => {
    const onChange = vi.fn();
    render(
      <Slider
        defaultValue={0.4}
        description="Sets the solver confidence threshold."
        formatOptions={{style: 'percent'}}
        label="Confidence"
        locale="en-US"
        maxValue={1}
        minValue={0}
        onChange={onChange}
        step={0.05}
      />,
    );

    const slider = screen.getByRole<HTMLInputElement>('slider', {name: 'Confidence'});
    const fill = slider
      .closest('[data-wcl-range-field]')
      ?.querySelector<HTMLElement>('[data-wcl-range-fill]');
    expect(slider.getAttribute('aria-valuetext')).toBe('40%');
    expect(screen.getByText('40%').tagName).toBe('OUTPUT');
    expect(fill?.style.height).toBe('4px');
    expect(slider.getAttribute('aria-describedby')?.split(' ')).toContain(
      screen.getByText('Sets the solver confidence threshold.').id,
    );

    fireEvent.change(slider, {target: {value: '0.45'}});
    expect(onChange).toHaveBeenLastCalledWith(0.45);
    expect(slider.value).toBe('0.45');
  });

  it('keeps range thumbs named, ordered, and operable when their values meet', () => {
    const onChange = vi.fn();
    render(
      <RangeSlider
        defaultValue={[40, 60]}
        label="Review window"
        locale="en-US"
        maxValue={100}
        minValue={0}
        onChange={onChange}
        step={5}
        thumbLabels={['Window start', 'Window end']}
      />,
    );

    const start = screen.getByRole<HTMLInputElement>('slider', {name: /Window start/});
    const end = screen.getByRole<HTMLInputElement>('slider', {name: /Window end/});
    expect(start.max).toBe('60');
    expect(end.min).toBe('40');

    fireEvent.change(start, {target: {value: '80'}});
    expect(onChange).toHaveBeenLastCalledWith([60, 60]);
    expect(start.value).toBe('60');
    expect(end.value).toBe('60');
    expect(start.closest('[data-wcl-range-field]')?.querySelector('output')?.textContent).toBe(
      '60',
    );
    expect(start.closest('[data-wcl-range-thumb]')?.getAttribute('data-thumb')).toBe('start');
    expect(end.closest('[data-wcl-range-thumb]')?.getAttribute('data-thumb')).toBe('end');
  });

  it('keeps read-only values focusable and disabled values inert', () => {
    const onChange = vi.fn();
    render(
      <>
        <Slider
          defaultValue={4}
          isReadOnly
          label="Approved passes"
          locale="en-US"
          maxValue={10}
          minValue={0}
          onChange={onChange}
          step={1}
        />
        <Slider
          defaultValue={2}
          isDisabled
          label="Unavailable passes"
          locale="en-US"
          maxValue={10}
          minValue={0}
          step={1}
        />
      </>,
    );

    const readOnly = screen.getByRole<HTMLInputElement>('slider', {name: 'Approved passes'});
    const disabled = screen.getByRole<HTMLInputElement>('slider', {name: 'Unavailable passes'});
    expect(readOnly.disabled).toBe(false);
    expect(readOnly.getAttribute('aria-readonly')).toBe('true');
    fireEvent.change(readOnly, {target: {value: '8'}});
    expect(readOnly.value).toBe('4');
    expect(onChange).not.toHaveBeenCalled();
    expect(disabled.disabled).toBe(true);
  });

  it('applies stepped keyboard semantics in both horizontal directions', () => {
    render(
      <>
        <Slider
          defaultValue={5}
          label="LTR passes"
          locale="en-US"
          maxValue={10}
          minValue={0}
          step={1}
        />
        <Slider
          defaultValue={5}
          label="RTL passes"
          locale="ar-SA"
          maxValue={10}
          minValue={0}
          step={1}
        />
      </>,
    );

    const ltr = screen.getByRole<HTMLInputElement>('slider', {name: 'LTR passes'});
    const rtl = screen.getByRole<HTMLInputElement>('slider', {name: 'RTL passes'});
    fireEvent.keyDown(ltr, {key: 'ArrowRight'});
    fireEvent.keyDown(rtl, {key: 'ArrowRight'});
    expect(ltr.value).toBe('6');
    expect(rtl.value).toBe('4');

    fireEvent.keyDown(ltr, {key: 'End'});
    fireEvent.keyDown(rtl, {key: 'Home'});
    expect(ltr.value).toBe('10');
    expect(rtl.value).toBe('0');
  });

  it('synchronizes controlled values and reports completed keyboard changes', () => {
    const onSliderChange = vi.fn();
    const onSliderChangeEnd = vi.fn();
    const onRangeChange = vi.fn();
    const onRangeChangeEnd = vi.fn();
    const view = (sliderValue: number, rangeValue: readonly [number, number]) => (
      <>
        <Slider
          label="Controlled passes"
          locale="en-US"
          maxValue={10}
          minValue={0}
          onChange={onSliderChange}
          onChangeEnd={onSliderChangeEnd}
          step={1}
          value={sliderValue}
        />
        <RangeSlider
          label="Controlled window"
          locale="en-US"
          maxValue={100}
          minValue={0}
          onChange={onRangeChange}
          onChangeEnd={onRangeChangeEnd}
          step={5}
          thumbLabels={['Start', 'End']}
          value={rangeValue}
        />
      </>
    );
    const {rerender} = render(view(4, [20, 80]));
    const single = screen.getByRole<HTMLInputElement>('slider', {name: 'Controlled passes'});
    const start = screen.getByRole<HTMLInputElement>('slider', {name: /Start/});

    fireEvent.keyDown(single, {key: 'ArrowRight'});
    fireEvent.keyUp(single, {key: 'ArrowRight'});
    fireEvent.keyDown(start, {key: 'ArrowRight'});
    fireEvent.keyUp(start, {key: 'ArrowRight'});
    expect(onSliderChange).toHaveBeenLastCalledWith(5);
    expect(onSliderChangeEnd).toHaveBeenLastCalledWith(5);
    expect(onRangeChange).toHaveBeenLastCalledWith([25, 80]);
    expect(onRangeChangeEnd).toHaveBeenLastCalledWith([25, 80]);

    rerender(view(5, [25, 75]));
    expect(single.value).toBe('5');
    expect(start.value).toBe('25');
    expect(screen.getByRole<HTMLInputElement>('slider', {name: /End/}).value).toBe('75');
  });

  it('links invalid range thumbs to one actionable error', () => {
    render(
      <RangeSlider
        defaultValue={[20, 80]}
        description="Choose the retained interval."
        errorMessage="Keep the interval within the approved band."
        isInvalid
        label="Retained interval"
        locale="en-US"
        maxValue={100}
        minValue={0}
        step={5}
        thumbLabels={['Lower bound', 'Upper bound']}
      />,
    );

    const error = screen.getByText('Keep the interval within the approved band.');
    for (const slider of screen.getAllByRole('slider')) {
      expect(slider.getAttribute('aria-invalid')).toBe('true');
      expect(slider.getAttribute('aria-describedby')?.split(' ')).toContain(error.id);
    }
    expect(screen.queryByText('Choose the retained interval.')).toBeTruthy();
  });

  it('serializes and resets single and paired values deterministically', async () => {
    render(
      <form>
        <Slider
          defaultValue={4}
          label="Passes"
          locale="en-US"
          maxValue={10}
          minValue={0}
          name="passes"
          step={1}
        />
        <RangeSlider
          defaultValue={[20, 80]}
          label="Window"
          locale="en-US"
          maxValue={100}
          minValue={0}
          names={['window-start', 'window-end']}
          step={5}
          thumbLabels={['Start', 'End']}
        />
      </form>,
    );
    const form = screen.getByRole('slider', {name: 'Passes'}).closest('form')!;
    const [passes, start] = screen.getAllByRole<HTMLInputElement>('slider');

    expect([...new FormData(form).entries()]).toEqual([
      ['passes', '4'],
      ['window-start', '20'],
      ['window-end', '80'],
    ]);
    fireEvent.change(passes!, {target: {value: '7'}});
    fireEvent.change(start!, {target: {value: '35'}});
    fireEvent.reset(form);

    await waitFor(() =>
      expect([...new FormData(form).entries()]).toEqual([
        ['passes', '4'],
        ['window-start', '20'],
        ['window-end', '80'],
      ]),
    );
  });

  it('rejects invalid numeric domains and structurally invalid values', () => {
    expect(() =>
      render(
        <Slider
          label="Broken"
          locale="en-US"
          maxValue={0}
          minValue={0}
          step={1}
          value={0}
          onChange={() => undefined}
        />,
      ),
    ).toThrow(/maxValue.*greater than minValue/i);

    expect(() =>
      render(
        <RangeSlider
          label="Crossed"
          locale="en-US"
          maxValue={100}
          minValue={0}
          onChange={() => undefined}
          step={5}
          thumbLabels={['Start', 'End']}
          value={[80, 20]}
        />,
      ),
    ).toThrow(/ascending order/i);

    expect(() =>
      render(
        <RangeSlider
          label="Malformed"
          locale="en-US"
          maxValue={100}
          minValue={0}
          onChange={() => undefined}
          step={5}
          thumbLabels={['Start', 'End']}
          value={[20, 50, 80] as unknown as readonly [number, number]}
        />,
      ),
    ).toThrow(/exactly two/i);

    expect(() =>
      render(
        <RangeSlider
          label="Unnamed bounds"
          locale="en-US"
          maxValue={100}
          minValue={0}
          step={5}
          thumbLabels={['', 'End']}
        />,
      ),
    ).toThrow(/non-empty/i);

    expect(() =>
      render(
        <RangeSlider
          label="Duplicate bounds"
          locale="en-US"
          maxValue={100}
          minValue={0}
          step={5}
          thumbLabels={['Value', 'Value']}
        />,
      ),
    ).toThrow(/distinct/i);
  });

  it('server-renders and hydrates horizontal and vertical controls without drift', async () => {
    const view = (
      <>
        <Slider
          defaultValue={5}
          label="Server passes"
          locale="en-US"
          maxValue={10}
          minValue={0}
          step={1}
        />
        <RangeSlider
          defaultValue={[25, 75]}
          label="Server window"
          locale="en-US"
          maxValue={100}
          minValue={0}
          orientation="vertical"
          step={5}
          thumbLabels={['Start', 'End']}
        />
      </>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(view);
    document.body.append(container);
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    await act(async () => {
      root = hydrateRoot(container, view, {onRecoverableError});
      await Promise.resolve();
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(within(container).getAllByRole('slider')).toHaveLength(3);
    expect(
      container.querySelector<HTMLElement>(
        "[data-wcl-range-field][data-orientation='vertical'] [data-wcl-range-fill]",
      )?.style.width,
    ).toBe('4px');

    act(() => root?.unmount());
    container.remove();
  });
});
