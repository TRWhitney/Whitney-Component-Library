import {execFileSync} from 'node:child_process';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const projectRoot = resolve(import.meta.dirname, '..');
const compilers = ['typescript', 'typescript-6', 'typescript-7'];
const packageJson = JSON.parse(await readFile(resolve(projectRoot, 'package.json'), 'utf8'));
const contractModule = await import(
  pathToFileURL(resolve(projectRoot, 'dist', 'contracts', 'index.js')).href
);
const fixtureDirectory = await mkdtemp(resolve(projectRoot, '.typecheck-'));
const fixtureSource = contractModule.renderTypeScriptExamples(
  contractModule.componentContracts,
  packageJson.name,
);
const fixtureConfig = {
  extends: '../tsconfig.json',
  compilerOptions: {
    noEmit: true,
    skipLibCheck: false,
    types: ['react', 'react-dom'],
  },
  files: ['./public-api.tsx', './styles.d.ts'],
  exclude: [],
};

await writeFile(resolve(fixtureDirectory, 'public-api.tsx'), fixtureSource);
await writeFile(resolve(fixtureDirectory, 'styles.d.ts'), "declare module '*.css';\n");
await writeFile(
  resolve(fixtureDirectory, 'tsconfig.json'),
  `${JSON.stringify(fixtureConfig, null, 2)}\n`,
);

try {
  for (const compiler of compilers) {
    const executable = resolve(projectRoot, 'node_modules', compiler, 'bin', 'tsc');
    execFileSync(process.execPath, [executable, '--noEmit', '-p', fixtureDirectory], {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    process.stdout.write(`Public declarations compile with ${compiler}.\n`);
  }
} finally {
  await rm(fixtureDirectory, {force: true, recursive: true});
}
