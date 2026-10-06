import { PDFDocument, degrees } from 'pdf-lib'
import JSZip from 'jszip'
import FileTool from '../components/FileTool'
import { loadPdf, renderPageToJpg } from '../lib/pdf'
import { parseRange } from '../lib/range'

const PDF = 'application/pdf'
const buf = (f) => f.arrayBuffer()
const pdfOut = async (doc, name) => ({ blob: new Blob([await doc.save()], { type: PDF }), name })
const pick = async (src, idx) => { const d = await PDFDocument.create(); (await d.copyPages(src, idx.map((n) => n - 1))).forEach((p) => d.addPage(p)); return d }

export const Merge = () => (
  <FileTool accept={PDF} multiple label="Gabungkan PDF" hint="Pilih dua PDF atau lebih. Urutan bisa diubah dengan tombol panah."
    run={async (files) => {
      const out = await PDFDocument.create()
      for (const f of files) { const s = await PDFDocument.load(await buf(f)); (await out.copyPages(s, s.getPageIndices())).forEach((p) => out.addPage(p)) }
      return pdfOut(out, 'gabungan.pdf')
    }} />
)

export const Split = () => (
  <FileTool accept={PDF} label="Pisahkan PDF" hint="Pilih satu PDF."
    options={[
      { key: 'range', label: 'Halaman yang diambil', def: '', ph: 'Semua, atau contoh: 1-3,5' },
      { key: 'mode', label: 'Hasil', def: 'one', choices: [['one', 'Satu PDF berisi halaman terpilih'], ['zip', 'Tiap halaman jadi PDF sendiri (ZIP)']] },
    ]}
    run={async ([f], v) => {
      const src = await PDFDocument.load(await buf(f))
      const pages = parseRange(v.range, src.getPageCount())
      if (!pages.length) throw new Error('kosong')
      if (v.mode === 'zip') {
        const z = new JSZip()
        for (const n of pages) z.file(`halaman-${n}.pdf`, await (await pick(src, [n])).save())
        return { blob: await z.generateAsync({ type: 'blob' }), name: 'halaman.zip' }
      }
      return pdfOut(await pick(src, pages), 'potongan.pdf')
    }} />
)

export const Rotate = () => (
  <FileTool accept={PDF} label="Putar PDF" hint="Semua halaman akan diputar."
    options={[{ key: 'angle', label: 'Putar searah jarum jam', def: '90', choices: [['90', '90°'], ['180', '180°'], ['270', '270°']] }]}
    run={async ([f], v) => {
      const d = await PDFDocument.load(await buf(f))
      d.getPages().forEach((p) => p.setRotation(degrees((p.getRotation().angle + +v.angle) % 360)))
      return pdfOut(d, 'diputar.pdf')
    }} />
)

export const JpgToPdf = () => (
  <FileTool accept="image/jpeg,image/png" multiple label="Buat PDF" hint="Pilih gambar JPG atau PNG. Satu gambar menjadi satu halaman."
    run={async (files) => {
      const d = await PDFDocument.create()
      for (const f of files) {
        const b = await buf(f)
        const img = f.type === 'image/png' ? await d.embedPng(b) : await d.embedJpg(b)
        d.addPage([img.width, img.height]).drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      }
      return pdfOut(d, 'gambar.pdf')
    }} />
)

const LEVEL = { ringan: [150, 0.8], sedang: [110, 0.7], kuat: [80, 0.6] }
export const Compress = () => (
  <FileTool accept={PDF} label="Kompres PDF" hint="Halaman dirender ulang sebagai gambar JPG. Teks tidak lagi bisa dipilih atau dicari."
    options={[{ key: 'level', label: 'Tingkat kompresi', def: 'sedang', choices: [['ringan', 'Ringan (paling jernih)'], ['sedang', 'Sedang'], ['kuat', 'Kuat (paling kecil)']] }]}
    run={async ([f], v) => {
      const pdf = await loadPdf(f)
      const d = await PDFDocument.create()
      const [dpi, quality] = LEVEL[v.level]
      for (let i = 1; i <= pdf.numPages; i++) {
        const r = await renderPageToJpg(pdf, i, { dpi, quality })
        const img = await d.embedJpg(await r.blob.arrayBuffer())
        const w = (r.width * 72) / dpi, h = (r.height * 72) / dpi
        d.addPage([w, h]).drawImage(img, { x: 0, y: 0, width: w, height: h })
      }
      return pdfOut(d, 'terkompres.pdf')
    }} />
)
