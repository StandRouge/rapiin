import { useState, useRef, useEffect } from 'react'
import { PDFDocument } from 'pdf-lib'
import { ArrowLeft, ArrowRight, Trash2, RotateCcw, ArrowUpDown, Download } from 'lucide-react'
import DropZone from './DropZone'
import { loadPdf } from '../lib/pdf'
import { parseRange } from '../lib/range'
import { formatSize, download } from '../lib/format'
import { card, field, btn, btnPrimary, alertCls } from '../ui'

function Thumb({ pdf, n }) {
  const ref = useRef(null)
  useEffect(() => {
    let task, dead = false
    ;(async () => {
      const p = await pdf.getPage(n)
      const base = p.getViewport({ scale: 1 })
      const vp = p.getViewport({ scale: 240 / base.width })
      const c = ref.current
      if (dead || !c) return
      c.width = vp.width; c.height = vp.height
      task = p.render({ canvasContext: c.getContext('2d'), viewport: vp })
      task.promise.catch(() => {})
    })()
    return () => { dead = true; task?.cancel() }
  }, [pdf, n])
  return <canvas ref={ref} className="block h-auto w-full rounded-lg bg-white" />
}

/** mode: 'reorder' (seret untuk menyusun ulang) atau 'remove' (klik untuk menandai halaman yang dihapus) */
export default function PageTool({ mode }) {
  const isOrder = mode === 'reorder'
  const [file, setFile] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [order, setOrder] = useState([])
  const [removed, setRemoved] = useState(new Set())
  const [quick, setQuick] = useState('')
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const drag = useRef(null)

  const seq = (n) => Array.from({ length: n }, (_, i) => i + 1)
  const open = async ([f]) => {
    setErr(''); setOut(null); setRemoved(new Set()); setQuick('')
    try { const d = await loadPdf(f); setPdf(d); setFile(f); setOrder(seq(d.numPages)) }
    catch { setErr('PDF tidak bisa dibuka. File mungkin rusak atau diproteksi password.') }
  }
  const move = (from, to) => {
    if (to < 0 || to >= order.length || from === to) return
    const a = [...order]; a.splice(to, 0, a.splice(from, 1)[0]); setOrder(a); setOut(null)
  }
  const toggle = (n) => { const s = new Set(removed); s.has(n) ? s.delete(n) : s.add(n); setRemoved(s); setOut(null) }
  const pickQuick = () => { setRemoved(quick.trim() ? new Set(parseRange(quick, order.length)) : new Set()); setOut(null) }

  const keep = order.filter((n) => !removed.has(n))
  const changed = isOrder ? order.some((n, i) => n !== i + 1) : removed.size > 0
  const save = async () => {
    setBusy(true); setErr('')
    try {
      const src = await PDFDocument.load(await file.arrayBuffer())
      const d = await PDFDocument.create()
      ;(await d.copyPages(src, keep.map((n) => n - 1))).forEach((p) => d.addPage(p))
      const blob = new Blob([await d.save()], { type: 'application/pdf' })
      if (out) URL.revokeObjectURL(out.url)
      setOut({ blob, url: URL.createObjectURL(blob), name: `${file.name.replace(/\.pdf$/i, '')}-${isOrder ? 'disusun' : 'dipangkas'}.pdf` })
    } catch { setErr('Gagal menyimpan PDF. Pastikan file tidak diproteksi password.') }
    setBusy(false)
  }

  const mini = 'grid h-8 w-8 place-items-center rounded-full border border-line hover:bg-line/50 disabled:opacity-30'
  return (
    <div className="grid gap-4">
      {err && <p role="alert" className={alertCls}>{err}</p>}
      {!pdf ? (
        <DropZone accept="application/pdf" onFiles={open} title="Pilih PDF atau tarik ke sini" hint="Halaman akan tampil sebagai thumbnail. File tidak dikirim ke mana pun." />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-mute">
            <span>{file.name} · {pdf.numPages} halaman</span>
            <label className="cursor-pointer font-medium text-brand">Ganti file<input type="file" hidden accept="application/pdf" onChange={(e) => e.target.files[0] && open([e.target.files[0]])} /></label>
          </div>

          <section className={`${card} flex flex-wrap items-center gap-3`}>
            {isOrder ? (
              <>
                <p className="mr-auto text-sm text-mute">Seret halaman, atau pakai tombol panah, untuk mengubah urutan.</p>
                <button className={btn} onClick={() => { setOrder([...order].reverse()); setOut(null) }}><ArrowUpDown size={16} />Balik urutan</button>
                <button className={btn} onClick={() => { setOrder(seq(pdf.numPages)); setOut(null) }}><RotateCcw size={16} />Reset</button>
              </>
            ) : (
              <>
                <p className="mr-auto text-sm text-mute">Klik halaman untuk menandainya, atau ketik nomornya.</p>
                <input className={`${field} max-w-48`} value={quick} placeholder="Contoh: 2,4-6" onChange={(e) => setQuick(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && pickQuick()} aria-label="Nomor halaman yang dihapus" />
                <button className={btn} onClick={pickQuick}>Tandai</button>
                <button className={btn} onClick={() => { setRemoved(new Set()); setQuick(''); setOut(null) }}><RotateCcw size={16} />Batal semua</button>
              </>
            )}
          </section>

          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {order.map((n, i) => {
              const gone = removed.has(n)
              return (
                <li key={n} draggable={isOrder}
                  onDragStart={() => { drag.current = i }}
                  onDragOver={(e) => isOrder && e.preventDefault()}
                  onDrop={() => { if (isOrder && drag.current !== null) { move(drag.current, i); drag.current = null } }}
                  className={`relative grid gap-2 rounded-2xl border bg-surface p-2 transition ${gone ? 'border-red-400/60' : 'border-line'} ${isOrder ? 'cursor-grab active:cursor-grabbing' : ''}`}>
                  {isOrder ? <Thumb pdf={pdf} n={n} /> : (
                    <button className="relative block w-full" onClick={() => toggle(n)} aria-pressed={gone} aria-label={`${gone ? 'Batal hapus' : 'Hapus'} halaman ${n}`}>
                      <span className={gone ? 'opacity-30' : ''}><Thumb pdf={pdf} n={n} /></span>
                      {gone && <span className="absolute inset-0 grid place-items-center text-red-300"><Trash2 size={32} /></span>}
                    </button>
                  )}
                  {isOrder ? (
                    <div className="flex items-center justify-between text-xs">
                      <button className={mini} disabled={i === 0} onClick={() => move(i, i - 1)} aria-label="Geser ke kiri"><ArrowLeft size={14} /></button>
                      <span className="text-center"><b className="text-sm">{i + 1}</b>{n !== i + 1 && <span className="block text-mute">asli {n}</span>}</span>
                      <button className={mini} disabled={i === order.length - 1} onClick={() => move(i, i + 1)} aria-label="Geser ke kanan"><ArrowRight size={14} /></button>
                    </div>
                  ) : <p className={`text-center text-sm ${gone ? 'text-red-300' : 'text-mute'}`}>Halaman {n}</p>}
                </li>
              )
            })}
          </ol>

          <section className={`${card} flex flex-wrap items-center gap-3`}>
            <p className="mr-auto text-sm text-mute">
              {isOrder ? `${keep.length} halaman akan disimpan dengan urutan baru.` : keep.length ? `${removed.size} halaman dihapus, ${keep.length} halaman tersisa.` : 'Semua halaman ditandai. Sisakan minimal satu halaman.'}
            </p>
            <button className={btnPrimary} disabled={busy || !keep.length || !changed} onClick={save}>{busy ? 'Menyimpan…' : 'Simpan PDF'}</button>
          </section>

          {out && (
            <section className={`${card} grid gap-3`}>
              <h2 className="font-serif text-xl">Selesai · {formatSize(out.blob.size)} · {keep.length} halaman</h2>
              <iframe className="h-96 w-full rounded-xl border border-line bg-white" src={out.url} title="Pratinjau hasil" />
              <button className={`${btnPrimary} justify-self-start`} onClick={() => download(out.blob, out.name)}><Download size={16} />Unduh {out.name}</button>
            </section>
          )}
        </>
      )}
    </div>
  )
}
