#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DEFAULTS = {
  padding: 24,
  maxWidth: 512,
  maxHeight: 512,
  bgFuzz: 18,
  alphaThreshold: 8,
  minAlpha: 0,
  png: true,
  webp: true,
  webpQuality: 85,
  webpAlphaQuality: 100,
  webpEffort: 4,
}

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = argv[i + 1]
    if (!arg.startsWith('--')) continue
    if (!next || next.startsWith('--')) {
      args[arg.slice(2)] = true
      continue
    }
    args[arg.slice(2)] = next
    i += 1
  }
  return args
}

function usage() {
  return [
    'Usage:',
    '  node scripts/game-asset/clean-accessory.js \\',
    '    --input <path-to-image> \\',
    '    --output-dir <directory> \\',
    '    [--name <base-name>] \\',
    '    [--padding <number>] \\',
    '    [--max-width <number>] \\',
    '    [--max-height <number>] \\',
    '    [--bg-fuzz <number>] \\',
    '    [--bg-anywhere] \\',
    '    [--alpha-threshold <number>] \\',
    '    [--min-alpha <number>] \\',
    '    [--png] \\',
    '    [--webp] \\',
    '    [--webp-quality <number>] \\',
    '    [--webp-alpha-quality <number>] \\',
    '    [--webp-effort <number>] \\',
    '    [--dry-run] \\',
    '    [--metadata]',
    '',
    'Defaults:',
    `  padding=${DEFAULTS.padding}, max-width=${DEFAULTS.maxWidth}, max-height=${DEFAULTS.maxHeight}`,
    `  bg-fuzz=${DEFAULTS.bgFuzz}, alpha-threshold=${DEFAULTS.alphaThreshold}, min-alpha=${DEFAULTS.minAlpha}`,
    `  png=${DEFAULTS.png}, webp=${DEFAULTS.webp}`,
    `  webp-quality=${DEFAULTS.webpQuality}, webp-alpha-quality=${DEFAULTS.webpAlphaQuality}, webp-effort=${DEFAULTS.webpEffort}`,
    '',
    'Example:',
    '  node scripts/game-asset/clean-accessory.js \\',
    '    --input data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/accessories/overlay-sunglasses.png \\',
    '    --output-dir data/teddy-bear-math-lovable/visuals/pets/rosebud.ai/accessories/cleaned \\',
    '    --padding 20 --max-width 512 --max-height 512 --metadata',
  ].join('\n')
}

