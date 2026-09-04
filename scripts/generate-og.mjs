/**
 * Rasterises public/og.svg into public/og.png.
 *
 * Social platforms want PNG/JPG, so the SVG is the editable source and the PNG
 * is committed alongside it. Re-run `pnpm og` after changing the SVG.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('sharp is not installed. Run: pnpm add -D sharp')
  process.exit(1)
}

const svg = await readFile(join(root, 'public/og.svg'))
const png = await sharp(svg, { density: 144 }).resize(1200, 630).png({ quality: 90 }).toBuffer()
await writeFile(join(root, 'public/og.png'), png)

console.log(`Wrote public/og.png (${(png.length / 1024).toFixed(0)} KB)`)
