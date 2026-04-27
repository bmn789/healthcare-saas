const metrics = [
  { label: 'Active Patients', value: '138' },
  { label: 'Doctors On Shift', value: '42' },
  { label: 'Critical Alerts', value: '7' },
  { label: 'Avg. Wait Time', value: '12 min' },
]

const triggerLocalNotification = async () => {
  if (!('Notification' in window)) {
    alert('Notifications are not supported in this browser.')
    return
  }

  try {
    const permission =
      Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission()

    if (permission !== 'granted') {
      alert('Notification permission is required to trigger alerts.')
      return
    }

    let registration: ServiceWorkerRegistration | undefined
    if ('serviceWorker' in navigator) {
      const existing = await navigator.serviceWorker.getRegistration()
      if (!existing) {
        await navigator.serviceWorker.register('/sw.js')
      }
      registration = await navigator.serviceWorker.ready
    }

    const payload = {
      body: 'Room ICU-12 requires nurse follow-up in the next 10 minutes.',
      icon: '/favicon.svg',
      tag: 'critical-patient-reminder',
    }

    if (registration?.active) {
      await registration.showNotification('Critical Patient Reminder', payload)
      return
    }

    new Notification('Critical Patient Reminder', payload)
  } catch (error) {
    console.error('Unable to trigger notification:', error)
    alert('Unable to trigger notification. Please try again.')
  }
}

export const DashboardPage = () => (
  <section className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Home Dashboard</h1>
        <p className="text-sm text-slate-500">
          Snapshot of real-time hospital operations
        </p>
      </div>
      <button
        type="button"
        onClick={() => void triggerLocalNotification()}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Trigger Notification
      </button>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-500">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{metric.value}</p>
        </article>
      ))}
    </div>

    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
      Notification use case: click <strong>Trigger Notification</strong> to send a
      local alert for a critical patient follow-up reminder using service workers.
    </div>
  </section>
)