function asString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function asNumber(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function asInt(value, fallback) {
  return Math.round(asNumber(value, fallback))
}

function slugify(value) {
  const cleaned = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return cleaned || 'accessory'
}

function resolveFormatFlags(args) {
  const pngExplicit = Object.prototype.hasOwnProperty.call(args, 'png')
  const webpExplicit = Object.prototype.hasOwnProperty.call(args, 'webp')
  if (!pngExplicit && !webpExplicit) {
    return { png: true, webp: true }
  }
  return {
    png: pngExplicit,
    webp: webpExplicit,
  }
}

function buildOptions(args) {
  const formats = resolveFormatFlags(args)
  return {
    input: asString(args.input),
    outputDir: asString(args['output-dir']),
    name: asString(args.name),
    padding: asInt(args.padding, DEFAULTS.padding),
    maxWidth: asInt(args['max-width'], DEFAULTS.maxWidth),
    maxHeight: asInt(args['max-height'], DEFAULTS.maxHeight),
    bgFuzz: asNumber(args['bg-fuzz'], DEFAULTS.bgFuzz),
    bgAnywhere: Boolean(args['bg-anywhere']),
    alphaThreshold: asInt(args['alpha-threshold'], DEFAULTS.alphaThreshold),
    minAlpha: asInt(args['min-alpha'], DEFAULTS.minAlpha),
    png: formats.png,
    webp: formats.webp,
    webpQuality: asInt(args['webp-quality'], DEFAULTS.webpQuality),
    webpAlphaQuality: asInt(
      args['webp-alpha-quality'],
      DEFAULTS.webpAlphaQuality
    ),
    webpEffort: asInt(args['webp-effort'], DEFAULTS.webpEffort),
    dryRun: Boolean(args['dry-run']),
    metadata: Boolean(args.metadata),
  }
}

function isBgLike(rawData, width, pixel, inferredBg, bgFuzz) {
  const idx = pixel * 4
  const r = rawData[idx]
  const g = rawData[idx + 1]
  const b = rawData[idx + 2]
  const dist = rgbDistance({ r, g, b }, inferredBg)
  return dist <= bgFuzz
}

function edgeConnectedBackgroundMask(rawData, width, height, inferredBg, bgFuzz) {
  const total = width * height
  const visited = new Uint8Array(total)
  const queue = new Uint32Array(total)
  let qHead = 0
  let qTail = 0

  function enqueueIfBg(pixel) {
    if (visited[pixel] === 1) return
    if (!isBgLike(rawData, width, pixel, inferredBg, bgFuzz)) return
    visited[pixel] = 1
    queue[qTail] = pixel
    qTail += 1
  }

  for (let x = 0; x < width; x += 1) {
    enqueueIfBg(x)
    enqueueIfBg((height - 1) * width + x)
  }
  for (let y = 1; y < height - 1; y += 1) {
    enqueueIfBg(y * width)
    enqueueIfBg(y * width + (width - 1))
  }

  while (qHead < qTail) {
    const pixel = queue[qHead]
    qHead += 1
    const x = pixel % width
    const y = Math.floor(pixel / width)
    if (x > 0) enqueueIfBg(pixel - 1)
    if (x + 1 < width) enqueueIfBg(pixel + 1)
    if (y > 0) enqueueIfBg(pixel - width)
    if (y + 1 < height) enqueueIfBg(pixel + width)
  }

  return visited
}

function validateArgs(options) {
  if (!options.input) throw new Error('Missing required --input <path-to-image>')
  if (!options.outputDir) {
    throw new Error('Missing required --output-dir <directory>')
  }
  if (!options.png && !options.webp) {
    throw new Error('At least one output format must be enabled (--png or --webp)')
  }
  if (options.padding < 0) throw new Error('--padding must be >= 0')
  if (options.maxWidth <= 0) throw new Error('--max-width must be > 0')
  if (options.maxHeight <= 0) throw new Error('--max-height must be > 0')
  if (options.bgFuzz < 0) throw new Error('--bg-fuzz must be >= 0')
  if (options.alphaThreshold < 0 || options.alphaThreshold > 255) {
    throw new Error('--alpha-threshold must be between 0 and 255')
  }
  if (options.minAlpha < 0 || options.minAlpha > 255) {
    throw new Error('--min-alpha must be between 0 and 255')
  }
}

function pixelIndex(x, y, width) {
  return (y * width + x) * 4
}

function colorAt(rawData, width, x, y) {
  const idx = pixelIndex(x, y, width)
  return {
    r: rawData[idx],
    g: rawData[idx + 1],
    b: rawData[idx + 2],
    a: rawData[idx + 3],
  }
}

function sampleCornerColors(rawData, width, height) {
  const sampleSize = Math.max(2, Math.min(10, Math.floor(Math.min(width, height) * 0.04)))
  const corners = [
    { name: 'top-left', x0: 0, y0: 0 },
    { name: 'top-right', x0: Math.max(0, width - sampleSize), y0: 0 },
    { name: 'bottom-left', x0: 0, y0: Math.max(0, height - sampleSize) },
    {
      name: 'bottom-right',
      x0: Math.max(0, width - sampleSize),
      y0: Math.max(0, height - sampleSize),
    },
  ]
  return corners.map((corner) => {
    let r = 0
    let g = 0
    let b = 0
    let totalWeight = 0
    for (let y = corner.y0; y < corner.y0 + sampleSize; y += 1) {
      for (let x = corner.x0; x < corner.x0 + sampleSize; x += 1) {
        const c = colorAt(rawData, width, x, y)
        const weight = c.a + 1
        r += c.r * weight
        g += c.g * weight
        b += c.b * weight
        totalWeight += weight
      }
    }
    return {
      corner: corner.name,
      r: Math.round(r / totalWeight),
      g: Math.round(g / totalWeight),
      b: Math.round(b / totalWeight),
    }
  })
}

function rgbDistance(a, b) {
  const dr = a.r - b.r
  const dg = a.g - b.g
  const db = a.b - b.b
  return Math.sqrt(dr * dr + dg * dg + db * db)
}

function inferBackgroundColor(samples) {
  let best = samples[0]
  let bestScore = Number.POSITIVE_INFINITY
  for (const candidate of samples) {
    let score = 0
    for (const other of samples) {
      score += rgbDistance(candidate, other)
    }
    if (score < bestScore) {
      bestScore = score
      best = candidate
    }
  }
  return { r: best.r, g: best.g, b: best.b, fromCorner: best.corner }
}

async function removeBackgroundByCornerSampling(inputPath, options) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const rawData = new Uint8ClampedArray(data)
  const cornerSamples = sampleCornerColors(rawData, width, height)
  const inferredBg = inferBackgroundColor(cornerSamples)
  const bgFuzz = Math.max(0, options.bgFuzz)
  const alphaThreshold = options.alphaThreshold
  const minAlpha = options.minAlpha
  const bgMask =
    bgFuzz > 0 && !options.bgAnywhere
      ? edgeConnectedBackgroundMask(rawData, width, height, inferredBg, bgFuzz)
      : null

  let changedPixels = 0
  let forcedTransparent = 0
  for (let i = 0; i < rawData.length; i += 4) {
    const r = rawData[i]
    const g = rawData[i + 1]
    const b = rawData[i + 2]
    const alpha = rawData[i + 3]

    if (alpha <= alphaThreshold) {
      if (alpha !== 0) changedPixels += 1
      rawData[i + 3] = 0
      forcedTransparent += 1
      continue
    }

    if (bgFuzz > 0) {
      if (bgMask && bgMask[i / 4] !== 1) {
        continue
      }
      const dist = rgbDistance({ r, g, b }, inferredBg)
      if (dist <= bgFuzz) {
        const factor = dist / bgFuzz
        const softened = Math.round(alpha * factor * factor)
        if (softened !== alpha) changedPixels += 1
        rawData[i + 3] = softened
      }
    }

    if (rawData[i + 3] < minAlpha) {
      if (rawData[i + 3] !== 0) changedPixels += 1
      rawData[i + 3] = 0
      forcedTransparent += 1
    }
  }

  const cleanedBuffer = await sharp(Buffer.from(rawData), {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer()

  return {
    buffer: cleanedBuffer,
    width,
    height,
    inferredBackgroundColor: inferredBg,
    cornerSamples,
    changedPixels,
    forcedTransparent,
  }
}

function findOpaqueBounds(rawData, width, height) {
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = pixelIndex(x, y, width)
      const alpha = rawData[idx + 3]
      if (alpha === 0) continue
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }

  if (maxX < minX || maxY < minY) return null
  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  }
}

