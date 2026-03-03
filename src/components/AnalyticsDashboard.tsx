import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Download, 
  Users, 
  Mail, 
  TrendingUp, 
  QrCode,
  BarChart3,
  Calendar
} from 'lucide-react'

interface EventStats {
  total_downloads: number
  total_signups: number
  total_logins: number
  total_emails: number
  downloads_by_type: Record<string, number>
  downloads_by_day: { date: string; count: number }[]
  recent_events: {
    id: string
    event_type: string
    created_at: string
    event_data: Record<string, any>
  }[]
}

interface AnalyticsDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function AnalyticsDashboard({ isOpen, onClose }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState<EventStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    if (isOpen) {
      fetchStats()
    }
  }, [isOpen, timeRange])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysAgo)
      const startDateStr = startDate.toISOString()

      // Fetch all events in time range
      const { data: events, error } = await supabase
        .from('events')
        .select('id, event_type, created_at, event_data')
        .gte('created_at', startDateStr)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Calculate stats
      const downloads = events?.filter(e => e.event_type === 'qr_downloaded') || []
      const signups = events?.filter(e => e.event_type === 'user_signed_up') || []
      const logins = events?.filter(e => e.event_type === 'user_logged_in') || []
      const emails = events?.filter(e => e.event_type === 'email_captured') || []

      // Downloads by QR type
      const downloadsByType: Record<string, number> = {}
      downloads.forEach(d => {
        const type = d.event_data?.qr_type || 'unknown'
        downloadsByType[type] = (downloadsByType[type] || 0) + 1
      })

      // Downloads by day
      const downloadsByDay: Record<string, number> = {}
      downloads.forEach(d => {
        const day = d.created_at.split('T')[0]
        downloadsByDay[day] = (downloadsByDay[day] || 0) + 1
      })

      const downloadsByDayArray = Object.entries(downloadsByDay)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14) // Last 14 days for chart

      setStats({
        total_downloads: downloads.length,
        total_signups: signups.length,
        total_logins: logins.length,
        total_emails: emails.length,
        downloads_by_type: downloadsByType,
        downloads_by_day: downloadsByDayArray,
        recent_events: events?.slice(0, 20) || []
      })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const maxDownloads = Math.max(...(stats?.downloads_by_day.map(d => d.count) || [1]), 1)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={<Download className="w-5 h-5" />}
                  label="Downloads"
                  value={stats.total_downloads}
                  color="blue"
                />
                <StatCard
                  icon={<Users className="w-5 h-5" />}
                  label="Signups"
                  value={stats.total_signups}
                  color="green"
                />
                <StatCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Logins"
                  value={stats.total_logins}
                  color="purple"
                />
                <StatCard
                  icon={<Mail className="w-5 h-5" />}
                  label="Emails"
                  value={stats.total_emails}
                  color="orange"
                />
              </div>

              {/* Downloads Chart */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                  Downloads Over Time
                </h3>
                {stats.downloads_by_day.length > 0 ? (
                  <div className="flex items-end gap-1 h-32">
                    {stats.downloads_by_day.map(({ date, count }) => (
                      <div
                        key={date}
                        className="flex-1 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                        style={{ height: `${(count / maxDownloads) * 100}%`, minHeight: '4px' }}
                        title={`${date}: ${count} downloads`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400">
                    No download data for this period
                  </div>
                )}
                {stats.downloads_by_day.length > 0 && (
                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>{stats.downloads_by_day[0]?.date}</span>
                    <span>{stats.downloads_by_day[stats.downloads_by_day.length - 1]?.date}</span>
                  </div>
                )}
              </div>

              {/* Downloads by Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                    Downloads by QR Type
                  </h3>
                  {Object.keys(stats.downloads_by_type).length > 0 ? (
                    <div className="space-y-2">
                      {Object.entries(stats.downloads_by_type)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 8)
                        .map(([type, count]) => (
                          <div key={type} className="flex items-center gap-3">
                            <QrCode className="w-4 h-4 text-gray-400" />
                            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 capitalize">
                              {type}
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {count}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      No type data available
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                    Recent Activity
                  </h3>
                  {stats.recent_events.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {stats.recent_events.slice(0, 10).map((event) => (
                        <div key={event.id} className="flex items-center gap-3 text-sm">
                          <div className={`w-2 h-2 rounded-full ${
                            event.event_type === 'qr_downloaded' ? 'bg-blue-500' :
                            event.event_type === 'user_signed_up' ? 'bg-green-500' :
                            event.event_type === 'user_logged_in' ? 'bg-purple-500' :
                            'bg-orange-500'
                          }`} />
                          <span className="flex-1 text-gray-700 dark:text-gray-300 capitalize">
                            {event.event_type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(event.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      No recent activity
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Failed to load analytics
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode
  label: string
  value: number
  color: 'blue' | 'green' | 'purple' | 'orange'
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  )
}