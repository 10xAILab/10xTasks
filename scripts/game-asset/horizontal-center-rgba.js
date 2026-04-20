import sharp from 'sharp'

export function horizontalAlphaBounds(data, width, height, alphaThreshold) {
  let minX = width
  let maxX = -1
  for (let y = 0; y < height; y += 1) {
    const row = y * width * 4
    for (let x = 0; x < width; x += 1) {
      const a = data[row + x * 4 + 3]
      if (a > alphaThreshold) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
      }
    }
  }
  if (maxX < 0) return null
  return { minX, maxX }
}

export function horizontalCenterOffsetX(width, minX, maxX) {
  return Math.round(width / 2 - (minX + maxX) / 2)
}

export function shiftRgbaHorizontally(data, width, height, offsetX) {
  const out = Buffer.alloc(width * height * 4, 0)
  for (let y = 0; y < height; y += 1) {
    const row = y * width * 4
    for (let x = 0; x < width; x += 1) {
      const sx = x - offsetX
      if (sx < 0 || sx >= width) continue
      const si = row + sx * 4
      const di = row + x * 4
      out[di] = data[si]
      out[di + 1] = data[si + 1]
      out[di + 2] = data[si + 2]
      out[di + 3] = data[si + 3]
    }
  }
  return out
}

/**
 * Horizontally centers RGBA image buffer; same canvas size, transparent edges.
 * @returns {{ pngBuffer: Buffer, offsetX: number, bounds: { minX: number, maxX: number } | null }}
 */
export async function centerBufferHorizontallyAsPng(imageBuffer, alphaThreshold) {
  const { data, info } = await sharp(imageBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  if (info.channels !== 4) {
    throw new Error(`Expected 4 channels (RGBA), got ${info.channels}.`)
  }
  const { width, height } = info
  const bounds = horizontalAlphaBounds(data, width, height, alphaThreshold)
  if (!bounds) {
    return { pngBuffer: imageBuffer, offsetX: 0, bounds: null }
  }
  const offsetX = horizontalCenterOffsetX(width, bounds.minX, bounds.maxX)
  if (offsetX === 0) {
    return { pngBuffer: imageBuffer, offsetX: 0, bounds }
  }
  const shifted = shiftRgbaHorizontally(data, width, height, offsetX)
  const pngBuffer = await sharp(shifted, {
    raw: { width, height, channels: 4 },
  })
    .ensureAlpha()
    .png()
    .toBuffer()
  return { pngBuffer, offsetX, bounds }
}
