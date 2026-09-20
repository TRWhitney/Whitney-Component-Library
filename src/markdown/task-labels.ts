import type {Nodes} from 'hast';
import type {Root} from 'hast';
import type {Plugin} from 'unified';

function taskText(node: Nodes): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element' && ['input', 'ul', 'ol'].includes(node.tagName)) return '';
  if (node.type === 'element' && node.tagName === 'img') return String(node.properties.alt ?? '');
  return 'children' in node ? node.children.map(taskText).join('') : '';
}

export function labelTaskCheckboxes(tree: Nodes, emptyTask: string): Nodes {
  const visit = (node: Nodes, label?: string): void => {
    if (node.type === 'element' && node.tagName === 'li')
      label = taskText(node).trim() || emptyTask;
    if (
      node.type === 'element' &&
      node.tagName === 'input' &&
      node.properties.type === 'checkbox'
    ) {
      node.properties.ariaLabel = label || emptyTask;
    }
    if ('children' in node) node.children.forEach((child) => visit(child, label));
  };
  visit(tree);
  return tree;
}

export const taskCheckboxLabels: Plugin<[string], Root> = (emptyTask) => (tree) => {
  labelTaskCheckboxes(tree, emptyTask);
};
