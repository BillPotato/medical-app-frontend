import { useEffect, useMemo, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Dashboard({ tasks = [] }) {
  const [surveys, setSurveys] = useState([])

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('surveys') || '[]')
    setSurveys(s)
  }, [])

  const summary = useMemo(() => {
    // simple: count surveys per day and average mood
    if (!surveys.length) return { labels: [], moods: [] }
    const labels = surveys.map((s) => new Date(s.date).toLocaleDateString())
    const moods = surveys.map((s) => Number(s.answers.mood || 0))
    return { labels, moods }
  }, [surveys])

  function exportCalendar() {
    // prepare event payloads for tasks
    const events = tasks.map((t, i) => ({
      summary: t.title,
      description: `Frequency: ${t.frequency}`,
      // naive timing
      start: { dateTime: new Date(Date.now() + i * 3600 * 1000).toISOString() },
      end: { dateTime: new Date(Date.now() + (i * 3600 + 30 * 60) * 1000).toISOString() },
    }))
    // In a real app this would call a backend that performs OAuth and then inserts events into Google Calendar
    alert(`Prepared ${events.length} events for export. Implement server-side OAuth to send them.`)
    console.log('calendar events', events)
  }

  return (
    <div style={{padding:20}}>
      <h2>Dashboard</h2>
      <div style={{marginBottom:12}}>
        <strong>Tasks ({tasks.length})</strong>
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>{t.title} — {t.frequency}</li>
          ))}
        </ul>
        <button onClick={exportCalendar}>Export to Google Calendar (stub)</button>
      </div>

      <div style={{maxWidth:600}}>
        <h3>Weekly summary</h3>
        {summary.labels.length ? (
          <Bar
            data={{ labels: summary.labels, datasets: [{ label: 'Mood', data: summary.moods, backgroundColor: 'rgba(75,192,192,0.6)' }] }}
          />
        ) : (
          <p>No survey data yet — submit the daily survey to populate charts.</p>
        )}
      </div>
    </div>
  )
}
