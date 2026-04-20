#!/usr/bin/env node
/**
 * Horizontally centers opaque pixels in a PNG or WebP with transparency.
 * Canvas size is unchanged; content shifts on a transparent background.
 */
import path from 'node:path'
import sharp from 'sharp'
import {
  horizontalAlphaBounds,
  horizontalCenterOffsetX,
  shiftRgbaHorizontally,
} from './horizontal-center-rgba.js'

const DEFAULTS = {
  alphaThreshold: 8,
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
    'Horizontally center image content (by alpha bbox). Canvas size unchanged.',
    '',
    'Usage:',
    '  node scripts/game-asset/center-image.js --input <path> --output <path>',
    '',
    'Options:',
    `  --alpha-threshold <0-255>  min alpha to count as content (default ${DEFAULTS.alphaThreshold})`,
    `  --webp-quality <1-100>       (default ${DEFAULTS.webpQuality})`,
    `  --webp-alpha-quality <0-100> (default ${DEFAULTS.webpAlphaQuality})`,
    `  --webp-effort <0-6>          (default ${DEFAULTS.webpEffort})`,
  ].join('\n')
}

function asNumber(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

async function main() {
  const raw = process.argv.slice(2)
  if (raw.includes('--help') || raw.includes('-h')) {
    console.log(usage())
    process.exit(0)
  }

  const args = parseArgs(raw)
  const inputPath = typeof args.input === 'string' ? args.input.trim() : ''
  const outputPath = typeof args.output === 'string' ? args.output.trim() : ''
  if (!inputPath || !outputPath) {
    console.error('Missing --input or --output.\n')
    console.error(usage())
    process.exit(1)
  }

  const extIn = path.extname(inputPath).toLowerCase()
  const extOut = path.extname(outputPath).toLowerCase()
  if (extIn !== '.png' && extIn !== '.webp') {
    console.error(`Unsupported input extension ${extIn}. Use .png or .webp.`)
    process.exit(1)
  }
  if (extOut !== '.png' && extOut !== '.webp') {
    console.error(`Unsupported output extension ${extOut}. Use .png or .webp.`)
    process.exit(1)
  }

  const alphaThreshold = asNumber(args['alpha-threshold'], DEFAULTS.alphaThreshold)
  const pipeline = sharp(inputPath).ensureAlpha()
  const meta = await pipeline.metadata()
  const width = meta.width
  const height = meta.height
  if (!width || !height) {
    console.error('Could not read image dimensions.')
    process.exit(1)
  }

  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true })
  if (info.channels !== 4) {
    console.error(`Expected 4 channels (RGBA), got ${info.channels}.`)
    process.exit(1)
  }

  const bounds = horizontalAlphaBounds(data, width, height, alphaThreshold)
  if (!bounds) {
    console.error('No opaque pixels found (alpha above threshold); nothing to center.')
    process.exit(1)
  }

  const offsetX = horizontalCenterOffsetX(width, bounds.minX, bounds.maxX)
  const shifted = shiftRgbaHorizontally(data, width, height, offsetX)

  let outSharp = sharp(shifted, {
    raw: { width, height, channels: 4 },
  }).ensureAlpha()

  if (extOut === '.webp') {
    outSharp = outSharp.webp({
      quality: asNumber(args['webp-quality'], DEFAULTS.webpQuality),
      alphaQuality: asNumber(args['webp-alpha-quality'], DEFAULTS.webpAlphaQuality),
      effort: asNumber(args['webp-effort'], DEFAULTS.webpEffort),
    })
  } else {
    outSharp = outSharp.png()
  }

  await outSharp.toFile(outputPath)

  console.log(
    JSON.stringify(
      {
        ok: true,
        input: inputPath,
        output: outputPath,
        width,
        height,
        bounds,
        offsetX,
      },
      null,
      2,
    ),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
