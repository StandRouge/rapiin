import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
export default function PdfPreview({ pdf, page, setPage }) {
  const ref = useRef(null)
  useEffect(() => {
    let task, dead = false
    ;(async () => {
      const p = await pdf.getPage(page)
      const vp = p.getViewport({ scale: 1.2 })
      const c = ref.current
      if (dead || !c) return
      c.width = vp.width; c.height = vp.height
      task = p.render({ canvasContext: c.getContext('2d'), viewport: vp })
      task.promise.catch(() => {})
    })()
    return () => { dead = true; task?.cancel() }
  }, [pdf, page])
  const nav = 'grid h-8 w-8 place-items-center rounded-full border border-line hover:bg-line/50 disabled:opacity-40'
  return (
    <figure className="m-0 min-w-0 overflow-hidden rounded-2xl border border-line bg-surface">
      <figcaption className="flex items-center justify-between gap-2 border-b border-line px-3 py-2 text-sm">
        <button className={nav} disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Halaman sebelumnya"><ChevronLeft size={16} /></button>
        <span>PDF · halaman {page} / {pdf.numPages}</span>
        <button className={nav} disabled={page >= pdf.numPages} onClick={() => setPage(page + 1)} aria-label="Halaman berikutnya"><ChevronRight size={16} /></button>
      </figcaption>
      <canvas ref={ref} className="block h-auto w-full" />
    </figure>
  )
}
