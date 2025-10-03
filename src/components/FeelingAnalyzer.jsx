import { useState } from 'react'

export default function FeelingAnalyzer() {
  const [feelingText, setFeelingText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  async function analyzeFeeling() {
    if (!feelingText.trim()) return
    setIsAnalyzing(true)
    setAnalysis(null)

    try {
      // Attempt server-side analysis first
      const res = await fetch('/api/analyze-feeling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: feelingText })
      })

      if (!res.ok) {
        // Fallback to local analysis
        setAnalysis(localAnalyze(feelingText))
        return
      }

      const data = await res.json()
      setAnalysis(data)
    } catch (err) {
      // Network error - use local fallback
      setAnalysis(localAnalyze(feelingText))
    } finally {
      setIsAnalyzing(false)
    }
  }

  function localAnalyze(text) {
    // Simple keyword-based analysis for offline/demo mode
    const t = text.toLowerCase()
    const recs = []
    let issue = 'Unclear from description'

    if (/\b(pain|ache|hurt|sharp|stomach|headache)\b/.test(t)) {
      issue = 'Possible physical pain/discomfort'
      recs.push('Log pain levels and timing in daily survey')
      recs.push('Consider over-the-counter pain relief if appropriate')
      recs.push('Consult healthcare provider if severe or persistent')
    }

    if (/\b(tired|fatigue|sleep|insomnia)\b/.test(t)) {
      issue = 'Possible sleep/energy issues'
      recs.push('Maintain consistent sleep schedule')
      recs.push('Track sleep patterns in daily survey')
      recs.push('Review sleep hygiene practices')
    }

    if (/\b(anxious|worried|stress|depress|sad|mood)\b/.test(t)) {
      issue = 'Possible mood/emotional concern'
      recs.push('Continue tracking mood in daily survey')
      recs.push('Consider speaking with mental health professional')
      recs.push('Try relaxation or mindfulness exercises')
    }

    if (!recs.length) {
      recs.push('Please provide more specific symptoms')
      recs.push('Consider discussing with healthcare provider')
    }

    return {
      issue,
      recommendations: recs,
      source: 'local-analysis',
      timestamp: new Date().toISOString()
    }
  }

  return (
    <div style={{marginBottom:20}}>
      <h3>Describe how you feel</h3>
      <p>Enter your symptoms or concerns for analysis and recommendations.</p>
      <textarea
        value={feelingText}
        onChange={(e) => setFeelingText(e.target.value)}
        placeholder="Describe how you're feeling (e.g., 'I've had a headache and feeling tired')..."
        style={{width:'100%', minHeight:100, marginBottom:10}}
      />
      <div>
        <button 
          onClick={analyzeFeeling} 
          disabled={isAnalyzing || !feelingText.trim()}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </button>
        <button 
          onClick={() => {
            setFeelingText('')
            setAnalysis(null)
          }} 
          style={{marginLeft:10}}
        >
          Clear
        </button>
      </div>

      {analysis && (
        <div style={{marginTop:15, padding:15, border:'1px solid #ddd', borderRadius:4, backgroundColor:'#f9f9f9'}}>
          <h4 style={{marginTop:0}}>Analysis Results</h4>
          <div>
            <strong>Potential Issue:</strong> {analysis.issue}
          </div>
          <div style={{marginTop:10}}>
            <strong>Recommendations:</strong>
            <ul style={{marginTop:5}}>
              {analysis.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
          <div style={{fontSize:12, color:'#666', marginTop:10}}>
            Source: {analysis.source} | {new Date(analysis.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}