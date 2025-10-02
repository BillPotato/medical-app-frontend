import { useState } from 'react'

export default function MedicationParser({ onSave }) {
  const [text, setText] = useState('')

  function parseToTasks(input) {
    // Very small heuristic parser: split lines, look for dose/time words
    return input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, i) => ({
        id: `${Date.now()}-${i}`,
        title: line,
        // naive: if contains 'daily' or 'once' set daily, otherwise 'as directed'
        frequency: /daily|once|every/i.test(line) ? 'daily' : 'as-directed',
      }))
  }

  function handleSave() {
    const tasks = parseToTasks(text)
    onSave(tasks)
    setText('')
  }

  return (
    <div style={{padding:20}}>
      <h2>Medication parser</h2>
      <p>Paste a medication list and click "Create tasks" to turn each line into an atomic task.</p>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} style={{width:'100%'}} />
      <div style={{marginTop:10}}>
        <button onClick={handleSave}>Create tasks</button>
      </div>
    </div>
  )
}
