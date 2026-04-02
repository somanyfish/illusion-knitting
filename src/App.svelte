<script>
  import { generatePattern, MARGIN_LEFT } from './lib/pattern.js'
  import ImageUpload from './lib/components/ImageUpload.svelte'
  import PatternConfig from './lib/components/PatternConfig.svelte'
  import ChartPreview from './lib/components/ChartPreview.svelte'
  import ExportButtons from './lib/components/ExportButtons.svelte'

  const MIN_CELL = 1
  const MAX_CELL = 16

  let sidebarOpen = $state(true)
  let img = $state(null)
  let stitches = $state(60)
  let ridges = $state(60)
  let threshold = $state(128)
  let viewingDirection = $state('below')
  let canvasRef = $state(null)
  let cellSize = $state(12)
  let scrollContainerRef = $state(null)

  let aspectRatio = $derived(img ? img.naturalWidth / img.naturalHeight : null)

  let chart = $state(null)
  let debounceTimer = null

  $effect(() => {
    // Read all reactive dependencies so Svelte tracks them
    const currentImg = img
    const currentStitches = stitches
    const currentRidges = ridges
    const currentThreshold = threshold
    const currentDirection = viewingDirection

    clearTimeout(debounceTimer)
    if (!currentImg || currentImg.naturalWidth === 0 || currentImg.naturalHeight === 0) {
      chart = null
      return
    }
    debounceTimer = setTimeout(() => {
      chart = generatePattern(currentImg, currentStitches, currentRidges, currentThreshold, currentDirection)
    }, 150)
    return () => clearTimeout(debounceTimer)
  })

  function handleImageLoaded(loadedImg) {
    img = loadedImg
    if (loadedImg.naturalWidth && loadedImg.naturalHeight) {
      ridges = Math.max(1, Math.round(stitches / (loadedImg.naturalWidth / loadedImg.naturalHeight)))
    }
  }

  function fitToView() {
    if (!chart || !scrollContainerRef) return
    const availW = scrollContainerRef.clientWidth - MARGIN_LEFT - 2
    const byWidth = Math.floor(availW / chart[0].length) - 1
    cellSize = Math.min(MAX_CELL, Math.max(MIN_CELL, byWidth))
  }
</script>

<a href="#main-content" class="skip-link">Skip to main content</a>

<header>
  <h1>Illusion Knitting Pattern Generator</h1>
  <p class="tagline">Upload an image to create a shadow knitting chart. Everything runs in your browser — your image is never uploaded anywhere.</p>
</header>

