#!/usr/bin/env node
import { GoogleGenAI } from '@google/genai'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_MODEL = 'gemini-2.5-flash-image'

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

function getMimeType(inputPath) {
  const ext = path.extname(inputPath).toLowerCase()
  if (ext === '.png') return 'image/png'
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  throw new Error(`Unsupported image extension: ${ext || '(none)'}`)
}

function usage() {
  return [
    'Usage:',
    '  node scripts/game-asset/generate-game-asset-gemini.js \\',
    '    --input <image-path> \\',
    '    --output-dir <directory> \\',
    '    (--variation "<variation text>" | --prompt "<custom instruction>") \\',
    '    [--model <gemini-model>] \\',
    '    [--api-key <api-key>]',
    '',
    'Environment:',
    '  GEMINI_API_KEY_CHICO is used by default.',
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

async function buildRequestParts(inputPath, prompt) {
  const bytes = await readFile(inputPath)
  const mimeType = getMimeType(inputPath)
  return [
    { text: prompt },
    {
      inlineData: {
        mimeType,
        data: bytes.toString('base64'),
      },
    },
  ]
}

function extractImageBase64(response) {
  const candidates = response?.candidates || []
  for (const candidate of candidates) {
    const parts = candidate?.content?.parts || []
    for (const part of parts) {
      if (part?.inlineData?.data) return part.inlineData.data
    }
  }
  return null
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    console.log(usage())
    process.exit(0)
  }

  validateArgs(args)

  const apiKey = args['api-key'] || process.env.GEMINI_API_KEY_CHICO
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY_CHICO (or --api-key)')
  }

  const model = args.model || DEFAULT_MODEL
  const prompt = args.prompt || buildDefaultPrompt(args.variation)
  const inputPath = path.resolve(args.input)
  const outputDir = path.resolve(args['output-dir'])

  await mkdir(outputDir, { recursive: true })

  const ai = new GoogleGenAI({ apiKey })
  const response = await ai.models.generateContent({
    model,
    contents: await buildRequestParts(inputPath, prompt),
  })

  const imageBase64 = extractImageBase64(response)
  if (!imageBase64) {
    throw new Error('No image returned by Gemini. Try a different model or prompt.')
  }

  const outputPath = path.join(outputDir, 'variation-1.png')
  await writeFile(outputPath, Buffer.from(imageBase64, 'base64'))

  console.log(
    JSON.stringify(
      {
        ok: true,
        provider: 'gemini',
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
