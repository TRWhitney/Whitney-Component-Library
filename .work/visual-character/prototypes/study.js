import treatment from './treatment.css?raw';
import {deriveAccentRoles} from '../../../src/appearance/accent.ts';

const frame = document.querySelector('#demo-frame');
const demo = document.querySelector('#demo');
const appearance = document.querySelector('#appearance');
const emphasis = document.querySelector('#emphasis');
const identify = document.querySelector('#identify');
const pulse = document.querySelector('#pulse');
const note = document.querySelector('#note');
const output = document.querySelector('#element-name');
let observer;
let pending = false;
let refreshRunning = false;
let initialAccent;
let appliedTheme;
let pulseTimer;
let layoutObserver;
let observedLayout;

function positionAtmosphere(doc) {
  const field = doc.querySelector('.study-review-layout');
  const panel = doc.querySelector('[data-study-atmosphere-anchor]');
  const otherPanel = doc.querySelector('.study-publication-summary');
  if (!field || !panel || !otherPanel || !field.getClientRects().length) return;
  const bounds = field.getBoundingClientRect();
  const relative = (element) => {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left - bounds.left,
      top: rect.top - bounds.top,
      right: rect.right - bounds.left,
      bottom: rect.bottom - bounds.top,
      width: rect.width,
      height: rect.height,
    };
  };
  const anchor = relative(panel);
  const obstacle = relative(otherPanel);
  const center = {x: (anchor.left + anchor.right) / 2, y: (anchor.top + anchor.bottom) / 2};
  const candidates = [
    {direction: 'left', left: 0, top: 0, right: anchor.left, bottom: bounds.height},
    {direction: 'right', left: anchor.right, top: 0, right: bounds.width, bottom: bounds.height},
    {direction: 'above', left: 0, top: 0, right: bounds.width, bottom: anchor.top},
    {direction: 'below', left: 0, top: anchor.bottom, right: bounds.width, bottom: bounds.height},
  ].map((region) => {
    const width = Math.max(0, region.right - region.left);
    const height = Math.max(0, region.bottom - region.top);
    const area = width * height;
    const left = Math.max(region.left, obstacle.left),
      right = Math.min(region.right, obstacle.right);
    const top = Math.max(region.top, obstacle.top),
      bottom = Math.min(region.bottom, obstacle.bottom);
    const blocked = Math.max(0, right - left) * Math.max(0, bottom - top);
    const free = Math.max(0, area - blocked);
    return {
      ...region,
      width,
      height,
      free,
      x: free
        ? ((area * (region.left + region.right)) / 2 - (blocked * (left + right)) / 2) / free
        : center.x,
      y: free
        ? ((area * (region.top + region.bottom)) / 2 - (blocked * (top + bottom)) / 2) / free
        : center.y,
    };
  });
  const space = candidates.sort((a, b) => b.free - a.free)[0];
  const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
  const dx = space.x - center.x,
    dy = space.y - center.y;
  // Offset the center only. The same falloff extends in every direction around the panel.
  const spread = Math.max(32, Math.min(96, bounds.width * 0.07));
  const values = {
    '--study-field-x': center.x + clamp(dx * 0.06, spread * 0.4),
    '--study-field-y': center.y + clamp(dy * 0.06, spread * 0.4) + 24,
    '--study-field-radius-x': anchor.width * 0.8 + spread,
    '--study-field-radius-y': anchor.height * 0.9 + spread,
  };
  for (const [key, value] of Object.entries(values)) {
    const css = `${value.toFixed(2)}px`;
    if (field.style.getPropertyValue(key) !== css) field.style.setProperty(key, css);
  }
  field.dataset.studyOpenSpace = space.direction;
}

function observeLayout(doc) {
  const field = doc.querySelector('.study-review-layout');
  if (observedLayout !== field) {
    layoutObserver?.disconnect();
    observedLayout = field;
    if (field) {
      layoutObserver = new ResizeObserver(() => positionAtmosphere(doc));
      for (const element of [
        field,
        ...field.querySelectorAll('.study-publication-summary, .study-manuscripts'),
      ])
        layoutObserver.observe(element);
    }
  }
  positionAtmosphere(doc);
}

const regions = [
  ['.application-bar, .workspace-header, .app-command-bar', 'Application identity'],
  ['.desktop-navigation, .workspace-sidebar, .building-browser', 'Navigation'],
  ['.workspace-stage, .workspace-main > div, .workbench-host, .review-columns', 'Work area'],
  ['.document-workspace, .writing-pane', 'Document work area'],
  ['.analysis-bench', 'Analysis work area'],
  ['.review-desk, .review-form', 'Review work area'],
  ['.document-home, .collection-desk', 'Document collection'],
  ['.inspector, .review-evidence, .investigation-queue', 'Supporting context'],
];