<main id="main-content">
  <div class="layout" class:sidebar-collapsed={!sidebarOpen}>
    <aside id="sidebar-content" class="sidebar" aria-label="Controls">
      <button
        type="button"
        class="sidebar-toggle collapse"
        onclick={() => (sidebarOpen = false)}
        aria-label="Collapse sidebar"
        aria-expanded={sidebarOpen}
        aria-controls="sidebar-content"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <div class="panel">
        <ImageUpload onImageLoaded={handleImageLoaded} />
      </div>

      {#if img}
        <div class="panel">
          <section aria-labelledby="chart-controls-heading">
            <h2 id="chart-controls-heading">Chart Display</h2>

            <ul class="legend">
              <li><span class="swatch light-knit" aria-hidden="true"></span> LK — light ridge, knit (background)</li>
              <li><span class="swatch dark-knit" aria-hidden="true"></span> DK — dark ridge, knit (foreground)</li>
              <li><span class="swatch purl" aria-hidden="true"></span> LP / DP — purl (recedes)</li>
            </ul>

            <div class="zoom-controls">
              <label for="zoom-slider" class="zoom-label">Zoom</label>
              <button
                type="button"
                class="zoom-btn"
                aria-label="Zoom out"
                onclick={() => (cellSize = Math.max(MIN_CELL, cellSize - 1))}
                disabled={cellSize <= MIN_CELL}
              >−</button>
              <input
                id="zoom-slider"
                type="range"
                min={MIN_CELL}
                max={MAX_CELL}
                bind:value={cellSize}
                aria-valuemin={MIN_CELL}
                aria-valuemax={MAX_CELL}
                aria-valuenow={cellSize}
                aria-label="Zoom level"
              />
              <button
                type="button"
                class="zoom-btn"
                aria-label="Zoom in"
                onclick={() => (cellSize = Math.min(MAX_CELL, cellSize + 1))}
                disabled={cellSize >= MAX_CELL}
              >+</button>
            </div>
            <button
              type="button"
              class="fit-btn"
              onclick={fitToView}
            >Fit to view</button>
          </section>
        </div>

        <div class="panel">
          <PatternConfig
            {stitches}
            {ridges}
            {threshold}
            {viewingDirection}
            {aspectRatio}
            onStitchesChange={(v) => (stitches = v)}
            onRidgesChange={(v) => (ridges = v)}
            onThresholdChange={(v) => (threshold = v)}
            onViewingDirectionChange={(v) => (viewingDirection = v)}
          />
        </div>

        <div class="panel">
          <ExportButtons {chart} {canvasRef} />
        </div>
      {/if}
    </aside>

    <div class="preview-area">
      {#if !sidebarOpen}
        <button
          type="button"
          class="sidebar-toggle expand"
          onclick={() => (sidebarOpen = true)}
          aria-label="Expand sidebar"
          aria-expanded={sidebarOpen}
          aria-controls="sidebar-content"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      {/if}
      <ChartPreview {chart} {cellSize} bind:canvasRef bind:scrollContainerRef />
    </div>
  </div>
</main>

<footer>
  <p>
    Open source &mdash;
    <a href="https://github.com/somanyfish/illusion-knitting" rel="noopener noreferrer">
      contribute on GitHub
    </a>
  </p>
</footer>

<style>
  :global(*, *::before, *::after) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background: #f9fafb;
    color: #1a1a1a;
    line-height: 1.5;
  }

  .skip-link {
    position: absolute;
    left: -9999px;
    top: 0;
    background: #2563eb;
    color: #fff;
    padding: 0.5rem 1rem;
    text-decoration: none;
    border-radius: 0 0 4px 4px;
    font-weight: 600;
    z-index: 100;
  }

  .skip-link:focus {
    left: 0;
  }

  header {
    background: #1e3a5f;
    color: #fff;
    padding: 1.25rem 1.5rem;
  }

  header h1 {
    margin: 0 0 0.25rem;
    font-size: 1.4rem;
    font-weight: 700;
  }

  .tagline {
    margin: 0;
    font-size: 0.875rem;
    color: #bfdbfe;
  }

  main {
    padding: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .layout.sidebar-collapsed {
    grid-template-columns: 1fr;
  }

  .layout.sidebar-collapsed .sidebar {
    display: none;
  }

  @media (max-width: 720px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .sidebar-toggle {
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    width: 28px;
    height: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    flex-shrink: 0;
  }

  .sidebar-toggle:hover {
    border-color: #2563eb;
    color: #2563eb;
  }

  .sidebar-toggle:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .sidebar-toggle.collapse {
    align-self: flex-end;
    margin-bottom: -0.25rem;
  }

  .sidebar-toggle.expand {
    margin-bottom: 0.75rem;
  }

  .panel {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.25rem;
  }

  .preview-area {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.25rem;
    min-height: 300px;
    min-width: 0; /* prevent grid column from expanding beyond its allocated width */
  }

  footer {
    text-align: center;
    padding: 1.5rem;
    font-size: 0.85rem;
    color: #6b7280;
    border-top: 1px solid #e5e7eb;
    margin-top: 2rem;
  }

  footer a {
    color: #2563eb;
  }

  footer a:hover {
    text-decoration: none;
  }

  /* Chart display panel */
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.75rem;
  }

  .legend {
    list-style: none;
    padding: 0;
    margin: 0 0 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.8rem;
    color: #4b5563;
  }

  .legend li {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .swatch {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 1px solid #d1d5db;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .light-knit { background: #c8c8c8; }
  .dark-knit  { background: #3a3a3a; }
  .purl       { background: #ffffff; }

  .zoom-controls {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .zoom-label {
    font-size: 0.8rem;
    color: #4b5563;
    font-weight: 500;
  }

  .zoom-btn {
    width: 28px;
    height: 28px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: #fff;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .zoom-btn:hover:not(:disabled) { border-color: #2563eb; color: #2563eb; }
  .zoom-btn:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
  .zoom-btn:disabled { color: #d1d5db; cursor: not-allowed; }

  input[type='range'] {
    flex: 1;
    accent-color: #2563eb;
    cursor: pointer;
  }

  input[type='range']:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }

  .fit-btn {
    margin-top: 0.5rem;
    padding: 0.25rem 0.6rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: #fff;
    font-size: 0.8rem;
    cursor: pointer;
    white-space: nowrap;
  }

  .fit-btn:hover {
    border-color: #2563eb;
    color: #2563eb;
  }

  .fit-btn:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }
</style>
