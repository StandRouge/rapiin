import { Download } from 'lucide-react'
import { formatSize, download } from '../lib/format'
import { btn } from '../ui'
export default function ResultPreview({ result, page, base }) {
  const box = 'm-0 min-w-0 overflow-hidden rounded-2xl border border-line bg-surface'
  if (!result) return (
    <figure className={box}>
      <figcaption className="border-b border-line px-3 py-3 text-sm">Hasil JPG</figcaption>
      <p className="p-6 text-sm text-mute">Belum ada hasil untuk halaman {page}. Atur opsi lalu klik Konversi.</p>
    </figure>
  )
  return (
    <figure className={box}>
      <figcaption className="flex items-center justify-between gap-2 border-b border-line px-3 py-2 text-sm">
        <span>JPG · {result.width}×{result.height}px · {formatSize(result.size)}</span>
        <button className={btn} onClick={() => download(result.blob, `${base}-${page}.jpg`)}><Download size={14} />Unduh</button>
      </figcaption>
      <img className="block h-auto w-full" src={result.url} alt={`Hasil JPG halaman ${page}`} />
    </figure>
  )
}
