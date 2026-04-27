#!/usr/bin/env node
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
// Models
// - black-forest-labs/flux.2-klein-4b
// - black-forest-labs/flux.2-pro
// - google/gemini-2.5-flash-image
// - google/gemini-3.1-flash-image-preview
// - openai/gpt-5-image-mini
const DEFAULT_MODEL = 'black-forest-labs/flux.2-klein-4b'
const DEFAULT_STYLE_SPEC =
  'Cute 2D kids-game illustration, soft rounded shapes, clean outline, gentle shading but no shadows outside the outline, warm pastel-friendly palette, toy-like aesthetic, simple readable forms, non-realistic.'
const VALID_MODES = new Set(['variation', 'overlay', 'background', 'composed'])

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
    '  node scripts/game-asset/generate-game-asset-openrouter.js \\',
    '    [--mode <variation|overlay|background|composed>] \\',
    '    [--input <image-path>] \\',
    '    --output-dir <directory> \\',
    '    [--prompt "<custom prompt>"] \\',
    '    [--model <openrouter-model>] \\',
    '    [--api-key <api-key>] \\',
    '    [--webp|--no-webp] [--png|--no-png] \\',
    '    [--webp-quality <number>] [--webp-alpha-quality <number>] [--webp-effort <number>] \\',
    '    [--dry-run] [--text-only] [--save-prompt] [--metadata]',
    '',
    'Environment:',
    '  OPENROUTER_API_KEY_TEDDYBEAR_MATH is used by default.',
    '',
    'Examples:',
    '  1) Overlay:',
    '     node scripts/game-asset/generate-game-asset-openrouter.js \\',
    '       --mode overlay --category glasses --item sunglasses --subtype "retro round" --output-dir ./out',
    '',
    '  2) Background:',
    '     node scripts/game-asset/generate-game-asset-openrouter.js \\',
    '       --mode background --scene "beach" --composition portrait --output-dir ./out',
  ].join('\n')
}

function asOptionalString(value) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null
}

