<script>
  import { cellColor, MARGIN_LEFT } from '../pattern.js'

  /** @type {{ chart: string[][]|null, canvasRef: HTMLCanvasElement|null, cellSize: number, scrollContainerRef: HTMLElement|null }} */
  let { chart = null, canvasRef = $bindable(null), cellSize = 12, scrollContainerRef = $bindable(null) } = $props()

  const GAP = 1
  const MARGIN_BOTTOM = 24

  let rafId = 0

  $effect(() => {
    if (!canvasRef || !chart || chart.length === 0) return
    const currentCanvas = canvasRef
    const currentChart = chart
    const currentCellSize = cellSize
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      renderChart(currentCanvas, currentChart, currentCellSize)
    })
    return () => cancelAnimationFrame(rafId)
  })

  function renderChart(canvas, chart, cell) {
    const stride = cell + GAP
    const ridges = chart.length
    const stitches = chart[0].length

    const width = MARGIN_LEFT + stitches * stride + GAP
    const height = ridges * stride + GAP + MARGIN_BOTTOM

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, width, height)

    for (let r = 0; r < ridges; r++) {
      const y = (ridges - 1 - r) * stride + GAP

      for (let s = 0; s < stitches; s++) {
        const x = MARGIN_LEFT + s * stride + GAP
        ctx.fillStyle = cellColor(chart[r][s])
        ctx.fillRect(x, y, cell, cell)
      }

      const ridgeNum = r + 1
      const fontSize = Math.min(10, cell)
      const labelEvery = fontSize < 5 ? 50 : fontSize < 8 ? 10 : 5
      if (ridgeNum === 1 || ridgeNum === ridges || ridgeNum % labelEvery === 0) {
        ctx.fillStyle = '#374151'
        ctx.font = `${fontSize}px sans-serif`
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(ridgeNum), MARGIN_LEFT - 4, y + cell / 2)
      }
    }

    ctx.fillStyle = '#374151'
    ctx.font = '9px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    for (let s = 0; s < stitches; s++) {
      const stitchNum = s + 1
      if (stitchNum === 1 || stitchNum === stitches || stitchNum % 10 === 0) {
        ctx.fillText(String(stitchNum), MARGIN_LEFT + s * stride + GAP + cell / 2, ridges * stride + GAP + 3)
      }
    }

    ctx.strokeStyle = '#6b7280'
    ctx.lineWidth = 1 / dpr
    for (let s = 10; s < stitches; s += 10) {
      const x = MARGIN_LEFT + s * stride + GAP - 1
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, ridges * stride + GAP)
      ctx.stroke()
    }
    for (let r = 10; r < ridges; r += 10) {
      const y = (ridges - r) * stride + GAP - 1
      ctx.beginPath()
      ctx.moveTo(MARGIN_LEFT, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }
</script>

<section aria-labelledby="preview-heading">
  <h2 id="preview-heading">Chart Preview</h2>

  {#if chart}
    <div
      class="canvas-scroll"
      bind:this={scrollContainerRef}
      tabindex="0"
      aria-labelledby="preview-heading"
    >
      <canvas
        bind:this={canvasRef}
        aria-label="Illusion knitting chart: {chart[0]?.length} stitches wide, {chart.length} ridges tall. Use the Download CSV button to access the full chart data as LK, LP, DK, or DP values."
      ></canvas>
    </div>
  {:else}
    <div class="empty-state" aria-live="polite">
      <p>Upload an image to see the chart preview.</p>
    </div>
  {/if}
</section>

<style>
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.75rem;
  }

  .canvas-scroll {
    overflow: auto;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    width: 100%;
    box-sizing: border-box;
  }

  .canvas-scroll:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  canvas {
    display: block;
  }

  .empty-state {
    border: 1px dashed #d1d5db;
    border-radius: 6px;
    padding: 3rem 1rem;
    text-align: center;
    color: #9ca3af;
  }
</style>
