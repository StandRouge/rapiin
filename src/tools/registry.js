import { Combine, Scissors, RotateCw, ArrowDownUp, Trash2, Shrink, FileImage, Images, Type, Stamp, Hash, Lock, LockOpen, Layers, Repeat, PenLine, ShieldCheck } from 'lucide-react'
import PdfToJpg from './PdfToJpg'
import { Merge, Split, Rotate, JpgToPdf, Compress } from './simple'
import { Reorder, Remove } from './pages'

const color = '#66c0f4'
export const CATS = {
  atur: { label: 'Atur halaman', Icon: Layers, color },
  kecil: { label: 'Kecilkan', Icon: Shrink, color },
  konversi: { label: 'Ubah format', Icon: Repeat, color },
  edit: { label: 'Edit', Icon: PenLine, color },
  aman: { label: 'Keamanan', Icon: ShieldCheck, color },
}

// Component diisi = sudah jalan. Tanpa Component = tampil "Segera".
export const TOOLS = [
  { id: 'gabung', name: 'Gabung PDF', desc: 'Satukan beberapa PDF jadi satu berkas.', cat: 'atur', Icon: Combine, Component: Merge },
  { id: 'pisah', name: 'Pisah PDF', desc: 'Ambil halaman tertentu, atau pecah jadi satu file per halaman.', cat: 'atur', Icon: Scissors, Component: Split },
  { id: 'putar', name: 'Putar halaman', desc: 'Putar semua halaman 90°, 180°, atau 270°.', cat: 'atur', Icon: RotateCw, Component: Rotate },
  { id: 'susun', name: 'Susun ulang', desc: 'Seret thumbnail halaman untuk mengubah urutannya.', cat: 'atur', Icon: ArrowDownUp, Component: Reorder },
  { id: 'hapus', name: 'Hapus halaman', desc: 'Pilih halaman yang tidak dibutuhkan lalu buang.', cat: 'atur', Icon: Trash2, Component: Remove },
  { id: 'kompres', name: 'Kecilkan ukuran PDF', desc: 'Buat file lebih ringan untuk dikirim lewat email atau chat.', cat: 'kecil', Icon: Shrink, Component: Compress },
  { id: 'pdf-jpg', name: 'PDF jadi JPG', desc: 'Ubah tiap halaman jadi gambar yang jernih dan ringan.', cat: 'konversi', Icon: FileImage, Component: PdfToJpg },
  { id: 'jpg-pdf', name: 'JPG jadi PDF', desc: 'Susun foto atau hasil scan menjadi satu PDF.', cat: 'konversi', Icon: Images, Component: JpgToPdf },
  { id: 'pdf-teks', name: 'PDF jadi teks', desc: 'Ambil teks dari PDF.', cat: 'konversi', Icon: Type },
  { id: 'watermark', name: 'Watermark', desc: 'Tambahkan teks atau logo di setiap halaman.', cat: 'edit', Icon: Stamp },
  { id: 'nomor', name: 'Nomor halaman', desc: 'Beri nomor otomatis di bagian bawah halaman.', cat: 'edit', Icon: Hash },
  { id: 'kunci', name: 'Kunci PDF', desc: 'Lindungi PDF dengan kata sandi.', cat: 'aman', Icon: Lock },
  { id: 'buka', name: 'Buka kunci PDF', desc: 'Hapus kata sandi dari PDF milikmu.', cat: 'aman', Icon: LockOpen },
]
