import { useState, useCallback, useRef, useEffect } from 'react'
import { loadPdf, renderPageToJpg } from '../lib/pdf'

export default function usePdfConverter() {
  const [file, setFile] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [results, setResults] = useState({}) // { [page]: {url, size, width, height, blob} }
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const urls = useRef([])

  const clear = () => { urls.current.forEach(URL.revokeObjectURL); urls.current = []; setResults({}) }
  useEffect(() => clear, [])

  const open = useCallback(async (f) => {
    setError(''); clear()
    if (f.type !== 'application/pdf') return setError('File harus berformat PDF.')
    try { setPdf(await loadPdf(f)); setFile(f) }
    catch { setError('PDF tidak bisa dibuka. File mungkin rusak atau diproteksi password.') }
  }, [])

  const convert = useCallback(async (pages, opts) => {
    setBusy(true); setError(''); clear()
    try {
      for (const n of pages) {
        const r = await renderPageToJpg(pdf, n, opts)
        const url = URL.createObjectURL(r.blob)
        urls.current.push(url)
        setResults((prev) => ({ ...prev, [n]: { ...r, url, size: r.blob.size } }))
      }
    } catch { setError('Konversi gagal. Coba turunkan DPI.') }
    setBusy(false)
  }, [pdf])

  return { file, pdf, results, busy, error, open, convert }
}
