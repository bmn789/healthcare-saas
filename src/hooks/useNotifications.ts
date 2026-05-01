import { useEffect } from 'react'
import { serviceWorkerScope, serviceWorkerUrl } from '../lib/serviceWorker'

export const useNotifications = () => {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    void navigator.serviceWorker.register(serviceWorkerUrl(), {
      scope: serviceWorkerScope(),
    })
  }, [])
}
