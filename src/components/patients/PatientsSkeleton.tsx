const CARD_COUNT = 10
const ROW_COUNT = 10

const pulse = 'animate-pulse rounded-md bg-violet-200/60 dark:bg-violet-500/20'

export const PatientGridSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading patients">
    {Array.from({ length: CARD_COUNT }).map((_, i) => (
      <div
        key={i}
        className="rounded-xl border border-violet-200/50 bg-white p-4 dark:border-violet-500/15 dark:bg-slate-950"
      >
        <div className="flex gap-4">
          <div className={`h-16 w-16 shrink-0 rounded-full ${pulse}`} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className={`h-4 w-32 ${pulse}`} />
            <div className={`h-3 w-24 ${pulse}`} />
            <div className={`mt-1 h-5 w-20 rounded-full ${pulse}`} />
          </div>
        </div>
        <div className="mt-4 space-y-2 border-t border-violet-100/80 pt-4 dark:border-violet-500/15">
          <div className={`h-3 w-full ${pulse}`} />
          <div className={`h-3 w-full ${pulse}`} />
          <div className={`h-3 w-4/5 ${pulse}`} />
          <div className={`h-3 w-3/4 ${pulse}`} />
        </div>
      </div>
    ))}
  </div>
)

export const PatientListSkeleton = () => (
  <div
    className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-violet-200/80 bg-white shadow-sm shadow-violet-200/25 dark:border-violet-500/40 dark:bg-slate-950 dark:shadow-violet-950/40"
    aria-busy="true"
    aria-label="Loading patients"
  >
    <div className="scrollbar-hide min-h-0 flex-1 overflow-auto overscroll-y-contain">
      <table className="min-w-[56rem] border-separate border-spacing-0 text-sm">
        <thead className="bg-violet-100 dark:bg-slate-900">
        <tr>
          {[56, 64, 56, 56, 40, 56, 48].map((w, idx) => (
            <th key={idx} className="whitespace-nowrap px-4 py-3">
              <div className={`mx-auto h-3 ${pulse}`} style={{ width: w }} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="[&_td]:border-b [&_td]:border-violet-100/80 dark:[&_td]:border-violet-500/15">
        {Array.from({ length: ROW_COUNT }).map((_, r) => (
          <tr key={r}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 shrink-0 rounded-full ${pulse}`} />
                <div className="flex flex-col gap-1.5">
                  <div className={`h-4 w-32 ${pulse}`} />
                  <div className={`h-3 w-20 ${pulse}`} />
                </div>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex flex-col gap-2">
                <div className={`h-3 w-full min-w-[10rem] max-w-[14rem] ${pulse}`} />
                <div className={`h-3 w-28 ${pulse}`} />
              </div>
            </td>
            <td className="px-4 py-3">
              <div className={`h-3 w-28 ${pulse}`} />
            </td>
            <td className="px-4 py-3">
              <div className={`h-3 w-36 ${pulse}`} />
            </td>
            <td className="px-4 py-3">
              <div className={`h-3 w-14 ${pulse}`} />
            </td>
            <td className="px-4 py-3">
              <div className={`h-3 w-24 ${pulse}`} />
            </td>
            <td className="px-4 py-3">
              <div className={`h-6 w-20 rounded-full ${pulse}`} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </div>
)
