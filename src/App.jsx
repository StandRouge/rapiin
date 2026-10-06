import { useState, useEffect } from 'react'
import { TOOLS } from './tools/registry'
import Home from './components/Home'
import ToolShell from './components/ToolShell'

const getId = () => location.hash.slice(1)
export default function App() {
  const [id, setId] = useState(getId())
  useEffect(() => {
    const f = () => setId(getId())
    addEventListener('hashchange', f)
    return () => removeEventListener('hashchange', f)
  }, [])
  const tool = TOOLS.find((t) => t.id === id && t.Component)
  return tool ? <ToolShell tool={tool}><tool.Component /></ToolShell> : <Home />
}
