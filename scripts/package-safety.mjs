import {builtinModules} from 'node:module';

import ts from 'typescript';

const NODE_BUILTINS = new Set(
  builtinModules.flatMap((specifier) => [specifier, specifier.replace(/^node:/, '')]),
);
const NODE_GLOBALS = new Set([
  'Buffer',
  '__dirname',
  '__filename',
  'clearImmediate',
  'exports',
  'global',
  'module',
  'process',
  'require',
  'setImmediate',
]);
const GLOBAL_OBJECTS = new Set(['globalThis', 'self', 'window']);

export function findNodeOnlyReferences(source) {
  return [...new Set([...findNodeOnlyImports(source), ...findNodeOnlyGlobals(source)])];
}

export function findNodeOnlyImports(source) {
  const references = new Set();
  const {sourceFile} = analyze(source);

  visit(sourceFile, (node) => {
    const specifier = moduleSpecifier(node);
    if (specifier && isNodeBuiltin(specifier)) references.add(specifier);
  });

  return [...references];
}

export function findNodeOnlyGlobals(source) {
  const references = new Set();
  const {checker, sourceFile} = analyze(source);

  visit(sourceFile, (node) => {
    const reference = nodeGlobalReference(node, checker);
    if (reference) references.add(reference);
  });

  return [...references];
}

