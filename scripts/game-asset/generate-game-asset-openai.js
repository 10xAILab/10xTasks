#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import OpenAI, { toFile } from 'openai'
import sharp from 'sharp'

// const DEFAULT_MODEL = 'dall-e-2'
const DEFAULT_MODEL = 'gpt-5'

function buildDefaultPrompt(variation) {
  return [
    'Create one variation of this image.',
    `Variation request: ${variation}`,
    'Infer and preserve the original visual style while introducing fresh details.',
    'Return exactly one image.',
  ].join(' ')
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
    '  node scripts/game-asset/generate-game-asset-openai.js \\',
    '    --input <image-path> \\',
    '    --output-dir <directory> \\',
    '    (--variation "<variation text>" | --prompt "<custom instruction>") \\',
    '    [--model <openai-model>] \\',
    '    [--api-key <api-key>]',
    '',
    'Environment:',
    '  OPENAI_API_KEY is used by default.',
  ].join('\n')
}

function validateArgs(args) {
  if (!args.input || typeof args.input !== 'string') {
    throw new Error('Missing required --input <image-path>')
  }
  if (!args['output-dir'] || typeof args['output-dir'] !== 'string') {
    throw new Error('Missing required --output-dir <directory>')
  }
  const hasPrompt = Boolean(args.prompt && typeof args.prompt === 'string')
  const hasVariation = Boolean(
    args.variation && typeof args.variation === 'string',
  )
  if (!hasPrompt && !hasVariation) {
    throw new Error('Provide either --variation "<text>" or --prompt "<text>"')
  }
}

function isPng(inputPath) {
  return path.extname(inputPath).toLowerCase() === '.png'
}

async function buildOpenAiImageFile(inputPath) {
  const inputBytes = await readFile(inputPath)
  if (isPng(inputPath)) {
    return toFile(inputBytes, path.basename(inputPath), { type: 'image/png' })
  }
  const pngBytes = await sharp(inputBytes).png().toBuffer()
  const fileName = `${path.parse(inputPath).name}.png`
  return toFile(pngBytes, fileName, { type: 'image/png' })
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log(usage())
    process.exit(0)
  }

  validateArgs(args)

  const apiKey = args['api-key'] || process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY (or --api-key)')
  }

  const model = args.model || DEFAULT_MODEL
  const prompt = args.prompt || buildDefaultPrompt(args.variation)
  const inputPath = path.resolve(args.input)
  const outputDir = path.resolve(args['output-dir'])

  await mkdir(outputDir, { recursive: true })

  const client = new OpenAI({ apiKey })
  const response = await client.images.edit({
    model,
    image: await buildOpenAiImageFile(inputPath),
    prompt,
    n: 1,
    size: '1024x1024',
  })

  const imageBase64 = response?.data?.[0]?.b64_json
  if (!imageBase64) {
    throw new Error('No image returned by OpenAI. Try a different model or prompt.')
  }

  const outputPath = path.join(outputDir, 'variation-1.png')
  await writeFile(outputPath, Buffer.from(imageBase64, 'base64'))

  console.log(
    JSON.stringify(
      {
        ok: true,
        provider: 'openai',
        model,
        input: inputPath,
        output: outputPath,
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
