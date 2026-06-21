import { useEffect, useState } from 'react'

export function useAsync(task, deps = []) {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  async function run() {
    try {
      if (data === null) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      setError('')
      const result = await task()
      setData(result)
    } catch (e) {
      if (e && typeof e === 'object') {
        setError(e.message || JSON.stringify(e))
      } else {
        setError(String(e || 'Request failed'))
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { void run() }, deps)

  return { loading, refreshing, error, data, reload: run, setData }
}
