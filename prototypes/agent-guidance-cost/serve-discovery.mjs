// Evaluation-only static host. Prefix build asset URLs without changing authored files.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';

const root = resolve(process.argv[2]);
const port = Number(process.argv[3] ?? 5200);
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};
createServer(async (request, response) => {
  const match = new URL(request.url, `http://127.0.0.1:${port}`).pathname.match(
    /^\/(trial-\d{2})\/(.*)$/,
  );
  if (!match) {
    response.writeHead(404).end();
    return;
  }
  const [, trial, suffix] = match;
  const base = resolve(root, trial, 'dist');
  const file = resolve(base, suffix || 'index.html');
  if (!file.startsWith(`${base}/`)) {
    response.writeHead(404).end();
    return;
  }
  try {
    let data = await readFile(file);
    if (extname(file) === '.html')
      data = Buffer.from(data.toString().replaceAll('"/assets/', `"/${trial}/assets/`));
    response
      .writeHead(200, {
        'Content-Type': types[extname(file)] ?? 'application/octet-stream',
        'Cache-Control': 'no-store',
      })
      .end(data);
  } catch {
    response.writeHead(404).end();
  }
}).listen(port, '127.0.0.1', () =>
  console.log(`Discovery evaluation host http://127.0.0.1:${port}`),
);