function setTheme(provider) {
  const next = appearance.value;
  if (appliedTheme === next && provider.dataset.wclAppearance === next) return;
  initialAccent ||= provider.style.getPropertyValue('--wcl-accent').trim();
  const roles = deriveAccentRoles(initialAccent, next);
  const values = {
    accent: roles.accent,
    'accent-contrast': roles.contrast,
    'accent-fill': roles.fill,
    'accent-hover-edge': roles.hoverEdge,
  };
  for (const [surface, value] of Object.entries(roles.on)) {
    for (const [name, key] of Object.entries({
      'fill-boundary': 'fillBoundary',
      focus: 'focus',
      'hover-contrast': 'hoverContrast',
      muted: 'muted',
      rail: 'rail',
      soft: 'soft',
    }))
      values[`accent-${name}-on-${surface}`] = value[key];
    value.chartSeries.forEach((color, i) => {
      values[`chart-series-${i + 2}-on-${surface}`] = color;
    });
  }
  for (const [key, value] of Object.entries(values))
    provider.style.setProperty(`--wcl-${key}`, value);
  provider.dataset.wclAppearance = next;
  appliedTheme = next;
}

function markRegions(doc) {
  for (const [selector, name] of regions) {
    for (const element of doc.querySelectorAll(selector)) {
      if (element.dataset.studyName !== name) element.dataset.studyName = name;
    }
  }
  const target = [...doc.querySelectorAll('.study-review-layout')].find(
    (element) => element.getClientRects().length > 0,
  );
  for (const previous of doc.querySelectorAll('[data-study-target]')) {
    if (previous !== target) previous.removeAttribute('data-study-target');
  }
  if (target && !target.hasAttribute('data-study-target')) target.dataset.studyTarget = '';
}

function replay() {
  const doc = frame.contentDocument;
  if (!doc || doc.documentElement.dataset.studyTreatment !== 'proposed') return;
  clearTimeout(pulseTimer);
  const fields = [...doc.querySelectorAll('[data-study-target]')].filter(
    (el) => el.getClientRects().length,
  );
  for (const field of fields) {
    field.removeAttribute('data-study-pulse');
    void field.offsetWidth;
    field.dataset.studyPulse = '';
  }
  pulseTimer = setTimeout(
    () => fields.forEach((field) => field.removeAttribute('data-study-pulse')),
    1000,
  );
}

function apply() {
  const doc = frame.contentDocument;
  const provider = doc?.querySelector('[data-wcl-provider]');
  if (!provider) return;
  if (!doc.getElementById('study-treatment')) {
    const style = doc.createElement('style');
    style.id = 'study-treatment';
    style.textContent = treatment;
    doc.head.append(style);
  }
  const selected = document.querySelector('[name="treatment"]:checked').value;
  const values = {
    studyTreatment: selected,
    studyAppearance: appearance.value,
    studyEmphasis: emphasis.value,
    studyIdentify: String(identify.checked),
  };
  for (const [key, value] of Object.entries(values)) {
    if (doc.documentElement.dataset[key] !== value) doc.documentElement.dataset[key] = value;
  }
  setTheme(provider);
  markRegions(doc);
  observeLayout(doc);
  const busy = Boolean(doc.querySelector('.workspace-commands [data-pending]'));
  if (busy && !refreshRunning) replay();
  refreshRunning = busy;
  pulse.disabled = selected === 'current' || !doc.querySelector('[data-study-target]');
  note.textContent =
    selected === 'current'
      ? 'Current demo styling. Switch to Proposed to compare without losing your place.'
      : emphasis.value === 'idle'
        ? 'Study 3: document review and publication status have separate space. The smaller publication panel sits above the document surface.'
        : 'Emphasized: the glow surrounds Included documents, with its center slightly offset toward open space. Resize to compare its spread.';
}

function nameElement(event) {
  if (!identify.checked) return;
  const doc = frame.contentDocument;
  doc.querySelector('[data-study-pointed]')?.removeAttribute('data-study-pointed');
  const target = event.target.closest(
    '[data-study-name], [data-region], [data-feedback], button, input, textarea, a, [role="tab"]',
  );
  if (!target) return;
  target.dataset.studyPointed = '';
  const region = target.closest('[data-study-name]')?.dataset.studyName;
  const name =
    target.dataset.studyName ||
    target.dataset.region ||
    target.dataset.feedback ||
    target.getAttribute('aria-label') ||
    target.textContent.trim().slice(0, 70) ||
    target.tagName.toLowerCase();
  output.textContent = region && region !== name ? `${region} / ${name}` : name;
}

frame.addEventListener('load', () => {
  observer?.disconnect();
  layoutObserver?.disconnect();
  observedLayout = undefined;
  initialAccent = undefined;
  appliedTheme = undefined;
  refreshRunning = false;
  const doc = frame.contentDocument;
  observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      apply();
    });
  });
  observer.observe(doc.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-pending', 'data-wcl-appearance', 'hidden'],
  });
  doc.addEventListener('pointerover', nameElement);
  doc.addEventListener('focusin', nameElement);
  apply();
});

function loadDemo() {
  frame.title = `${demo.selectedOptions[0].textContent} visual study`;
  frame.src = `/prototypes/${demo.value}/index.html#review`;
}
demo.addEventListener('change', loadDemo);
appearance.addEventListener('change', apply);
emphasis.addEventListener('change', apply);
identify.addEventListener('change', () => {
  apply();
  if (!identify.checked) {
    frame.contentDocument
      .querySelector('[data-study-pointed]')
      ?.removeAttribute('data-study-pointed');
    output.textContent = 'Element names appear here when identification is enabled.';
  }
});
document
  .querySelectorAll('[name="treatment"]')
  .forEach((input) => input.addEventListener('change', apply));
pulse.addEventListener('click', replay);
loadDemo();
