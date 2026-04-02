<script>
  import { onDestroy } from 'svelte'

  /** @type {{ onImageLoaded: (img: HTMLImageElement) => void }} */
  let { onImageLoaded } = $props()

  let dragOver = $state(false)
  let previewUrl = $state(null)
  let errorMessage = $state('')
  let fileInput = $state(null)

  onDestroy(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  })

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

  function loadFile(file) {
    errorMessage = ''
    if (!file || !file.type.startsWith('image/')) {
      errorMessage = 'Please select a valid image file (JPEG, PNG, GIF, WebP, etc.)'
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      errorMessage = 'File is too large. Please choose an image under 10 MB.'
      return
    }

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      previewUrl = url
      onImageLoaded(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      errorMessage = 'Could not load the selected image. Please try another file.'
    }
    img.src = url
  }

  function handleFileInput(e) {
    loadFile(e.target.files[0])
  }

  function handleDrop(e) {
    e.preventDefault()
    dragOver = false
    loadFile(e.dataTransfer.files[0])
  }

  function handleDragOver(e) {
    e.preventDefault()
    dragOver = true
  }

  function handleDragLeave() {
    dragOver = false
  }
</script>

<section aria-labelledby="upload-heading">
  <h2 id="upload-heading">Upload Image</h2>

  <!--
    The drop zone is a <label> wrapping the file input.
    Clicking anywhere in it opens the file picker natively — no JS needed,
    no role="button" hack, no document.getElementById.
  -->
  <label
    class="drop-zone"
    class:drag-over={dragOver}
    ondrop={handleDrop}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
  >
    {#if previewUrl}
      <img src={previewUrl} alt="Preview of uploaded file" class="preview" />
    {:else}
      <div class="placeholder" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M4 16l4-4 4 4 4-6 4 6" />
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
        <p>Drag &amp; drop an image here</p>
        <p class="hint">or click to browse</p>
      </div>
    {/if}

    <input
      bind:this={fileInput}
      type="file"
      accept="image/*"
      class="visually-hidden"
      onchange={handleFileInput}
      aria-describedby={errorMessage ? 'upload-error' : undefined}
    />
  </label>

  {#if errorMessage}
    <p id="upload-error" class="error" role="alert">{errorMessage}</p>
  {/if}

  <p class="privacy-note">
    Your image stays in your browser and is never uploaded anywhere.
  </p>
</section>

<style>
  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.75rem;
  }

  .drop-zone {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #9ca3af;
    border-radius: 8px;
    padding: 1.5rem;
    cursor: pointer;
    transition: border-color 0.15s, background-color 0.15s;
    min-height: 160px;
  }

  .drop-zone:hover,
  .drop-zone:focus-within {
    border-color: #2563eb;
    background-color: #eff6ff;
  }

  .drop-zone.drag-over {
    border-color: #2563eb;
    background-color: #eff6ff;
  }

  .placeholder {
    text-align: center;
    color: #6b7280;
  }

  .placeholder p {
    margin: 0.5rem 0 0;
    font-size: 0.95rem;
  }

  .placeholder .hint {
    font-size: 0.8rem;
    color: #9ca3af;
  }

  .preview {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
    display: block;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .error {
    color: #dc2626;
    font-size: 0.875rem;
    margin: 0.5rem 0 0;
  }

  .privacy-note {
    font-size: 0.8rem;
    color: #6b7280;
    margin: 0.75rem 0 0;
  }
</style>
