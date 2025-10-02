import { useState } from 'react'

const defaultQuestions = [
  { id: 'mood', text: 'How is your mood today? (1-5)' },
  { id: 'pain', text: 'Any pain today? (0-10)' },
  { id: 'exercise', text: 'Minutes exercised today' },
]

export default function Survey({ onSubmit }) {
  const [answers, setAnswers] = useState(() => {
    const init = {}
    defaultQuestions.forEach((q) => (init[q.id] = ''))
    return init
  })

  function handleChange(id, value) {
    setAnswers((s) => ({ ...s, [id]: value }))
  }

  function submit() {
    const payload = { id: Date.now(), date: new Date().toISOString(), answers }
    // local save
    const existing = JSON.parse(localStorage.getItem('surveys') || '[]')
    localStorage.setItem('surveys', JSON.stringify([payload, ...existing]))
    onSubmit && onSubmit(payload)
    // reset
    setAnswers(() => {
      const init = {}
      defaultQuestions.forEach((q) => (init[q.id] = ''))
      return init
    })
  }

  return (
    <div style={{padding:20}}>
      <h2>Daily survey</h2>
      <p>Quick daily check-in (saved locally).</p>
      {defaultQuestions.map((q) => (
        <div key={q.id} style={{marginBottom:8}}>
          <label style={{display:'block'}}>{q.text}</label>
          <input value={answers[q.id]} onChange={(e) => handleChange(q.id, e.target.value)} />
        </div>
      ))}
      <button onClick={submit}>Submit</button>
    </div>
  )
}
