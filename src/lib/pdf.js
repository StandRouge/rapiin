import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

const MAX_PIXELS = 16_000_000 // batas aman memori canvas

export async function loadPdf(file) {
  const data = new Uint8Array(await file.arrayBuffer())
  return pdfjs.getDocument({ data }).promise
}

/** Render satu halaman PDF ke Blob JPG. dpi: 72 = ukuran asli PDF. */
export async function renderPageToJpg(pdf, pageNumber, { dpi, quality }) {
  const page = await pdf.getPage(pageNumber)
  let scale = dpi / 72
  const base = page.getViewport({ scale: 1 })
  const px = base.width * base.height * scale * scale
  if (px > MAX_PIXELS) scale *= Math.sqrt(MAX_PIXELS / px)
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff' // JPG tidak mendukung transparansi
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  await page.render({ canvasContext: ctx, viewport }).promise
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality))
  const out = { blob, width: canvas.width, height: canvas.height }
  canvas.width = canvas.height = 0
  page.cleanup()
  return out
}