function asOptionalNumber(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function buildOptions(args) {
  return {
    mode: asOptionalString(args.mode),
    input: asOptionalString(args.input),
    outputDir: asOptionalString(args['output-dir']),
    prompt: asOptionalString(args.prompt),
    model: asOptionalString(args.model) || DEFAULT_MODEL,
    apiKey:
      asOptionalString(args['api-key']) ||
      process.env.OPENROUTER_API_KEY_TEDDYBEAR_MATH,
    styleSpec: asOptionalString(args['style-spec']),
    useReferenceImage: Boolean(args['use-reference-image']),
    palette: asOptionalString(args.palette),
    visualStyle: asOptionalString(args['visual-style']),
    category: asOptionalString(args.category),
    item: asOptionalString(args.item),
    subtype: asOptionalString(args.subtype),
    primaryColor: asOptionalString(args['primary-color']),
    secondaryColor: asOptionalString(args['secondary-color']),
    accentColor: asOptionalString(args['accent-color']),
    pattern: asOptionalString(args.pattern),
    vibe: asOptionalString(args.vibe),
    targetPosition: asOptionalString(args['target-position']),
    size: asOptionalString(args.size),
    scene: asOptionalString(args.scene),
    composition: asOptionalString(args.composition),
    subjectZone: asOptionalString(args['subject-zone']),
    emptySpaceForCharacter: Boolean(args['empty-space-for-character']),
    timeOfDay: asOptionalString(args['time-of-day']),
    weather: asOptionalString(args.weather),
    season: asOptionalString(args.season),
    lighting: asOptionalString(args.lighting),
    backgroundDetail: asOptionalString(args['background-detail']),
    animal: asOptionalString(args.animal),
    action: asOptionalString(args.action),
    expression: asOptionalString(args.expression),
    heldItem: asOptionalString(args['held-item']),
    backgroundScene: asOptionalString(args['background-scene']),
    dryRun: Boolean(args['dry-run']),
    textOnly: Boolean(args['text-only']),
    savePrompt: Boolean(args['save-prompt']),
    metadata: Boolean(args.metadata),
    webp: args['no-webp'] ? false : true,
    png: args['no-png'] ? false : true,
    webpQuality: asOptionalNumber(args['webp-quality'], 85),
    webpAlphaQuality: asOptionalNumber(args['webp-alpha-quality'], 100),
    webpEffort: asOptionalNumber(args['webp-effort'], 4),
  }
}

function hasEnoughVariationText(options) {
  return Boolean(
    options.item ||
      options.animal ||
      options.action ||
      options.expression ||
      options.heldItem ||
      options.backgroundScene ||
      options.styleSpec,
  )
}

function validateArgs(options) {
  if (!options.outputDir) {
    throw new Error('Missing required --output-dir <directory>')
  }
  if (!options.prompt && !options.mode) {
    throw new Error('Provide --mode unless --prompt is provided')
  }
  if (options.mode && !VALID_MODES.has(options.mode)) {
    throw new Error('Invalid --mode. Use variation|overlay|background|composed')
  }
  if (!options.apiKey && !options.dryRun) {
    throw new Error('Missing OPENROUTER_API_KEY_TEDDYBEAR_MATH (or --api-key)')
  }
  if (options.useReferenceImage && !options.input) {
    throw new Error('--use-reference-image requires --input')
  }
  if (options.mode === 'overlay' && !options.prompt && !options.item && !options.category) {
    throw new Error('Overlay mode requires --item or --category (or --prompt)')
  }
  if (options.mode === 'variation' && !options.prompt) {
    if (!options.input && !hasEnoughVariationText(options)) {
      throw new Error(
        'Variation mode needs --input or enough text context (e.g., --item)',
      )
    }
  }
  if (!options.png && !options.webp) {
    throw new Error('At least one output format must be enabled (--png or --webp)')
  }
}

function shouldUseReferenceImage(options) {
  if (options.textOnly) return false
  if (!options.input) return false
  if (options.useReferenceImage) return true
  return options.mode === 'variation'
}

function buildStyleSpec(options) {
  const parts = [options.styleSpec || DEFAULT_STYLE_SPEC]
  if (options.visualStyle) parts.push(`Visual style emphasis: ${options.visualStyle}.`)
  if (options.palette) parts.push(`Palette guidance: ${options.palette}.`)
  if (shouldUseReferenceImage(options)) {
    parts.push(
      'Use the attached image as style reference only. Do not reproduce the character unless the mode explicitly requires it.',
    )
  }
  return parts.join(' ')
}

function pushIf(lines, label, value) {
  if (value) lines.push(`${label}: ${value}`)
}

function buildVariationPrompt(options) {
  const lines = [
    'Generate exactly one image variation.',
    'Preserve original style and palette while introducing requested changes.',
    'If holding an item, animal appendages to be used always.',
    `Style spec: ${buildStyleSpec(options)}`,
  ]
  pushIf(lines, 'Variation request', options.item)
  pushIf(lines, 'Animal', options.animal)
  pushIf(lines, 'Action', options.action)
  pushIf(lines, 'Expression', options.expression)
  pushIf(lines, 'Held item', options.heldItem)
  pushIf(lines, 'Background scene', options.backgroundScene)
  lines.push('Return exactly one image.')
  return lines.join('\n')
}

function buildOverlayPrompt(options) {
  const lines = [
    'Generate exactly one standalone wearable overlay accessory asset.',
    'Transparent background only.',
    'No character, body, face, or extra props unless explicitly requested.',
    'Center the asset with minimal padding for reusable layering across different animals.',
    'Front-facing or simple readable perspective.',
    'Soft rounded shapes, clean outlines, simple shading, cute 2D kids-game readability.',
    'No shadows outside the character outline.',
    `Style spec: ${buildStyleSpec(options)}`,
  ]
  pushIf(lines, 'Category', options.category)
  pushIf(lines, 'Item', options.item)
  pushIf(lines, 'Subtype', options.subtype)
  pushIf(lines, 'Primary color', options.primaryColor)
  pushIf(lines, 'Secondary color', options.secondaryColor)
  pushIf(lines, 'Accent color', options.accentColor)
  pushIf(lines, 'Pattern', options.pattern)
  pushIf(lines, 'Vibe', options.vibe)
  pushIf(lines, 'Target position', options.targetPosition)
  pushIf(lines, 'Size', options.size)
  lines.push('Return exactly one image.')
  return lines.join('\n')
}

function buildBackgroundPrompt(options) {
  const lines = [
    'Generate exactly one portrait-mobile-friendly background illustration.',
    'Strictly no characters of any kind.',
    'No animals, birds, fish, insects, pets, fantasy creatures, people, faces, silhouettes, or statues shaped like living beings.',
    'Natural environment only: no props, furniture, food, toys, signs, tools, vehicles, buildings, or other man-made objects.',
    'Do not place focal foreground objects; keep foreground simple and clean for overlay compositing.',
    'Leave clear empty space for character placement.',
    'Cute kids-game illustration style, simple readable composition, not too busy.',
    'Suitable as an underlay behind an animal character.',
    `Style spec: ${buildStyleSpec(options)}`,
  ]
  pushIf(lines, 'Scene', options.scene)
  if (options.scene) {
    lines.push(
      'Interpret the scene label as mood/setting guidance only; avoid literal themed props.',
    )
  }
  pushIf(lines, 'Composition', options.composition || 'portrait')
  pushIf(lines, 'Subject zone', options.subjectZone)
  if (options.emptySpaceForCharacter) {
    lines.push('Enforce extra empty-space-for-character in the requested subject zone.')
  }
  lines.push(
    'Output must be background-only scenery. If any living character or prop appears, regenerate internally and return a clean environment-only image.',
  )
  pushIf(lines, 'Time of day', options.timeOfDay)
  pushIf(lines, 'Weather', options.weather)
  pushIf(lines, 'Season', options.season)
  pushIf(lines, 'Lighting', options.lighting)
  pushIf(lines, 'Background detail', options.backgroundDetail)
  lines.push('Return exactly one image.')
  return lines.join('\n')
}

function buildComposedVariationPrompt(options) {
  const lines = [
    'Generate exactly one composed variation image for a kids-game asset pipeline.',
    'This is a future-ready scaffold for richer compositions (animal + action + expression + held item + scene).',
    'Keep forms simple and readable for game asset production.',
    `Style spec: ${buildStyleSpec(options)}`,
  ]
  pushIf(lines, 'Animal', options.animal)
  pushIf(lines, 'Action', options.action)
  pushIf(lines, 'Expression', options.expression)
  pushIf(lines, 'Held item', options.heldItem)
  pushIf(lines, 'Background scene', options.backgroundScene)
  pushIf(lines, 'Item', options.item)
  lines.push('Return exactly one image.')
  return lines.join('\n')
}

function buildPrompt(options) {
  if (options.prompt) return options.prompt
  if (options.mode === 'overlay') return buildOverlayPrompt(options)
  if (options.mode === 'background') return buildBackgroundPrompt(options)
  if (options.mode === 'composed') return buildComposedVariationPrompt(options)
  return buildVariationPrompt(options)
}

function isPng(inputPath) {
  return path.extname(inputPath).toLowerCase() === '.png'
}

async function buildPngDataUrl(inputPath) {
  const inputBytes = await readFile(inputPath)
  const pngBytes = isPng(inputPath)
    ? inputBytes
    : await sharp(inputBytes).png().toBuffer()
  return `data:image/png;base64,${pngBytes.toString('base64')}`
}

async function saveWebp(inputPath, outputPath, options = {}) {
  const {
    quality = 85,
    alphaQuality = 100,
    effort = 4,
  } = options

  await sharp(inputPath)
    .webp({
      quality,
      alphaQuality,
      effort,
    })
    .toFile(outputPath)
}

function firstImageDataUrl(message) {
  const images = message?.images
  if (!Array.isArray(images) || images.length === 0) return null
  const first = images[0]
  const url = first?.image_url?.url ?? first?.imageUrl?.url ?? first?.url
  return typeof url === 'string' ? url : null
}

function base64FromDataUrl(dataUrl) {
  const match = /^data:image\/[^;]+;base64,(.+)$/s.exec(dataUrl)
  return match ? match[1] : null
}

function slugify(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}

function descriptorForMode(options) {
  if (options.mode === 'overlay') {
    return slugify([options.item, options.subtype, options.category].filter(Boolean).join(' '))
  }
  if (options.mode === 'background') {
    return slugify([options.scene, options.composition].filter(Boolean).join(' '))
  }
  if (options.mode === 'composed') {
    return slugify([options.animal, options.action, options.backgroundScene].filter(Boolean).join(' '))
  }
  return slugify([options.item, options.animal, options.action].filter(Boolean).join(' '))
}

function outputBaseName(options) {
  const mode = options.mode || 'custom'
  const descriptor = descriptorForMode(options) || 'asset'
  return `${mode}-${descriptor}-${Date.now()}`
}

async function callOpenRouter({ apiKey, model, prompt, imageDataUrl }) {
  const content = [{ type: 'text', text: prompt }]
  if (imageDataUrl) {
    content.push({ type: 'image_url', image_url: { url: imageDataUrl } })
  }
  const body = {
    model,
    messages: [{ role: 'user', content }],
    modalities: ['image'],
  }
  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`OpenRouter response not JSON (${res.status}): ${text.slice(0, 200)}`)
  }
  if (!res.ok) {
    const err = json?.error?.message || text.slice(0, 300)
    throw new Error(`OpenRouter error ${res.status}: ${err}`)
  }
  return { json, body }
}

