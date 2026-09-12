import {Facet, StateEffect} from '@codemirror/state';

export const liveFocus = StateEffect.define<boolean>();
export const liveComposition = StateEffect.define<boolean>();

import {englishLabels} from './markdown-labels.js';
import type {MarkdownEditorLabels} from './markdown-types.js';

export const liveLabels = Facet.define<MarkdownEditorLabels, MarkdownEditorLabels>({
  combine: (values) => values[0] ?? englishLabels,
});
