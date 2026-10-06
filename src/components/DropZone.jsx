import { Upload } from 'lucide-react'
import { useState } from 'react'
export default function DropZone({ onFiles, accept, multiple, title, hint }) {
  const [over, setOver] = useState(false)
  return (
    <label
      className={`grid cursor-pointer place-items-center gap-1 rounded-3xl border-2 border-dashed p-14 text-center transition ${over ? 'border-brand bg-line/30' : 'border-line bg-surface hover:border-brand'}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); e.dataTransfer.files.length && onFiles([...e.dataTransfer.files]) }}>
      <input type="file" hidden accept={accept} multiple={multiple} onChange={(e) => e.target.files.length && onFiles([...e.target.files])} />
      <span className="mb-2 grid h-12 w-12 place-items-center rounded-full bg-line/30 text-2xl text-brand"><Upload size={22} /></span>
      <strong className="font-serif text-2xl font-normal">{title}</strong>
      <span className="max-w-md text-sm text-mute">{hint}</span>
    </label>
  )
}
