import {execFileSync} from 'node:child_process';
import {copyFile, mkdir, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

import {findUnexpectedGeneratedDocumentation} from './generated-documentation.mjs';

const projectRoot = resolve(import.meta.dirname, '..');
const distributionDirectory = resolve(projectRoot, 'dist');
const documentationDirectory = resolve(projectRoot, 'docs', 'components');
const checkGenerated = process.argv.includes('--check');

await rm(distributionDirectory, {force: true, recursive: true});
await mkdir(distributionDirectory, {recursive: true});

execFileSync(
  process.execPath,
  [resolve(projectRoot, 'node_modules', 'typescript', 'bin', 'tsc'), '-p', 'tsconfig.build.json'],
  {cwd: projectRoot, stdio: 'inherit'},
);

await copyFile(
  resolve(projectRoot, 'src', 'styles.css'),
  resolve(distributionDirectory, 'styles.css'),
);

await copyFile(
  resolve(projectRoot, 'src/charts/chart-exploration.css'),
  resolve(distributionDirectory, 'charts/chart-exploration.css'),
);

const contractModule = await import(
  pathToFileURL(resolve(distributionDirectory, 'contracts', 'index.js')).href
);
const publicModule = await import(pathToFileURL(resolve(distributionDirectory, 'index.js')).href);
const packageJson = JSON.parse(await readFile(resolve(projectRoot, 'package.json'), 'utf8'));
const contracts = contractModule.validateComponentContracts(
  contractModule.componentContracts,
  Object.keys(publicModule),
);

await writeFile(
  resolve(distributionDirectory, 'manifest.json'),
  `${JSON.stringify(contractModule.toComponentManifest(contracts), null, 2)}\n`,
);
await writeFile(
  resolve(distributionDirectory, 'agent-index.md'),
  contractModule.renderAgentIndex(contracts),
);

await mkdir(documentationDirectory, {recursive: true});
const expectedDocumentationNames = contracts.map((contract) => `${toKebabCase(contract.name)}.md`);
const existingDocumentationNames = await readdir(documentationDirectory);
const unexpectedDocumentationNames = findUnexpectedGeneratedDocumentation(
  existingDocumentationNames,
  expectedDocumentationNames,
);
if (checkGenerated && unexpectedDocumentationNames.length > 0) {
  throw new Error(
    `Generated documentation has no canonical contract: ${unexpectedDocumentationNames.join(', ')}. Run npm run build to remove it.`,
  );
}
if (!checkGenerated) {
  await Promise.all(
    unexpectedDocumentationNames.map((name) =>
      rm(resolve(documentationDirectory, name), {force: true}),
    ),
  );
}
for (const contract of contracts) {
  const documentationPath = resolve(documentationDirectory, `${toKebabCase(contract.name)}.md`);
  const generatedDocumentation = contractModule.renderContractDocumentation(
    contract,
    packageJson.name,
  );

  if (checkGenerated) {
    const existingDocumentation = await readFile(documentationPath, 'utf8').catch(() => '');
    if (existingDocumentation !== generatedDocumentation) {
      throw new Error(
        `Generated documentation is stale: ${documentationPath}. Run npm run build to update it.`,
      );
    }
  } else {
    await writeFile(documentationPath, generatedDocumentation);
  }
}

function toKebabCase(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
