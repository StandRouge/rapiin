export function parseRange(text, total) {
  if (!text.trim()) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set()
  text.split(',').forEach((part) => {
    const [a, b = a] = part.split('-').map((s) => parseInt(s, 10))
    if (!a || !b) return
    for (let i = Math.min(a, b); i <= Math.max(a, b); i++) if (i >= 1 && i <= total) set.add(i)
  })
  return [...set].sort((x, y) => x - y)
}
