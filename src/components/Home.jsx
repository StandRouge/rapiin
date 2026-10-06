import { useState } from 'react'
import { Search } from 'lucide-react'
import { TOOLS, CATS } from '../tools/registry'
import { Nav, Hero, CatCards, Steps, Privacy, Cta, Footer } from './sections'
import { field } from '../ui'

export default function Home() {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const list = TOOLS.filter((t) => (cat === 'all' || t.cat === cat) && (t.name + t.desc).toLowerCase().includes(q.toLowerCase()))
  const chips = [['all', 'Semua'], ...Object.entries(CATS).map(([k, v]) => [k, v.label])]
  return (
    <>
      <Nav /><Hero />
      <CatCards onPick={(k) => { setCat(k); location.hash = 'alat' }} />
      <section id="alat" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-4xl md:text-5xl">Mau diapakan PDF-nya?</h2>
          <div className="relative w-full max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
            <input className={`${field} rounded-full py-2.5 pl-10 pr-4`} type="search" placeholder="Cari alat, misalnya “kecilkan”" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari alat" />
          </div>
        </div>
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Kategori">
          {chips.map(([k, l]) => (
            <button key={k} onClick={() => setCat(k)} className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${cat === k ? 'border-brand bg-brand text-paper' : 'border-line bg-surface hover:border-brand'}`}>{l}</button>
          ))}
        </nav>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => {
            const ready = !!t.Component
            return (
              <a key={t.id} href={ready ? '#' + t.id : undefined} aria-disabled={!ready}
                className={`rounded-2xl border border-line bg-surface p-5 transition ${ready ? 'hover:-translate-y-0.5 hover:border-brand' : 'opacity-60'}`}>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand"><t.Icon size={22} /></span>
                <h3 className="mt-4 font-serif text-xl">{t.name}{!ready && <em className="ml-2 rounded-full bg-line px-2 py-0.5 align-middle font-sans text-xs not-italic text-ink">Segera</em>}</h3>
                <p className="mt-1 text-sm text-mute">{t.desc}</p>
              </a>
            )
          })}
          {!list.length && <p className="text-mute">Tidak ada alat yang cocok.</p>}
        </div>
      </section>
      <Steps /><Privacy /><Cta /><Footer />
    </>
  )
}
