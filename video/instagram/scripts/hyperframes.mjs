import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {chromium} from 'playwright';
const env = {...process.env};
if (!env.HYPERFRAMES_BROWSER_PATH) {
  const binary = chromium.executablePath();
  if (fs.existsSync(binary)) env.HYPERFRAMES_BROWSER_PATH = binary;
}
const result = spawnSync(process.execPath, ['node_modules/hyperframes/bin/hyperframes.mjs', ...process.argv.slice(2)], {env, stdio: 'inherit'});
process.exit(result.status ?? 1);
