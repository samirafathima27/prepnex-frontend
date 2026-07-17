import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Code, ChevronLeft, Play, CheckCircle, XCircle, Clock } from 'lucide-react'
import Editor from '@monaco-editor/react'
import api from '../api/axios'

const TOPICS = ['All', 'Arrays', 'Strings', 'LinkedList', 'Trees', 'Graphs', 'DP', 'Stack/Queue', 'Binary Search', 'Greedy', 'Backtracking', 'Hashing', 'Sorting']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']
const LANGUAGES = ['python', 'java', 'c++', 'c']

const STARTER_CODE = {
  python: '# Write your solution here\n\n',
  java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
  'c++': '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
  c: '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n'
}

export default function DSA() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [selected, setSelected] = useState(null)
  const [topic, setTopic] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [language, setLanguage] = useState('python')
  const [code, setCode] = useState(STARTER_CODE['python'])
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState({})

  useEffect(() => {
    fetchQuestions()
    fetchProgress()
  }, [])

  useEffect(() => {
    fetchQuestions()
  }, [topic, difficulty])

  const fetchQuestions = async () => {
    try {
      let url = '/api/questions'
      const params = []
      if (topic !== 'All') params.push(`topic=${topic}`)
      if (difficulty !== 'All') params.push(`difficulty=${difficulty}`)
      if (params.length) url += '?' + params.join('&')
      const res = await api.get(url)
      setQuestions(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchProgress = async () => {
    try {
      const res = await api.get('/api/questions/progress')
      const map = {}
      res.data.forEach(p => {
        if (p.question) map[p.question.id] = p.status
      })
      setProgress(map)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSelectQuestion = (q) => {
    setSelected(q)
    setCode(STARTER_CODE[language])
    setResult(null)
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setCode(STARTER_CODE[lang])
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setResult(null)
    try {
      const res = await api.post('/api/questions/submit', {
        questionId: selected.id,
        language,
        sourceCode: code
      })
      console.log('Result:', res.data)
      setResult(res.data)
      fetchProgress()
    } catch (err) {
      console.log('Error:', err)
      setResult({ status: 'Error', message: 'Submission failed. Try again.', correct: false })
    } finally {
      setSubmitting(false)
    }
  }

  const getDifficultyColor = (d) => {
    if (d === 'Easy') return 'text-green-400'
    if (d === 'Medium') return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusIcon = (id) => {
    if (progress[id] === 'Solved') return <CheckCircle size={16} className="text-green-400" />
    if (progress[id] === 'Attempted') return <Clock size={16} className="text-yellow-400" />
    return null
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Problem List */}
      {!selected && (
        <div className="w-full p-8">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-white">DSA Problems</h2>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {TOPICS.map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  className={`px-3 py-1 rounded-full text-sm transition ${topic === t ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {DIFFICULTIES.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`px-3 py-1 rounded-full text-sm transition ${difficulty === d ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Problem List */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Status</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Title</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Topic</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Difficulty</th>
                  <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Companies</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} onClick={() => handleSelectQuestion(q)}
                    className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition">
                    <td className="px-6 py-4">{getStatusIcon(q.id)}</td>
                    <td className="px-6 py-4 text-white text-sm font-medium">{q.title}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{q.topic}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${getDifficultyColor(q.difficulty)}`}>{q.difficulty}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{q.companyTags}</td>
                  </tr>
                ))}
                {questions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No problems found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Problem Solver */}
      {selected && (
        <div className="w-full flex h-screen">
          {/* Left Panel - Problem */}
          <div className="w-2/5 bg-gray-900 border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white transition">
                <ChevronLeft size={20} />
              </button>
              <span className="text-white font-semibold text-sm">{selected.title}</span>
              <span className={`text-xs font-medium ml-auto ${getDifficultyColor(selected.difficulty)}`}>
                {selected.difficulty}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Description</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{selected.description}</p>
              </div>

              {selected.sampleInput && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Sample Input</h3>
                  <pre className="bg-gray-800 rounded-lg p-3 text-green-400 text-sm">{selected.sampleInput}</pre>
                </div>
              )}

              {selected.expectedOutput && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Expected Output</h3>
                  <pre className="bg-gray-800 rounded-lg p-3 text-blue-400 text-sm">{selected.expectedOutput}</pre>
                </div>
              )}

              {selected.constraints && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Constraints</h3>
                  <p className="text-gray-300 text-sm">{selected.constraints}</p>
                </div>
              )}

              {selected.hints && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Hints</h3>
                  <p className="text-gray-300 text-sm">{selected.hints}</p>
                </div>
              )}

              {selected.companyTags && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Companies</h3>
                  <div className="flex gap-2 flex-wrap">
                    {selected.companyTags.split(',').map(c => (
                      <span key={c} className="bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs px-2 py-1 rounded-full">
                        {c.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Editor */}
          <div className="flex-1 flex flex-col bg-gray-950">
            {/* Editor Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
              <div className="flex gap-2">
                {LANGUAGES.map(lang => (
                  <button key={lang} onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1 rounded text-sm transition ${language === lang ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                    {lang}
                  </button>
                ))}
              </div>
              <button onClick={handleSubmit} disabled={submitting}
                className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                <Play size={14} />
                {submitting ? 'Running...' : 'Submit'}
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={language === 'c++' ? 'cpp' : language}
                value={code}
                onChange={(val) => setCode(val)}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 16 }
                }}
              />
            </div>

            {/* Result Panel */}
            {result && (
              <div className="border-t border-gray-800 bg-gray-900">
                {/* Verdict Header */}
                <div className={`px-6 py-4 flex items-center justify-between border-b border-gray-800 ${result.correct ? 'bg-green-500/5' : 'bg-red-500/5'}`}>
                  <div className="flex items-center gap-3">
                    {result.correct
                      ? <CheckCircle size={20} className="text-green-400" />
                      : <XCircle size={20} className="text-red-400" />}
                    <span className={`text-lg font-bold ${result.correct ? 'text-green-400' : 'text-red-400'}`}>
                      {result.status}
                    </span>
                    <span className="text-gray-400 text-sm">{result.output}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Runtime: <span className="text-white">{result.runtime}</span></span>
                  </div>
                </div>

                {/* Test Cases */}
                {result.testResults && (
                  <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
                    {result.testResults.map((tc, i) => (
                      <div key={i} className={`rounded-lg border p-3 ${tc.passed ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {tc.passed
                              ? <CheckCircle size={14} className="text-green-400" />
                              : <XCircle size={14} className="text-red-400" />}
                            <span className="text-white text-xs font-medium">
                              Test Case {tc.testCase} {i > 0 ? '(Hidden)' : ''}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">{tc.time}</span>
                        </div>
                        {i === 0 && (
                          <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                            <div>
                              <p className="text-gray-500 mb-1">Input</p>
                              <pre className="bg-gray-800 rounded px-2 py-1 text-gray-300">{tc.input}</pre>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Expected</p>
                              <pre className="bg-gray-800 rounded px-2 py-1 text-blue-300">{tc.expected}</pre>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Your Output</p>
                              <pre className={`bg-gray-800 rounded px-2 py-1 ${tc.passed ? 'text-green-300' : 'text-red-300'}`}>{tc.actual}</pre>
                            </div>
                          </div>
                        )}
                        {i > 0 && !tc.passed && (
                          <p className="text-red-400 text-xs mt-1">Wrong Answer on hidden test case</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}