import { useState } from 'react'
import usePdfConverter from '../hooks/usePdfConverter'
import { parseRange } from '../lib/range'
import DropZone from '../components/DropZone'
import SettingsPanel from '../components/SettingsPanel'
import PdfPreview from '../components/PdfPreview'
import ResultPreview from '../components/ResultPreview'
import DownloadAll from '../components/DownloadAll'
import { alertCls } from '../ui'

export default function PdfToJpg() {
  const { file, pdf, results, busy, error, open, convert } = usePdfConverter()
  const [opts, setOpts] = useState({ dpi: 150, quality: 0.8 })
  const [range, setRange] = useState('')
  const [page, setPage] = useState(1)
  const base = file?.name.replace(/\.pdf$/i, '') ?? 'halaman'
  const onFile = (f) => { setPage(1); setRange(''); open(f) }
  const onConvert = () => {
    const pages = parseRange(range, pdf.numPages)
    if (pages.length) { setPage(pages[0]); convert(pages, opts) }
  }
  return (
    <div className="grid gap-4">
      {error && <p role="alert" className={alertCls}>{error}</p>}
      {!pdf ? (
        <DropZone accept="application/pdf" onFiles={([f]) => onFile(f)} title="Tarik file PDF ke sini" hint="atau klik untuk memilih. File tidak dikirim ke mana pun." />
      ) : (
        <>
          <div className="flex justify-between gap-3 text-sm text-mute">
            <span>{file.name}</span>
            <label className="cursor-pointer font-medium text-brand">Ganti file<input type="file" hidden accept="application/pdf" onChange={(e) => e.target.files[0] && onFile(e.target.files[0])} /></label>
          </div>
          <div className="grid items-start gap-4 lg:grid-cols-[300px_1fr]">
            <SettingsPanel {...{ opts, setOpts, range, setRange, onConvert, busy }} total={pdf.numPages} />
            <div className="grid gap-4 md:grid-cols-2">
              <PdfPreview pdf={pdf} page={page} setPage={setPage} />
              <ResultPreview result={results[page]} page={page} base={base} />
            </div>
          </div>
          <DownloadAll results={results} base={base} />
        </>
      )}
    </div>
  )
}
