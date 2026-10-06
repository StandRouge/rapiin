import { Archive } from 'lucide-react'
import JSZip from 'jszip'
import { formatSize, download } from '../lib/format'
import { btnPrimary } from '../ui'
export default function DownloadAll({ results, base }) {
  const items = Object.entries(results)
  if (!items.length) return null
  const total = items.reduce((s, [, r]) => s + r.size, 0)
  const zip = async () => {
    const z = new JSZip()
    items.forEach(([n, r]) => z.file(`${base}-${n}.jpg`, r.blob))
    download(await z.generateAsync({ type: 'blob' }), `${base}-jpg.zip`)
  }
  return <button className={`${btnPrimary} justify-self-start`} onClick={zip}><Archive size={16} />Unduh semua (ZIP) · {items.length} gambar · {formatSize(total)}</button>
}
