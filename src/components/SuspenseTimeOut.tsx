import React, { useEffect, useState } from 'react'
const SuspenseTimeOut = ({ fallback, timeout = 300, children }) => {
  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), timeout)
    return () => clearTimeout(timer)
  }, [timeout])
  return timedOut ? (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  ) : null
}
export default SuspenseTimeOut