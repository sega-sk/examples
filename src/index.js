import fs from 'fs';
import readline from 'readline';
import { generateImage } from './apiClient.js';

async function promptToken() {
  if (process.env.SIGNUS_API_TOKEN) return process.env.SIGNUS_API_TOKEN;
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (q) => new Promise((res) => rl.question(q, (a) => res(a)));
  const t = await question('Enter SIGNUS API token: ');
  rl.close();
  return t.trim();
}

async function main() {
  const argv = process.argv.slice(2);
  let promptParts = [];
  let similarId = null;
  let genId = null;
  let outFile = null;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--similar' || a === '-s') {
      similarId = argv[++i];
    } else if (a === '--gen-id' || a === '-g') {
      genId = argv[++i];
    } else if (a === '--out' || a === '-o') {
      outFile = argv[++i];
    } else {
      promptParts.push(a);
    }
  }

  const prompt = promptParts.join(' ');
  if (!prompt) {
    console.error('Usage: node src/index.js [--similar <imageId>] [--gen-id <id>] [--out <file>] "A prompt describing the image"');
    console.error('Examples:');
    console.error('  node src/index.js "A sunset over the ocean"');
    console.error('  node src/index.js --similar b472a24a-3323-4d52-a1d2-1128ba7f5311 "Make it more painterly"');
    console.error('  node src/index.js -g 998aa937-30a6-4559-a7fb-a66859d6138e -s b472a24a-3323-4d52-a1d2-1128ba7f5311 "Make it black and white"');
    process.exit(1);
  }

  const token = await promptToken();
  if (!token) {
    console.error('No API token provided. Aborting.');
    process.exit(1);
  }

  try {
    const res = await generateImage(prompt, token, { generationId: genId, similarImageId: similarId });
    let filename = outFile;
    if (res.type === 'json') {
      filename = filename || 'output.json';
      fs.writeFileSync(filename, JSON.stringify(res.data, null, 2));
      console.log(`Saved JSON response to ${filename}`);
    } else {
      const contentType = (res.contentType || '').toLowerCase();
      let ext = 'bin';
      if (contentType.includes('png')) ext = 'png';
      else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpg';
      else if (contentType.includes('webp')) ext = 'webp';
      filename = filename || `output.${ext}`;
      fs.writeFileSync(filename, res.data);
      console.log(`Saved binary response to ${filename} (Content-Type: ${res.contentType || 'unknown'})`);
    }
  } catch (err) {
    console.error('Request failed:', err.message);
    process.exit(1);
  }
}

main();