async function saveAuxFiles({
  options,
  prompt,
  basePath,
  output,
  usedReferenceImage,
}) {
  if (options.savePrompt) {
    await writeFile(`${basePath}.prompt.txt`, prompt, 'utf8')
  }
  if (!options.metadata) return
  const parsedOptions = { ...options }
  delete parsedOptions.apiKey
  const data = {
    mode: options.mode || null,
    model: options.model,
    inputPath: options.input ? path.resolve(options.input) : null,
    output,
    prompt,
    parsedOptions,
    usedReferenceImage,
  }
  await writeFile(`${basePath}.metadata.json`, JSON.stringify(data, null, 2), 'utf8')
}

async function runDryRun({
  options,
  prompt,
  payload,
  basePath,
  output,
  usedReferenceImage,
}) {
  console.log(
    JSON.stringify(
      {
        ok: true,
        dryRun: true,
        mode: options.mode || null,
        model: options.model,
        usedReferenceImage,
        output,
        prompt,
        payload,
      },
      null,
      2,
    ),
  )
  await saveAuxFiles({
    options,
    prompt,
    basePath,
    output,
    usedReferenceImage,
  })
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log(usage())
    process.exit(0)
  }

  const options = buildOptions(args)
  validateArgs(options)

  const prompt = buildPrompt(options)
  const outputDir = path.resolve(options.outputDir)
  const baseName = outputBaseName(options)
  const basePath = path.join(outputDir, baseName)
  const output = {
    png: options.png ? `${basePath}.png` : null,
    webp: options.webp ? `${basePath}.webp` : null,
  }
  const usedReferenceImage = shouldUseReferenceImage(options)
  const imageDataUrl = usedReferenceImage
    ? await buildPngDataUrl(path.resolve(options.input))
    : null

  await mkdir(outputDir, { recursive: true })

  if (options.dryRun) {
    const previewPayload = {
      model: options.model,
      messages: [{ role: 'user', content: imageDataUrl ? ['text', 'image_url'] : ['text'] }],
      modalities: ['image'],
    }
    await runDryRun({
      options,
      prompt,
      payload: previewPayload,
      basePath,
      output,
      usedReferenceImage,
    })
    return
  }

  const { json } = await callOpenRouter({
    apiKey: options.apiKey,
    model: options.model,
    prompt,
    imageDataUrl,
  })
  const message = json?.choices?.[0]?.message
  const dataUrl = firstImageDataUrl(message)
  if (!dataUrl) {
    throw new Error('No image in OpenRouter response. Try another model or prompt.')
  }

  const imageBase64 = base64FromDataUrl(dataUrl)
  if (!imageBase64) {
    throw new Error('Could not parse image data URL from OpenRouter response.')
  }

  // Keep PNG as the intermediate because downstream cleanup/trim/padding works on lossless alpha.
  const intermediatePngPath = output.png || `${basePath}.png`
  await writeFile(intermediatePngPath, Buffer.from(imageBase64, 'base64'))

  // For production game assets, export WebP from the final processed PNG for smaller files.
  if (output.webp) {
    await saveWebp(intermediatePngPath, output.webp, {
      quality: options.webpQuality,
      alphaQuality: options.webpAlphaQuality,
      effort: options.webpEffort,
    })
  }

  if (!output.png) {
    // User requested only WebP, so remove intermediate PNG.
    await unlink(intermediatePngPath)
  }

  await saveAuxFiles({
    options,
    prompt,
    basePath,
    output,
    usedReferenceImage,
  })

  console.log(
    JSON.stringify(
      {
        ok: true,
        provider: 'openrouter',
        mode: options.mode || null,
        model: options.model,
        input: options.input ? path.resolve(options.input) : null,
        output,
        usedReferenceImage,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  console.error('\n' + usage())
  process.exit(1)
})
