/**
 * Triggers a file download in the browser.
 * The anchor must be briefly appended to the document for Firefox compatibility.
 * The object URL is revoked after a short delay to avoid a race condition where
 * the browser hasn't started the download before the URL is invalidated.
 * @param {string} url - object URL or data URL
 * @param {string} filename
 */
function triggerDownload(url, filename) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

/**
 * Downloads the chart canvas as a PNG file.
 * @param {HTMLCanvasElement} canvas
 * @param {string} [filename]
 * @param {(error: string) => void} [onError]
 * @param {() => void} [onSuccess]
 */
export function downloadPNG(canvas, filename = 'illusion-knitting-chart.png', onError, onSuccess) {
  try {
    canvas.toBlob((blob) => {
      if (!blob) {
        onError?.('Could not generate PNG. The canvas may be empty.')
        return
      }
      const url = URL.createObjectURL(blob)
      triggerDownload(url, filename)
      onSuccess?.()
    }, 'image/png')
  } catch (err) {
    onError?.('Could not generate PNG: ' + err.message)
  }
}

/**
 * Downloads the chart as a CSV file.
 * Cells contain: LK, LP, DK, or DP
 *   L/D = light or dark ridge | K/P = knit or purl
 * Row 1 of the CSV = ridge 1 (cast-on edge, bottom of chart).
 * Uses \r\n line endings for Excel on Windows compatibility.
 * @param {string[][]} chart - chart[ridgeIndex][stitchIndex], ridge 0 = bottom
 * @param {string} [filename]
 * @param {(error: string) => void} [onError]
 * @param {() => void} [onSuccess]
 */
export function downloadCSV(chart, filename = 'illusion-knitting-chart.csv', onError, onSuccess) {
  try {
    const csv = chart.map((row) => row.join(',')).join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    triggerDownload(url, filename)
    onSuccess?.()
  } catch (err) {
    onError?.('Could not generate CSV: ' + err.message)
  }
}
