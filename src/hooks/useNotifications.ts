import { useEffect } from 'react'

export const useNotifications = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js')
    }
  }, [])
}