export function findStyleImports(source) {
  const references = new Set();
  const {sourceFile} = analyze(source);

  visit(sourceFile, (node) => {
    const specifier = moduleSpecifier(node);
    if (specifier && /\.css(?:[?#].*)?$/.test(specifier)) references.add(specifier);
  });

  return [...references];
}

export function findUnguardedNodeGlobals(source) {
  const references = new Set();
  const {checker, sourceFile} = analyze(source);

  visit(sourceFile, (node) => {
    const reference = nodeGlobalReference(node, checker);
    if (reference && !isGuardedReference(node, reference)) references.add(reference);
  });

  return [...references];
}

function analyze(source) {
  const fileName = '/browser-output.js';
  const options = {
    allowJs: true,
    module: ts.ModuleKind.ESNext,
    noLib: true,
    noResolve: true,
    target: ts.ScriptTarget.Latest,
    types: [],
  };
  const sourceFile = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  const defaultHost = ts.createCompilerHost(options, true);
  const host = {
    ...defaultHost,
    fileExists: (candidate) => candidate === fileName,
    getSourceFile: (candidate) => (candidate === fileName ? sourceFile : undefined),
    readFile: (candidate) => (candidate === fileName ? source : undefined),
  };
  const program = ts.createProgram([fileName], options, host);

  return {checker: program.getTypeChecker(), sourceFile};
}

function visit(node, inspect) {
  inspect(node);
  ts.forEachChild(node, (child) => visit(child, inspect));
}

function moduleSpecifier(node) {
  if (
    (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
    node.moduleSpecifier &&
    ts.isStringLiteralLike(node.moduleSpecifier)
  ) {
    return node.moduleSpecifier.text;
  }

  if (
    ts.isCallExpression(node) &&
    (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
      (ts.isIdentifier(node.expression) && node.expression.text === 'require')) &&
    node.arguments.length >= 1 &&
    ts.isStringLiteralLike(node.arguments[0])
  ) {
    return node.arguments[0].text;
  }

  return undefined;
}

function isNodeBuiltin(specifier) {
  const bareSpecifier = specifier.replace(/^node:/, '');
  const rootSpecifier = bareSpecifier.split('/')[0];
  return (
    specifier.startsWith('node:') ||
    NODE_BUILTINS.has(bareSpecifier) ||
    (rootSpecifier !== undefined && NODE_BUILTINS.has(rootSpecifier))
  );
}

function isRuntimeIdentifier(node) {
  const parent = node.parent;
  if (!parent) return true;

  if (
    (ts.isPropertyAccessExpression(parent) && parent.name === node) ||
    (ts.isPropertyAssignment(parent) && parent.name === node) ||
    (ts.isMethodDeclaration(parent) && parent.name === node) ||
    (ts.isPropertyDeclaration(parent) && parent.name === node) ||
    (ts.isGetAccessorDeclaration(parent) && parent.name === node) ||
    (ts.isSetAccessorDeclaration(parent) && parent.name === node) ||
    (ts.isBindingElement(parent) && parent.propertyName === node) ||
    (ts.isLabeledStatement(parent) && parent.label === node) ||
    (ts.isBreakOrContinueStatement(parent) && parent.label === node) ||
    ts.isImportClause(parent) ||
    ts.isImportSpecifier(parent) ||
    ts.isExportSpecifier(parent)
  ) {
    return false;
  }

  if (
    (ts.isVariableDeclaration(parent) ||
      ts.isParameter(parent) ||
      ts.isFunctionDeclaration(parent) ||
      ts.isFunctionExpression(parent) ||
      ts.isClassDeclaration(parent) ||
      ts.isClassExpression(parent)) &&
    parent.name === node
  ) {
    return false;
  }

  return true;
}

function qualifiedNodeGlobal(node) {
  if (
    ts.isPropertyAccessExpression(node) &&
    ts.isIdentifier(node.expression) &&
    GLOBAL_OBJECTS.has(node.expression.text) &&
    NODE_GLOBALS.has(node.name.text)
  ) {
    return node.name.text;
  }

  if (
    ts.isElementAccessExpression(node) &&
    ts.isIdentifier(node.expression) &&
    GLOBAL_OBJECTS.has(node.expression.text) &&
    ts.isStringLiteralLike(node.argumentExpression) &&
    NODE_GLOBALS.has(node.argumentExpression.text)
  ) {
    return node.argumentExpression.text;
  }

  return undefined;
}

function nodeGlobalReference(node, checker) {
  const qualifiedReference = qualifiedNodeGlobal(node);
  if (qualifiedReference) return qualifiedReference;
  if (
    ts.isIdentifier(node) &&
    NODE_GLOBALS.has(node.text) &&
    isRuntimeIdentifier(node) &&
    !hasLocalBinding(node, checker)
  ) {
    return node.text;
  }
  return undefined;
}

function hasLocalBinding(node, checker) {
  const symbol = checker.getSymbolAtLocation(node);
  return Boolean(
    symbol?.declarations?.some(
      (declaration) =>
        declaration.getSourceFile() === node.getSourceFile() &&
        isLocalBindingDeclaration(declaration, node.text),
    ),
  );
}

function isLocalBindingDeclaration(declaration, name) {
  if (
    ts.isVariableDeclaration(declaration) ||
    ts.isParameter(declaration) ||
    ts.isBindingElement(declaration)
  ) {
    return bindingNameContains(declaration.name, name);
  }
  if (
    ts.isFunctionDeclaration(declaration) ||
    ts.isFunctionExpression(declaration) ||
    ts.isClassDeclaration(declaration) ||
    ts.isClassExpression(declaration) ||
    ts.isImportEqualsDeclaration(declaration)
  ) {
    return declaration.name?.text === name;
  }
  if (ts.isImportClause(declaration) || ts.isImportSpecifier(declaration)) {
    return declaration.name.text === name;
  }
  if (ts.isNamespaceImport(declaration)) return declaration.name.text === name;
  return false;
}

function bindingNameContains(bindingName, name) {
  if (ts.isIdentifier(bindingName)) return bindingName.text === name;
  return bindingName.elements.some((element) =>
    ts.isOmittedExpression(element) ? false : bindingNameContains(element.name, name),
  );
}

function isGuardedReference(node, name) {
  if (isTypeofReference(node)) return true;

  let child = node;
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (ts.isConditionalExpression(parent)) {
      if (child === parent.whenTrue && conditionGuarantees(parent.condition, name, true)) {
        return true;
      }
      if (child === parent.whenFalse && conditionGuarantees(parent.condition, name, false)) {
        return true;
      }
    }

    if (
      ts.isIfStatement(parent) &&
      child === parent.thenStatement &&
      conditionGuarantees(parent.expression, name, true)
    ) {
      return true;
    }

    if (ts.isBinaryExpression(parent) && child === parent.right) {
      if (
        parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken &&
        conditionGuarantees(parent.left, name, true)
      ) {
        return true;
      }
      if (
        parent.operatorToken.kind === ts.SyntaxKind.BarBarToken &&
        conditionGuarantees(parent.left, name, false)
      ) {
        return true;
      }
    }

    child = parent;
  }

  return false;
}

function isTypeofReference(node) {
  return ts.isTypeOfExpression(node.parent) && node.parent.expression === node;
}

function conditionGuarantees(condition, name, whenTruthy) {
  if (ts.isParenthesizedExpression(condition)) {
    return conditionGuarantees(condition.expression, name, whenTruthy);
  }
  if (
    ts.isPrefixUnaryExpression(condition) &&
    condition.operator === ts.SyntaxKind.ExclamationToken
  ) {
    return conditionGuarantees(condition.operand, name, !whenTruthy);
  }
  if (!ts.isBinaryExpression(condition)) return false;

  if (condition.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken && whenTruthy) {
    return (
      conditionGuarantees(condition.left, name, true) ||
      conditionGuarantees(condition.right, name, true)
    );
  }
  if (condition.operatorToken.kind === ts.SyntaxKind.BarBarToken && !whenTruthy) {
    return (
      conditionGuarantees(condition.left, name, false) ||
      conditionGuarantees(condition.right, name, false)
    );
  }

  const leftTypeof = typeofName(condition.left);
  const rightTypeof = typeofName(condition.right);
  const leftText = literalText(condition.left);
  const rightText = literalText(condition.right);
  const operator = condition.operatorToken.kind;

  if (leftTypeof === name && rightText === 'undefined') {
    return equalityGuaranteesDefined(operator, whenTruthy);
  }
  if (rightTypeof === name && leftText === 'undefined') {
    return equalityGuaranteesDefined(operator, whenTruthy);
  }
  if (leftTypeof === name && rightText === 'u') {
    return orderingGuaranteesDefined(operator, whenTruthy, false);
  }
  if (rightTypeof === name && leftText === 'u') {
    return orderingGuaranteesDefined(operator, whenTruthy, true);
  }
  if (leftTypeof === name && rightText !== undefined) {
    return equalityToDefinedTypeGuaranteesDefined(operator, whenTruthy);
  }
  if (rightTypeof === name && leftText !== undefined) {
    return equalityToDefinedTypeGuaranteesDefined(operator, whenTruthy);
  }

  return false;
}

function equalityToDefinedTypeGuaranteesDefined(operator, whenTruthy) {
  if (
    operator === ts.SyntaxKind.EqualsEqualsEqualsToken ||
    operator === ts.SyntaxKind.EqualsEqualsToken
  ) {
    return whenTruthy;
  }
  if (
    operator === ts.SyntaxKind.ExclamationEqualsEqualsToken ||
    operator === ts.SyntaxKind.ExclamationEqualsToken
  ) {
    return !whenTruthy;
  }
  return false;
}

function equalityGuaranteesDefined(operator, whenTruthy) {
  if (
    operator === ts.SyntaxKind.ExclamationEqualsEqualsToken ||
    operator === ts.SyntaxKind.ExclamationEqualsToken
  ) {
    return whenTruthy;
  }
  if (
    operator === ts.SyntaxKind.EqualsEqualsEqualsToken ||
    operator === ts.SyntaxKind.EqualsEqualsToken
  ) {
    return !whenTruthy;
  }
  return false;
}

function orderingGuaranteesDefined(operator, whenTruthy, reversed) {
  const definedWhenTruthy = reversed
    ? operator === ts.SyntaxKind.GreaterThanToken
    : operator === ts.SyntaxKind.LessThanToken;
  const undefinedWhenTruthy = reversed
    ? operator === ts.SyntaxKind.LessThanEqualsToken
    : operator === ts.SyntaxKind.GreaterThanEqualsToken;
  if (definedWhenTruthy) return whenTruthy;
  if (undefinedWhenTruthy) return !whenTruthy;
  return false;
}

function typeofName(node) {
  if (!ts.isTypeOfExpression(node)) return undefined;
  if (ts.isIdentifier(node.expression) && NODE_GLOBALS.has(node.expression.text)) {
    return node.expression.text;
  }
  return qualifiedNodeGlobal(node.expression);
}

function literalText(node) {
  return ts.isStringLiteralLike(node) ? node.text : undefined;
}
