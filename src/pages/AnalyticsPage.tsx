import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const trendData = [
  { name: 'Mon', admissions: 22, discharges: 13 },
  { name: 'Tue', admissions: 18, discharges: 10 },
  { name: 'Wed', admissions: 27, discharges: 14 },
  { name: 'Thu', admissions: 24, discharges: 16 },
  { name: 'Fri', admissions: 31, discharges: 20 },
  { name: 'Sat', admissions: 16, discharges: 11 },
  { name: 'Sun', admissions: 12, discharges: 9 },
]

export const AnalyticsPage = () => (
  <section className="space-y-6">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
      <p className="text-sm text-slate-500">
        Weekly admission and discharge trends for operational planning.
      </p>
    </div>

    <div className="h-80 rounded-lg border border-slate-200 bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="admissions"
            stroke="#2563eb"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="discharges"
            stroke="#16a34a"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </section>
)
