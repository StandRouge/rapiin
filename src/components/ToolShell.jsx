import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { CATS } from '../tools/registry'
import { Logo } from './sections'
import { btn } from '../ui'

export default function ToolShell({ tool, children }) {
  useEffect(() => { scrollTo(0, 0) }, [])
  const c = CATS[tool.cat].color
  return (
    <div className="min-h-screen">
      <header className="border-b border-line"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"><Logo /><a href="#" className={btn}><ArrowLeft size={16} />Semua alat</a></div></header>
      <section style={{ background: `linear-gradient(180deg, ${c}26, transparent)` }}>
        <div className="mx-auto max-w-6xl px-5 pb-6 pt-10">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-paper"><tool.Icon size={24} /></span>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">{tool.name}</h1>
          <p className="mt-2 max-w-2xl text-mute">{tool.desc} Diproses di perangkatmu, tanpa diunggah.</p>
        </div>
      </section>
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-4">{children}</main>
    </div>
  )
}
