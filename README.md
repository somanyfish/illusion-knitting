# Illusion Knitting Pattern Generator

A free, open-source web tool that converts any image into an illusion knitting chart (also known as shadow knitting). Everything runs entirely in your browser — your image is never uploaded to a server.

## What is Illusion Knitting?

Illusion knitting produces fabric that looks like plain color stripes when viewed straight-on, but reveals a hidden image when viewed from an angle. It uses two contrasting yarn colors, alternating ridge by ridge, with knit and purl stitches on the wrong-side rows to create the hidden image.

## Features

- Upload any image and generate a chart instantly
- Configure stitch width, ridge height, and contrast threshold
- Choose viewing direction: from the side or from below
- Download the chart as a **PNG** (ready to print) or **CSV** (for Google Sheets)
- CSV cells use `LK` / `LP` / `DK` / `DP` notation (light/dark × knit/purl) for easy conditional formatting
- Fully accessible — WCAG 2.0 Level AA compliant

## Getting Started (for contributors)

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Setup

```bash
git clone https://github.com/somanyfish/illusion-knitting.git
cd illusion-knitting
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. The contents of `dist/` can be deployed to any static host (GitHub Pages, Netlify, etc.).

## Project Structure

```
src/
  App.svelte          # Root component
  lib/
    components/       # UI components
    pattern.js        # Core image-to-chart algorithm
    export.js         # PNG and CSV export logic
```

## How the Chart Algorithm Works

1. The uploaded image is drawn onto an off-screen `<canvas>`
2. Pixel data is read and resized to the target grid (W stitches × H ridges)
3. Each pixel is thresholded to foreground (knit) or background (purl)
4. Ridges alternate light/dark top to bottom
5. Each cell is assigned one of: `LK`, `LP`, `DK`, `DP`
6. The chart is rendered to a visible canvas and optionally exported

## Contributing

Contributions are welcome! A few guidelines:

- All UI changes must maintain **WCAG 2.0 Level AA** accessibility compliance
- Keep the core pattern algorithm in `src/lib/pattern.js` — separate from UI concerns
- Test with a variety of image types (high contrast, photos, logos)
- Open an issue before starting large changes so we can discuss approach

## v2 Ideas

See [v2-features.md](v2-features.md) for the list of features being considered for future versions.

## License

MIT
