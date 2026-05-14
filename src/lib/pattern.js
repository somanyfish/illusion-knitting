/** Left margin reserved for ridge number labels, in pixels. */
export const MARGIN_LEFT = 36

/**
 * Computes the median luminance of an image's pixels.
 * Used to set a sensible default threshold that adapts to each image's
 * actual tonal range rather than assuming a fixed midpoint of 128.
 * @param {HTMLImageElement} img
 * @returns {number} median luminance 0–255, or 128 if the image is invalid
 */
export function computeMedianLuminance(img) {
  if (!img || img.naturalWidth === 0 || img.naturalHeight === 0) return 128
  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0)
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const luminances = []
  for (let i = 0; i < data.length; i += 4) {
    luminances.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
  }
  luminances.sort((a, b) => a - b)
  return Math.round(luminances[Math.floor(luminances.length / 2)])
}

/**
 * Generates an illusion knitting chart from an image.
 *
 * Chart is stored bottom-up: chart[0] = first ridge worked (cast-on edge).
 * Each cell value is one of: 'LK' | 'LP' | 'DK' | 'DP'
 *   L/D = light or dark ridge (alternating, L = ridge 0)
 *   K/P = knit or purl on the wrong-side row
 *
 * In illusion knitting:
 *   - Every right-side row is always plain knit (not represented in chart)
 *   - Wrong-side row: K = stitch stands forward (visible at an angle), P = stitch recedes (hidden)
 *   - Foreground pixels (darker than threshold) → K (visible)
 *   - Background pixels (lighter than threshold) → P (hidden)
 *
 * @param {HTMLImageElement} img
 * @param {number} stitches - chart width
 * @param {number} ridges   - chart height
 * @param {number} threshold - luminance 0–255; pixels below this become knit (foreground)
 * @param {'below'|'side'} viewingDirection
 * @returns {string[][]} chart[ridgeIndex][stitchIndex]
 */
export function generatePattern(img, stitches, ridges, threshold, viewingDirection) {
  if (!img || img.naturalWidth === 0 || img.naturalHeight === 0) return []
  if (!Number.isFinite(stitches) || stitches < 1) return []
  if (!Number.isFinite(ridges) || ridges < 1) return []

  const canvas = document.createElement('canvas')
  canvas.width = stitches
  canvas.height = ridges
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, stitches, ridges)

  if (viewingDirection === 'side') {
    // Rotate image 90° clockwise so it appears when fabric is tilted to the side
    const scale = Math.min(stitches / img.naturalHeight, ridges / img.naturalWidth)
    const drawW = img.naturalHeight * scale
    const drawH = img.naturalWidth * scale
    ctx.save()
    ctx.translate(stitches / 2, ridges / 2)
    ctx.rotate(Math.PI / 2)
    ctx.drawImage(img, -drawH / 2, -drawW / 2, drawH, drawW)
    ctx.restore()
  } else {
    const scale = Math.min(stitches / img.naturalWidth, ridges / img.naturalHeight)
    const drawW = img.naturalWidth * scale
    const drawH = img.naturalHeight * scale
    ctx.drawImage(img, (stitches - drawW) / 2, (ridges - drawH) / 2, drawW, drawH)
  }

  const { data } = ctx.getImageData(0, 0, stitches, ridges)
  const chart = []

  for (let r = 0; r < ridges; r++) {
    const ridgeColor = r % 2 === 0 ? 'L' : 'D'
    const row = []
    // r=0 → bottom of chart → bottom of image (last pixel row)
    const pixelRow = ridges - 1 - r

    for (let s = 0; s < stitches; s++) {
      const i = (pixelRow * stitches + s) * 4
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      const isForeground = luminance < threshold
      // On dark ridges: foreground = K (stands forward/visible), background = P (recedes)
      // On light ridges: foreground = P (recedes, letting dark K show), background = K (stands forward)
      const isLight = ridgeColor === 'L'
      const stitchType = isLight ? (isForeground ? 'P' : 'K') : (isForeground ? 'K' : 'P')
      row.push(ridgeColor + stitchType)
    }

    chart.push(row)
  }

  return chart
}

/**
 * Returns the cell color for rendering the chart preview.
 * @param {'LK'|'LP'|'DK'|'DP'} cell
 * @param {string} lightColor - hex color for light ridge knit cells
 * @param {string} darkColor  - hex color for dark ridge knit cells
 * @returns {string} hex color
 */
export function cellColor(cell, lightColor = '#c8c8c8', darkColor = '#3a3a3a') {
  if (cell === 'LP' || cell === 'DP') return '#ffffff'
  return cell === 'LK' ? lightColor : darkColor
}
