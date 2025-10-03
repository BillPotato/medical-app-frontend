import { useEffect, useState } from 'react'
import MedicationParser from './components/MedicationParser'
import Survey from './components/Survey'
import Dashboard from './components/Dashboard'
import FeelingAnalyzer from './components/FeelingAnalyzer'

function App() {
  const [view, setView] = useState('dashboard')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem('tasks') || '[]')
    setTasks(t)
  }, [])

  function saveTasks(newTasks) {
    const merged = [...newTasks, ...tasks]
    localStorage.setItem('tasks', JSON.stringify(merged))
    setTasks(merged)
    setView('dashboard')
  }

  function handleSurveySubmit(payload) {
    // just switch to dashboard so user sees the summary
    setView('dashboard')
  }

  return (
    <div style={{fontFamily:'system-ui, sans-serif', maxWidth:900, margin:'0 auto'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:12}}>
        <h1>Patient Helper (prototype)</h1>
        <nav>
          <button onClick={() => setView('dashboard')}>Dashboard</button>
          <button onClick={() => setView('parser')}>Medication parser</button>
          <button onClick={() => setView('survey')}>Daily survey</button>
          <button onClick={() => setView('analyzer')}>Feeling Analyzer</button>
        </nav>
      </header>

      <main>
        {view === 'dashboard' && <Dashboard tasks={tasks} />}
        {view === 'parser' && <MedicationParser onSave={saveTasks} />}
        {view === 'survey' && <Survey onSubmit={handleSurveySubmit} />}
        {view === 'analyzer' && <FeelingAnalyzer />}
      </main>
    </div>
  )
}

export default App