async function trimPadResize(bufferOrPath, options) {
  const { data, info } = await sharp(bufferOrPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const bounds = findOpaqueBounds(data, info.width, info.height)
  let image = sharp(bufferOrPath).ensureAlpha()
  if (bounds) {
    image = image.extract(bounds)
  }

  const padded = await image
    .extend({
      top: options.padding,
      right: options.padding,
      bottom: options.padding,
      left: options.padding,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  const { data: resizedRaw, info: resizedInfo } = await sharp(padded)
    .resize({
      width: options.maxWidth,
      height: options.maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const outputBuffer = await sharp(Buffer.from(resizedRaw), {
    raw: {
      width: resizedInfo.width,
      height: resizedInfo.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer()

  return {
    buffer: outputBuffer,
    width: resizedInfo.width,
    height: resizedInfo.height,
    trimBounds: bounds,
  }
}

async function savePng(buffer, outputPath) {
  await sharp(buffer).png().toFile(outputPath)
}

async function saveWebp(buffer, outputPath, options) {
  await sharp(buffer)
    .webp({
      quality: options.webpQuality,
      alphaQuality: options.webpAlphaQuality,
      effort: options.webpEffort,
    })
    .toFile(outputPath)
}

function deriveBaseName(inputPath, explicitName) {
  if (explicitName) return slugify(explicitName)
  return slugify(path.basename(inputPath, path.extname(inputPath)))
}

async function main() {
  const rawArgs = parseArgs(process.argv.slice(2))
  if (rawArgs.help || rawArgs.h) {
    console.log(usage())
    process.exit(0)
  }

  const options = buildOptions(rawArgs)
  validateArgs(options)

  const baseName = deriveBaseName(options.input, options.name)
  const pngPath = path.join(options.outputDir, `${baseName}-clean.png`)
  const webpPath = path.join(options.outputDir, `${baseName}-clean.webp`)
  const metadataPath = path.join(options.outputDir, `${baseName}-clean.json`)

  const cleaned = await removeBackgroundByCornerSampling(options.input, options)
  const processed = await trimPadResize(cleaned.buffer, options)

  const wouldWrite = []
  if (options.png) wouldWrite.push(pngPath)
  if (options.webp) wouldWrite.push(webpPath)
  if (options.metadata) wouldWrite.push(metadataPath)

  if (options.dryRun) {
    console.log('Dry run enabled. No files written.')
    console.log(`Input: ${options.input}`)
    console.log(`Output dir: ${options.outputDir}`)
    console.log(`Inferred background: ${JSON.stringify(cleaned.inferredBackgroundColor)}`)
    console.log(`Size before: ${cleaned.width}x${cleaned.height}`)
    console.log(`Size after: ${processed.width}x${processed.height}`)
    console.log('Would write:')
    for (const outputPath of wouldWrite) console.log(`  - ${outputPath}`)
    return
  }

  await mkdir(options.outputDir, { recursive: true })

  if (options.png) await savePng(processed.buffer, pngPath)
  if (options.webp) await saveWebp(processed.buffer, webpPath, options)

  if (options.metadata) {
    const metadata = {
      inputPath: options.input,
      outputPaths: {
        png: options.png ? pngPath : null,
        webp: options.webp ? webpPath : null,
        metadata: metadataPath,
      },
      before: {
        width: cleaned.width,
        height: cleaned.height,
      },
      after: {
        width: processed.width,
        height: processed.height,
      },
      options,
      inferredBackgroundColor: cleaned.inferredBackgroundColor,
      cornerSamples: cleaned.cornerSamples,
      cleanupStats: {
        changedPixels: cleaned.changedPixels,
        forcedTransparent: cleaned.forcedTransparent,
      },
      outputsWritten: {
        png: options.png,
        webp: options.webp,
      },
    }
    await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8')
  }

  console.log(`Cleaned accessory: ${options.input}`)
  console.log(`Size before: ${cleaned.width}x${cleaned.height}`)
  console.log(`Size after: ${processed.width}x${processed.height}`)
  console.log(`Inferred background: ${JSON.stringify(cleaned.inferredBackgroundColor)}`)
  if (options.png) console.log(`PNG: ${pngPath}`)
  if (options.webp) console.log(`WebP: ${webpPath}`)
  if (options.metadata) console.log(`Metadata: ${metadataPath}`)
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Error: ${message}`)
  console.error('\nUse --help to see usage.')
  process.exit(1)
})
