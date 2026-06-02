import { useEffect, useState } from 'react'

export function useAsync(task, deps = []) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  async function run() {
    try {
      setLoading(true)
      setError('')
      setData(await task())
    } catch (e) {
      setError(e.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { void run() }, deps)

  return { loading, error, data, reload: run, setData }
}
