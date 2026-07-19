import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, Trash2, Edit2, Check, X, ExternalLink, FileText } from 'lucide-react'
import api from '../api/axios'

export default function Resumes() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    versionName: '',
    fileLink: '',
    companySentTo: '',
    uploadDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const res = await api.get('/api/resumes')
      setResumes(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async () => {
    if (!form.versionName || !form.fileLink) return
    try {
      if (editingId) {
        await api.put(`/api/resumes/${editingId}`, form)
      } else {
        await api.post('/api/resumes', form)
      }
      fetchResumes()
      resetForm()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/resumes/${id}`)
      fetchResumes()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (resume) => {
    setEditingId(resume.id)
    setForm({
      versionName: resume.versionName,
      fileLink: resume.fileLink,
      companySentTo: resume.companySentTo || '',
      uploadDate: resume.uploadDate
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setForm({ versionName: '', fileLink: '', companySentTo: '', uploadDate: new Date().toISOString().split('T')[0] })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Resume Manager</h2>
            <p className="text-gray-400 text-sm mt-1">{resumes.length} resume versions saved</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} />
          Add Resume
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">{editingId ? 'Edit Resume' : 'Add Resume Version'}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Version Name *</label>
              <input value={form.versionName}
                onChange={e => setForm({ ...form, versionName: e.target.value })}
                placeholder="TCS_SDE_Resume_v1"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Company Sent To</label>
              <input value={form.companySentTo}
                onChange={e => setForm({ ...form, companySentTo: e.target.value })}
                placeholder="TCS, Infosys, Amazon..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div className="col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">File Link * (Google Drive or any URL)</label>
              <input value={form.fileLink}
                onChange={e => setForm({ ...form, fileLink: e.target.value })}
                placeholder="https://drive.google.com/..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Upload Date</label>
              <input type="date" value={form.uploadDate}
                onChange={e => setForm({ ...form, uploadDate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSubmit}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm transition">
              <Check size={14} />
              {editingId ? 'Update' : 'Save'}
            </button>
            <button onClick={resetForm}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-400 px-4 py-2 rounded-lg text-sm transition">
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Resume Cards */}
      {resumes.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <FileText size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No resumes saved yet.</p>
          <p className="text-gray-500 text-sm mt-1">Add your first resume version to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {resumes.map(resume => (
            <div key={resume.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-violet-500/30 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-violet-500/10 p-2 rounded-lg">
                    <FileText size={18} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{resume.versionName}</p>
                    <p className="text-gray-500 text-xs">{resume.uploadDate}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(resume)}
                    className="text-gray-400 hover:text-violet-400 transition">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(resume.id)}
                    className="text-gray-400 hover:text-red-400 transition">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {resume.companySentTo && (
                <div className="mb-3">
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                    Sent to: {resume.companySentTo}
                  </span>
                </div>
              )}

              <a href={resume.fileLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm transition">
                <ExternalLink size={14} />
                Open Resume
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}