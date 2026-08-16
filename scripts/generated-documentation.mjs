export function findUnexpectedGeneratedDocumentation(existingNames, expectedNames) {
  const expected = new Set(expectedNames);
  return existingNames
    .filter((name) => name.endsWith('.md') && !expected.has(name))
    .sort();
}
