import {resolve} from 'node:path';
import ts from 'typescript';

export function createPropsReader(dist) {
  const program = ts.createProgram([resolve(dist, 'index.d.ts')], {
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    target: ts.ScriptTarget.ES2022,
    skipLibCheck: true,
  });
  const checker = program.getTypeChecker();
  const index = program.getSourceFile(resolve(dist, 'index.d.ts'));
  const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(index));
  const byName = new Map(exports.map((symbol) => [symbol.name, symbol]));
  const printer = ts.createPrinter();

  function propsFor(name) {
    const start = byName.get(`${name}Props`);
    if (!start) throw new Error(`No public props found for ${name}`);
    const declarations = new Map();
    const external = new Map();
    const visitSymbol = (original, referenceName) => {
      if (!original) return;
      let symbol = original;
      if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
      for (const declaration of symbol.declarations ?? []) {
        if (!ts.isInterfaceDeclaration(declaration) && !ts.isTypeAliasDeclaration(declaration))
          continue;
        const file = declaration.getSourceFile();
        if (!file.fileName.startsWith(`${dist}/`)) {
          // Public React types are external; standard TS utility types need no import.
          if (file.fileName.includes('/@types/react/') && ts.isExternalModule(file))
            external.set(referenceName, 'react');
          continue;
        }
        const key = `${file.fileName}:${declaration.pos}`;
        if (declarations.has(key)) continue;
        declarations.set(key, declaration);
        const walk = (node) => {
          if (ts.isTypeReferenceNode(node)) {
            visitSymbol(checker.getSymbolAtLocation(node.typeName), node.typeName.getText(file));
          }
          if (ts.isExpressionWithTypeArguments(node)) {
            visitSymbol(
              checker.getSymbolAtLocation(node.expression),
              node.expression.getText(file),
            );
          }
          ts.forEachChild(node, walk);
        };
        walk(declaration);
      }
    };
    visitSymbol(start, `${name}Props`);
    const names = [...declarations.values()].map((node) => node.name.text);
    if (new Set(names).size !== names.length) throw new Error(`Duplicate type names for ${name}`);
    const imports = [...external.keys()].sort();
    return [
      ...(imports.length ? [`import type {${imports.join(', ')}} from 'react';`, ''] : []),
      ...[...declarations.values()].map((node) =>
        printer.printNode(ts.EmitHint.Unspecified, node, node.getSourceFile()),
      ),
    ].join('\n\n');
  }

  return propsFor;
}
