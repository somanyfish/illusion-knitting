<script>
  import { onDestroy } from 'svelte'
  import { downloadPNG, downloadCSV } from '../export.js'

  /** @type {{ chart: string[][]|null, canvasRef: HTMLCanvasElement|null }} */
  let { chart = null, canvasRef = null } = $props()

  let pngStatus = $state('')
  let pngError = $state('')
  let csvStatus = $state('')
  let csvError = $state('')

  let pngStatusTimer = null
  let pngErrorTimer = null
  let csvStatusTimer = null
  let csvErrorTimer = null

  onDestroy(() => {
    clearTimeout(pngStatusTimer)
    clearTimeout(pngErrorTimer)
    clearTimeout(csvStatusTimer)
    clearTimeout(csvErrorTimer)
  })

  function handlePNG() {
    if (!canvasRef) return
    pngError = ''
    pngStatus = ''
    clearTimeout(pngErrorTimer)
    clearTimeout(pngStatusTimer)
    downloadPNG(
      canvasRef,
      'illusion-knitting-chart.png',
      (err) => {
        pngError = err
        pngErrorTimer = setTimeout(() => (pngError = ''), 5000)
      },
      () => {
        pngStatus = 'Chart downloaded as PNG.'
        pngStatusTimer = setTimeout(() => (pngStatus = ''), 3000)
      }
    )
  }

  function handleCSV() {
    if (!chart) return
    csvStatus = ''
    csvError = ''
    clearTimeout(csvStatusTimer)
    clearTimeout(csvErrorTimer)
    downloadCSV(
      chart,
      'illusion-knitting-chart.csv',
      (err) => {
        csvError = err
        csvErrorTimer = setTimeout(() => (csvError = ''), 5000)
      },
      () => {
        csvStatus = 'Chart downloaded as CSV.'
        csvStatusTimer = setTimeout(() => (csvStatus = ''), 3000)
      }
    )
  }
</script>

<section aria-labelledby="export-heading">
  <h2 id="export-heading">Download Chart</h2>

  <div class="button-row">
    <div class="btn-wrapper">
      <button
        type="button"
        class="btn"
        disabled={!canvasRef || !chart}
        onclick={handlePNG}
        aria-describedby="png-hint"
      >
        Download PNG
      </button>
      <span id="png-hint" class="hint">Visual chart image, ready to print</span>
      {#if pngError}
        <span class="error" role="alert" aria-live="polite">{pngError}</span>
      {:else if pngStatus}
        <span class="status" role="status" aria-live="polite">{pngStatus}</span>
      {/if}
    </div>

    <div class="btn-wrapper">
      <button
        type="button"
        class="btn"
        disabled={!chart}
        onclick={handleCSV}
        aria-describedby="csv-hint"
      >
        Download CSV
      </button>
      <span id="csv-hint" class="hint">
        Grid of LK/LP/DK/DP values for Google Sheets or Excel
      </span>
      {#if csvError}
        <span class="error" role="alert" aria-live="polite">{csvError}</span>
      {:else if csvStatus}
        <span class="status" role="status" aria-live="polite">{csvStatus}</span>
      {/if}
    </div>
  </div>
</section>

<style>
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.75rem;
  }

  .button-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .btn {
    padding: 0.5rem 1.25rem;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
  }

  .btn:hover:not(:disabled) {
    background: #1d4ed8;
  }

  .btn:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 3px;
  }

  .btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  .hint {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .status {
    font-size: 0.8rem;
    color: #059669;
    font-weight: 500;
  }

  .error {
    font-size: 0.8rem;
    color: #dc2626;
    font-weight: 500;
  }
</style>
