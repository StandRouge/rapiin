import { card, field, btnPrimary } from '../ui'
const DPI = [[100, 'Hemat'], [150, 'Standar'], [200, 'Jernih'], [300, 'Cetak']]
const Label = ({ t, children }) => <label className="grid gap-1.5 text-sm font-medium">{t}{children}</label>
export default function SettingsPanel({ opts, setOpts, range, setRange, total, onConvert, busy }) {
  return (
    <section className={`${card} grid gap-4`}>
      <h2 className="font-serif text-xl">Pengaturan</h2>
      <Label t="Resolusi">
        <select className={field} value={opts.dpi} onChange={(e) => setOpts({ ...opts, dpi: +e.target.value })}>
          {DPI.map(([v, l]) => <option key={v} value={v}>{l} ({v} DPI)</option>)}
        </select>
      </Label>
      <Label t={`Kualitas JPG: ${Math.round(opts.quality * 100)}%`}>
        <input type="range" className="accent-brand" min="0.5" max="0.95" step="0.05" value={opts.quality} onChange={(e) => setOpts({ ...opts, quality: +e.target.value })} />
        <small className="font-normal text-mute">75–85% biasanya jernih dengan ukuran file kecil.</small>
      </Label>
      <Label t={`Halaman (dari ${total})`}>
        <input className={field} value={range} placeholder="Semua, atau contoh: 1-3,5" onChange={(e) => setRange(e.target.value)} />
      </Label>
      <button className={btnPrimary} disabled={busy} onClick={onConvert}>{busy ? 'Mengonversi…' : 'Konversi ke JPG'}</button>
    </section>
  )
}
