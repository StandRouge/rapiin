import { ArrowUp, ArrowDown, X, Download } from 'lucide-react'
import { useState } from 'react'
import DropZone from './DropZone'
import { formatSize, download } from '../lib/format'
import { card, field, btn, btnPrimary, alertCls } from '../ui'

export default function FileTool({ accept, multiple, hint, options = [], run, label }) {
  const [files, setFiles] = useState([])
  const [vals, setVals] = useState(Object.fromEntries(options.map((o) => [o.key, o.def])))
  const [busy, setBusy] = useState(false)
  const [out, setOut] = useState(null)
  const [err, setErr] = useState('')

  const add = (list) => { setOut(null); setErr(''); setFiles(multiple ? [...files, ...list] : list.slice(0, 1)) }
  const move = (i, d) => { const a = [...files]; if (!a[i + d]) return; [a[i], a[i + d]] = [a[i + d], a[i]]; setFiles(a) }
  const go = async () => {
    setBusy(true); setErr('')
    try { const r = await run(files, vals); setOut({ ...r, url: URL.createObjectURL(r.blob) }) }
    catch { setErr('Gagal memproses. Pastikan file valid, halaman yang dipilih ada, dan PDF tidak diproteksi password.') }
    setBusy(false)
  }
  const inSize = files.reduce((s, f) => s + f.size, 0)
  const diff = out && inSize ? Math.round((1 - out.blob.size / inSize) * 100) : 0
  const mini = 'grid h-7 w-7 place-items-center rounded-full border border-line hover:bg-line/50'

  return (
    <div className="grid gap-4">
      {err && <p role="alert" className={alertCls}>{err}</p>}
      <DropZone accept={accept} multiple={multiple} onFiles={add} title={files.length && !multiple ? 'Ganti file' : 'Pilih file atau tarik ke sini'} hint={hint} />
      {files.length > 0 && (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <section className={`${card} grid gap-4`}>
            <h2 className="font-serif text-xl">{files.length} file · {formatSize(inSize)}</h2>
            <ol className="grid gap-2 text-sm">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between gap-2 rounded-xl bg-paper px-3 py-2">
                  <span className="break-all">{f.name}</span>
                  {multiple && <span className="flex shrink-0 gap-1">
                    <button className={mini} onClick={() => move(i, -1)} aria-label="Naik"><ArrowUp size={14} /></button>
                    <button className={mini} onClick={() => move(i, 1)} aria-label="Turun"><ArrowDown size={14} /></button>
                    <button className={mini} onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Hapus"><X size={14} /></button>
                  </span>}
                </li>
              ))}
            </ol>
            {options.map((o) => (
              <label key={o.key} className="grid gap-1.5 text-sm font-medium">{o.label}
                {o.choices
                  ? <select className={field} value={vals[o.key]} onChange={(e) => setVals({ ...vals, [o.key]: e.target.value })}>{o.choices.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                  : <input className={field} value={vals[o.key]} placeholder={o.ph} onChange={(e) => setVals({ ...vals, [o.key]: e.target.value })} />}
              </label>
            ))}
            <button className={btnPrimary} disabled={busy} onClick={go}>{busy ? 'Memproses…' : label}</button>
          </section>
          {out && (
            <section className={`${card} grid gap-3`}>
              <h2 className="font-serif text-xl">Selesai · {formatSize(out.blob.size)}</h2>
              {inSize > 0 && <p className="text-sm text-mute">Sebelumnya {formatSize(inSize)} ({diff >= 0 ? '−' + diff : '+' + -diff}%)</p>}
              {out.blob.type === 'application/pdf' && <iframe className="h-96 w-full rounded-xl border border-line bg-surface" src={out.url} title="Pratinjau hasil" />}
              <button className={btnPrimary} onClick={() => download(out.blob, out.name)}><Download size={16} />Unduh {out.name}</button>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
