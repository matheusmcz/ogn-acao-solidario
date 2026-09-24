/**
 * Gera variantes responsivas (JPEG + WebP) para diferentes viewports.
 */
import sharp from "sharp";
import { mkdir, access, rename, writeFile } from "node:fs/promises";
import { constants, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcJpg = path.join(root, "images", "voluntarios-acao.jpg");
const outDir = path.join(root, "images");
const WIDTHS = [640, 960, 1200];

async function exists(file) {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(outDir, { recursive: true });
  if (!(await exists(srcJpg))) {
    console.warn("Imagem fonte não encontrada:", srcJpg);
    return;
  }

  const base = await sharp(srcJpg).rotate().toBuffer();

  for (const w of WIDTHS) {
    const resized = await sharp(base)
      .resize({ width: w, withoutEnlargement: true })
      .toBuffer();

    const jpg = path.join(outDir, `voluntarios-acao-${w}.jpg`);
    const webp = path.join(outDir, `voluntarios-acao-${w}.webp`);
    await sharp(resized).jpeg({ quality: 72, mozjpeg: true }).toFile(jpg);
    await sharp(resized).webp({ quality: 72 }).toFile(webp);
    console.log(`  ${w}px → JPEG ${statSync(jpg).size} B | WebP ${statSync(webp).size} B`);
  }

  // Canonical fallback (maior largura) para <img src>
  const canonicalJpg = path.join(outDir, "voluntarios-acao.jpg");
  const canonicalWebp = path.join(outDir, "voluntarios-acao.webp");
  const largestJpg = path.join(outDir, "voluntarios-acao-1200.jpg");
  const largestWebp = path.join(outDir, "voluntarios-acao-1200.webp");
  await sharp(largestJpg).toFile(canonicalJpg + ".tmp");
  await rename(canonicalJpg + ".tmp", canonicalJpg);
  await sharp(largestWebp).toFile(canonicalWebp + ".tmp");
  await rename(canonicalWebp + ".tmp", canonicalWebp);

  console.log("Fallback canónico atualizado:", canonicalJpg, canonicalWebp);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
