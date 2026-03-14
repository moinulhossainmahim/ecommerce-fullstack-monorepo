import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sharedSrcPath = path.resolve(__dirname, "../src");
const sharedDistPath = path.resolve(__dirname, "../dist");
const assetsSrcPath = path.join(sharedSrcPath, "assets");
const assetsDistPath = path.join(sharedDistPath, "assets");

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(source)) return;
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

  const files = fs.readdirSync(source);
  for (const file of files) {
    const currentSource = path.join(source, file);
    const currentTarget = path.join(target, file);

    if (fs.lstatSync(currentSource).isDirectory()) {
      copyFolderRecursiveSync(currentSource, currentTarget);
    } else {
      fs.copyFileSync(currentSource, currentTarget);
    }
  }
}

function copyAssets() {
  if (!fs.existsSync(assetsSrcPath)) return;
  copyFolderRecursiveSync(assetsSrcPath, assetsDistPath);
}

copyAssets();

const isWatch = process.argv.includes("--watch");
if (isWatch && fs.existsSync(assetsSrcPath)) {
  fs.watch(assetsSrcPath, { recursive: true }, () => copyAssets());
}
