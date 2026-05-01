import cards from '../data/dashboard-cards.json'

export type DashboardCardAccent = 'violet' | 'teal' | 'sky' | 'rose'
export type DashboardCardAlertSeverity = 'info' | 'warn' | 'urgent'

/** Bundled dashboard card copy for Puck defaults — edit `src/data/dashboard-cards.json` to tweak. */
export const DASHBOARD_CARDS_FIXTURE = cards
