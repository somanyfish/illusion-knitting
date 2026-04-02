# v2 Feature Ideas

This file tracks features and improvements being considered for future versions. None of these are commitments — they're a space to capture ideas worth revisiting.

## Pattern Generation

- [ ] 2×2 pixel mapping — map each input pixel to a 2×2 block of stitches so purl bumps are wide enough to reliably occlude the row behind them, producing a sharper illusion effect. Described in Zhu et al. (2024) "Computational Illusion Knitting," ACM Transactions on Graphics. Particularly beneficial for images with thin foreground features.
- [ ] Double-view illusions — embed two different images, each visible from opposite sides (left vs. right). Requires constraint relaxation; see Zhu et al. (2024) for the theoretical framework.
- [ ] Dithering options (e.g. Floyd-Steinberg) for better grayscale-to-binary conversion, especially for photographic images
- [ ] Multi-level threshold (3-color illusion knitting support: light, dark, and mixture areas)
- [ ] Edge detection preprocessing to sharpen silhouettes before thresholding
- [ ] Crop and rotate tools before generating the chart

## Chart Display

- [ ] Color picker — let users set their own light/dark yarn colors in the preview
- [ ] Highlight/zoom into a section of the chart
- [ ] Row-by-row reading mode (highlight current ridge as you knit)
- [ ] Stitch count labels on chart edges

## Export

- [ ] PDF export with instructions and chart combined
- [ ] Google Sheets-ready format with pre-applied conditional formatting (via Sheets API or a template)
- [ ] Export chart as SVG for scalable printing

## Sharing

- [ ] Generate a shareable URL that encodes the chart settings (no server needed — encode in URL hash)
- [ ] Embeddable chart widget for knitting blogs

## Accessibility & UX

- [ ] Dark mode
- [ ] Mobile-optimised layout for tablet use while knitting
- [ ] Keyboard navigation for all controls
- [ ] Screen reader announcements for chart preview updates

## Community

- [ ] Pattern gallery — let users submit their finished charts (would require a backend)
- [ ] Ravelry project link integration
