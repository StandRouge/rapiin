import { FileStack, ArrowRight, FilePlus, SlidersHorizontal, Cpu, Download, ServerOff, UserX, WifiOff } from 'lucide-react'
import { TOOLS, CATS } from '../tools/registry'
import { btnPrimary, btnLg, btnLgGhost } from '../ui'

export const Logo = () => (
  <a href="#" className="flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight">
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-paper"><FileStack size={18} /></span>
    Rapi<span className="text-brand">in</span>
  </a>
)

export const Nav = () => (
  <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
      <Logo />
      <nav className="hidden gap-8 text-sm font-medium md:flex">
        {[['Alat', '#alat'], ['Cara kerja', '#cara'], ['Privasi', '#privasi']].map(([l, h]) => <a key={h} href={h} className="hover:text-brand">{l}</a>)}
      </nav>
      <a href="#alat" className={btnPrimary}>Pilih alat</a>
    </div>
  </header>
)

function Mock() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-20">
      <div className="rounded-3xl border border-line bg-surface p-5 text-left shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between">
          <b className="font-serif text-lg font-semibold">Gabung PDF</b>
          <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-brand">● Diproses di perangkatmu</span>
        </div>
        {[['laporan.pdf', '2,4 MB'], ['lampiran.pdf', '1,1 MB']].map(([n, s]) => (
          <div key={n} className="mt-3 flex justify-between rounded-xl bg-paper px-4 py-3 text-sm"><span>{n}</span><span className="text-mute">{s}</span></div>
        ))}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-line/60 px-4 py-3 text-sm">
          <span className="font-medium text-brand">gabungan.pdf · 3,5 MB</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-1.5 font-semibold text-paper"><Download size={14} />Unduh</span>
        </div>
      </div>
    </div>
  )
}

export const Hero = () => (
  <section className="relative overflow-hidden">
    <div aria-hidden className="absolute inset-0 -z-10">
      <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand opacity-20 blur-3xl" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-line opacity-80 blur-3xl" />
      <div className="absolute left-1/2 top-56 h-72 w-72 rounded-full bg-surface opacity-90 blur-3xl" />
    </div>
    <div className="mx-auto max-w-4xl px-5 pb-12 pt-20 text-center">
      <h1 className="font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl">Rapikan PDF-mu, tanpa ribet.</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-mute">Gabung, pisah, kecilkan, dan ubah PDF langsung di browser. Gratis, tanpa akun, dan berkasmu tidak pernah diunggah.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href="#alat" className={btnLg}>Pilih alat<ArrowRight size={18} /></a>
        <a href="#privasi" className={btnLgGhost}>Bagaimana privasinya?</a>
      </div>
      <p className="mt-3 text-sm text-mute">Gratis · tanpa akun · bisa dipakai offline</p>
    </div>
    <Mock />
  </section>
)

export const CatCards = ({ onPick }) => (
  <section className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-5">
    {Object.entries(CATS).map(([k, c]) => {
      const all = TOOLS.filter((t) => t.cat === k), ready = all.filter((t) => t.Component).length
      return (
        <button key={k} onClick={() => onPick(k)} className="rounded-3xl border border-line bg-surface p-5 text-left transition hover:-translate-y-1 hover:border-brand">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand"><c.Icon size={20} /></span>
          <h3 className="mt-5 font-serif text-xl">{c.label}</h3>
          <p className="mt-1 text-sm text-mute">{ready} dari {all.length} alat tersedia</p>
        </button>
      )
    })}
  </section>
)

const STEPS = [[FilePlus, 'Pilih berkas', 'Tarik berkas ke halaman, atau klik untuk memilihnya.'], [SlidersHorizontal, 'Atur sesuai kebutuhan', 'Tentukan halaman, resolusi, atau tingkat kompresi.'], [Cpu, 'Tunggu sebentar', 'Semua dikerjakan di perangkatmu, tanpa antre di server.'], [Download, 'Unduh hasilnya', 'Simpan satu per satu atau sekaligus dalam ZIP.']]
export const Steps = () => (
  <section id="cara" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
    <h2 className="max-w-2xl font-serif text-4xl md:text-5xl">Empat langkah dari berkas ke hasil.</h2>
    <div className="mt-10 grid gap-4 md:grid-cols-4">
      {STEPS.map(([Icon, t, d], i) => (
        <div key={t} className="rounded-3xl border border-line bg-surface p-6">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand text-paper"><Icon size={20} /></span>
          <p className="mt-5 text-sm text-mute">Langkah {i + 1}</p>
          <h3 className="font-serif text-2xl">{t}</h3>
          <p className="mt-2 text-sm text-mute">{d}</p>
        </div>
      ))}
    </div>
  </section>
)

export const Privacy = () => (
  <section id="privasi" className="scroll-mt-20 border-y border-line bg-surface py-24">
    <div className="mx-auto max-w-6xl px-5">
      <h2 className="max-w-3xl font-serif text-4xl md:text-5xl">Berkasmu tidak pernah meninggalkan browser.</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[[ServerOff, 'Tanpa server', 'Semua diproses di browser. Tidak ada yang dikirim ke mana pun.'], [UserX, 'Tanpa akun', 'Langsung pakai. Tidak perlu daftar atau login.'], [WifiOff, 'Bisa offline', 'Setelah halaman dimuat, alat tetap jalan tanpa internet.']].map(([Icon, a, b]) => (
          <div key={a} className="rounded-3xl border border-line bg-paper p-6">
            <Icon className="text-brand" size={28} />
            <p className="mt-4 font-serif text-2xl">{a}</p>
            <p className="mt-2 text-sm text-mute">{b}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export const Cta = () => (
  <section className="mx-auto max-w-6xl px-5 py-24">
    <div className="rounded-[2rem] border border-line bg-gradient-to-br from-line to-surface px-6 py-20 text-center">
      <h2 className="font-serif text-4xl md:text-6xl">Siap merapikan PDF-mu?</h2>
      <p className="mx-auto mt-4 max-w-xl text-mute">Pilih alat, selesai dalam hitungan detik.</p>
      <a href="#alat" className={`${btnLg} mt-8`}>Pilih alat<ArrowRight size={18} /></a>
    </div>
  </section>
)

export const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 text-sm sm:grid-cols-3">
      <div><Logo /><p className="mt-3 max-w-xs text-mute">Alat PDF gratis yang berjalan sepenuhnya di browsermu.</p></div>
      <div><h4 className="font-semibold">Alat</h4><ul className="mt-3 grid gap-2 text-mute">{TOOLS.filter((t) => t.Component).map((t) => <li key={t.id}><a className="hover:text-brand" href={'#' + t.id}>{t.name}</a></li>)}</ul></div>
      <div><h4 className="font-semibold">Kategori</h4><ul className="mt-3 grid gap-2 text-mute">{Object.values(CATS).map((c) => <li key={c.label}>{c.label}</li>)}</ul></div>
    </div>
  </footer>
)
