import { useState } from 'react'

const KPI_CARDS = [
  { label: 'Total Members', value: '1,247' },
  { label: 'Activation Rate', value: '68%' },
  { label: 'Events This Quarter', value: '9' },
  { label: 'Ambassador Pipeline', value: '14' },
]

const PROGRAMS = [
  {
    program: 'Ambassador Sourcing',
    status: 'On Track',
    owner: 'Diana G.',
    milestone: '5 new recruits by June 30',
  },
  {
    program: 'Onboarding Flow',
    status: 'In Progress',
    owner: 'Diana G.',
    milestone: 'Finalize welcome sequence',
  },
  {
    program: 'Campus Outreach',
    status: 'Planning',
    owner: 'TBD',
    milestone: 'Q3 kickoff',
  },
  {
    program: 'Event Calendar',
    status: 'Active',
    owner: 'Diana G.',
    milestone: 'VibeFest follow-up June 15',
  },
]

const CHANNELS = [
  { name: '#welcome-and-intros', lastActive: '2 hours ago', members: 312 },
  { name: '#ambassador-chat', lastActive: '18 min ago', members: 47 },
  { name: '#events', lastActive: 'Yesterday, 4:32 PM', members: 189 },
  { name: '#feedback', lastActive: '3 days ago', members: 96 },
]

const STATUS_FILTERS = ['All', 'On Track', 'In Progress', 'Planning', 'Active']

const STATUS_STYLES = {
  'On Track': 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'In Progress': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Planning: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  Active: 'bg-blue-50 text-blue-700 ring-blue-600/20',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600 ring-slate-500/20'}`}
    >
      {status}
    </span>
  )
}

function App() {
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredPrograms =
    statusFilter === 'All'
      ? PROGRAMS
      : PROGRAMS.filter((row) => row.status === statusFilter)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <h1 className="text-lg font-semibold tracking-tight">
            Community Ops Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Program Health at a Glance
          </p>
        </div>
      </header>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <p className="text-xs font-semibold text-gray-900">The approach</p>
          <p className="mt-1.5 max-w-3xl text-sm leading-snug text-gray-500">
            Healthy communities don't run on vibes. They run on clear program
            ownership, consistent activation loops, and channels people actually
            use. This dashboard tracks the three things that matter most: who's
            in the pipeline, where programs stand, and whether channels are
            alive.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
        <section>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {KPI_CARDS.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-5 sm:py-4"
              >
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 sm:text-xs">
                  {kpi.label}
                </p>
                <p className="mt-1.5 text-xl font-semibold tabular-nums text-gray-900 sm:mt-2 sm:text-2xl">
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">
              Program Status
            </h2>
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    statusFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredPrograms.map((row) => (
              <div
                key={row.program}
                className="rounded-lg border border-gray-200 bg-white px-4 py-3.5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-gray-900">
                    {row.program}
                  </p>
                  <StatusBadge status={row.status} />
                </div>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-gray-500">Owner</dt>
                    <dd className="text-gray-700">{row.owner}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-gray-500">Next</dt>
                    <dd className="text-gray-700">{row.milestone}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Program', 'Status', 'Owner', 'Next Milestone'].map(
                    (col) => (
                      <th
                        key={col}
                        scope="col"
                        className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPrograms.map((row) => (
                  <tr key={row.program} className="hover:bg-gray-50/80">
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-gray-900">
                      {row.program}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-gray-600">
                      {row.owner}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      {row.milestone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Channel Health
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CHANNELS.map((channel) => (
              <div
                key={channel.name}
                className="rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm"
              >
                <p className="font-mono text-sm font-medium text-gray-900">
                  {channel.name}
                </p>
                <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-gray-500">
                    Last active{' '}
                    <span className="text-gray-700">{channel.lastActive}</span>
                  </span>
                  <span className="w-fit rounded bg-gray-100 px-2 py-0.5 font-medium tabular-nums text-gray-700">
                    {channel.members} members
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
