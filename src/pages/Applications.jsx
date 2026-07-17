import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import api from '../api/axios'

const STATUSES = ['Applied', 'Online Test', 'Interview', 'Offer', 'Rejected']

const STATUS_COLORS = {
  'Applied': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Online Test': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Interview': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Offer': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Rejected': 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function Applications() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    companyName: '', role: '', status: 'Applied', notes: '', appliedDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await api.get('/api/applications')
      setApplications(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async () => {
    if (!form.companyName || !form.role) return
    try {
      if (editingId) {
        await api.put(`/api/applications/${editingId}`, form)
      } else {
        await api.post('/api/applications', form)
      }
      fetchApplications()
      resetForm()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/applications/${id}`)
      fetchApplications()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (app) => {
    setEditingId(app.id)
    setForm({
      companyName: app.companyName,
      role: app.role,
      status: app.status,
      notes: app.notes || '',
      appliedDate: app.appliedDate
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setForm({ companyName: '', role: '', status: 'Applied', notes: '', appliedDate: new Date().toISOString().split('T')[0] })
    setEditingId(null)
    setShowForm(false)
  }

  const grouped = STATUSES.reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Applications</h2>
            <p className="text-gray-400 text-sm mt-1">{applications.length} total applications</p>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} />
          Add Application
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">{editingId ? 'Edit Application' : 'New Application'}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Company Name *</label>
              <input value={form.companyName}
                onChange={e => setForm({ ...form, companyName: e.target.value })}
                placeholder="TCS, Infosys, Amazon..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Role *</label>
              <input value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                placeholder="Software Engineer, SDE..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Status</label>
              <select value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Applied Date</label>
              <input type="date" value={form.appliedDate}
                onChange={e => setForm({ ...form, appliedDate: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-1 block">Notes</label>
            <input value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Any notes about this application..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-violet-500" />
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

      {/* Pipeline View */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {STATUSES.map(status => (
          <div key={status} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{status}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}>
                {grouped[status].length}
              </span>
            </div>
            <div className="space-y-2">
              {grouped[status].map(app => (
                <div key={app.id} className="bg-gray-800 rounded-lg p-3">
                  <p className="text-white text-xs font-medium">{app.companyName}</p>
                  <p className="text-gray-400 text-xs">{app.role}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Company</th>
              <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Role</th>
              <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Status</th>
              <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Applied Date</th>
              <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Notes</th>
              <th className="text-left text-gray-400 text-sm px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                <td className="px-6 py-4 text-white text-sm font-medium">{app.companyName}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{app.role}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[app.status]}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">{app.appliedDate}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{app.notes || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(app)}
                      className="text-gray-400 hover:text-violet-400 transition">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(app.id)}
                      className="text-gray-400 hover:text-red-400 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No applications yet. Add your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}