export type NotificationSeverity = 'info' | 'warning' | 'critical'

export type AppNotification = {
  id: string
  title: string
  message: string
  severity: NotificationSeverity
  category: string
  source: string
  createdAt: string
  read: boolean
}
