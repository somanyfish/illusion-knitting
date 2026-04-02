<script>
  /**
   * @type {{
   *   stitches: number,
   *   ridges: number,
   *   threshold: number,
   *   viewingDirection: 'below'|'side',
   *   aspectRatio: number|null,
   *   onStitchesChange: (v: number) => void,
   *   onRidgesChange: (v: number) => void,
   *   onThresholdChange: (v: number) => void,
   *   onViewingDirectionChange: (v: string) => void,
   * }}
   */
  let {
    stitches,
    ridges,
    threshold,
    viewingDirection,
    aspectRatio,
    onStitchesChange,
    onRidgesChange,
    onThresholdChange,
    onViewingDirectionChange,
  } = $props()

  let lockAspectRatio = $state(true)

  const MIN = 1
  const MAX = 500

  function clamp(val) {
    return Math.min(MAX, Math.max(MIN, val))
  }

  function handleStitchesInput(e) {
    const val = clamp(parseInt(e.target.value) || MIN)
    onStitchesChange(val)
    if (lockAspectRatio && aspectRatio) {
      onRidgesChange(clamp(Math.round(val / aspectRatio)))
    }
  }

  function handleRidgesInput(e) {
    const val = clamp(parseInt(e.target.value) || MIN)
    onRidgesChange(val)
    if (lockAspectRatio && aspectRatio) {
      onStitchesChange(clamp(Math.round(val * aspectRatio)))
    }
  }
</script>

<section aria-labelledby="config-heading">
  <h2 id="config-heading">Chart Settings</h2>

  <div class="fields">
    <div class="field-row">
      <div class="field">
        <label for="stitches-input">Stitches (width)</label>
        <input
          id="stitches-input"
          type="number"
          min="1"
          max="500"
          value={stitches}
          oninput={handleStitchesInput}
          aria-describedby="stitches-hint"
        />
        <span id="stitches-hint" class="hint">Number of columns in the chart</span>
      </div>

      <div class="lock-toggle">
        <button
          type="button"
          class="lock-btn"
          class:locked={lockAspectRatio}
          onclick={() => (lockAspectRatio = !lockAspectRatio)}
          aria-pressed={lockAspectRatio}
          aria-label={lockAspectRatio ? 'Aspect ratio locked — click to unlock' : 'Aspect ratio unlocked — click to lock'}
          title={lockAspectRatio ? 'Lock aspect ratio' : 'Unlock aspect ratio'}
        >
          {#if lockAspectRatio}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          {:else}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
          {/if}
        </button>
      </div>

      <div class="field">
        <label for="ridges-input">Ridges (height)</label>
        <input
          id="ridges-input"
          type="number"
          min="1"
          max="500"
          value={ridges}
          oninput={handleRidgesInput}
          aria-describedby="ridges-hint"
        />
        <span id="ridges-hint" class="hint">Number of rows in the chart</span>
      </div>
    </div>

    <div class="field">
      <label for="threshold-input">
        Threshold: <strong>{threshold}</strong>
      </label>
      <input
        id="threshold-input"
        type="range"
        min="0"
        max="255"
        value={threshold}
        oninput={(e) => onThresholdChange(parseInt(e.target.value))}
        aria-valuemin="0"
        aria-valuemax="255"
        aria-valuenow={threshold}
        aria-describedby="threshold-hint"
      />
      <span id="threshold-hint" class="hint">
        Pixels darker than this value become knit stitches (foreground).
        Lower = less of the image; higher = more.
      </span>
    </div>

    <fieldset>
      <legend>Viewing direction</legend>
      <div class="radio-group">
        <label class="radio-label">
          <input
            type="radio"
            name="viewing-direction"
            value="below"
            checked={viewingDirection === 'below'}
            onchange={() => onViewingDirectionChange('below')}
          />
          From below
          <span class="radio-hint">Tilt the finished piece away from you to see the image</span>
        </label>
        <label class="radio-label">
          <input
            type="radio"
            name="viewing-direction"
            value="side"
            checked={viewingDirection === 'side'}
            onchange={() => onViewingDirectionChange('side')}
          />
          From the side
          <span class="radio-hint">Tilt the finished piece to the side to see the image</span>
        </label>
      </div>
    </fieldset>
  </div>
</section>

<style>
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.75rem;
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .field-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input[type='number'] {
    padding: 0.4rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 0.95rem;
    width: 100%;
    box-sizing: border-box;
  }

  input[type='number']:focus {
    outline: 2px solid #2563eb;
    outline-offset: 1px;
    border-color: transparent;
  }

  input[type='range'] {
    width: 100%;
    cursor: pointer;
    accent-color: #2563eb;
  }

  input[type='range']:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .hint {
    font-size: 0.75rem;
    color: #6b7280;
    line-height: 1.4;
  }

  .lock-btn {
    background: none;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    padding: 0.4rem;
    cursor: pointer;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1.6rem;
  }

  .lock-btn:hover {
    border-color: #2563eb;
    color: #2563eb;
  }

  .lock-btn:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .lock-btn.locked {
    color: #2563eb;
    border-color: #2563eb;
    background: #eff6ff;
  }

  fieldset {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 0.75rem 1rem;
    margin: 0;
  }

  legend {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    padding: 0 0.25rem;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .radio-label {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    flex-wrap: wrap;
  }

  .radio-label input[type='radio'] {
    accent-color: #2563eb;
    flex-shrink: 0;
  }

  .radio-hint {
    font-size: 0.75rem;
    color: #6b7280;
    flex-basis: 100%;
    margin-left: 1.4rem;
  }
</style>
