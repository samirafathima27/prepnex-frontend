import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Code, Briefcase, MessageSquare, FileText, Sparkles, LayoutDashboard } from 'lucide-react'
import api from '../api/axios'

export default function Dashboard() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name')
  const [stats, setStats] = useState({
    applications: 0,
    dsa: 0,
    interviews: 0,
    resumes: 0,
    solved: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [apps, dsa, interviews, resumes, solved] = await Promise.all([
        api.get('/api/applications'),
        api.get('/api/dsa'),
        api.get('/api/mockinterviews'),
        api.get('/api/resumes'),
        api.get('/api/questions/solved')
      ])
      setStats({
        applications: apps.data.length,
        dsa: dsa.data.length,
        interviews: interviews.data.length,
        resumes: resumes.data.length,
        solved: solved.data.length
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/login')
  }

  const cards = [
    { label: 'Problems Solved', value: stats.solved, icon: Code, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { label: 'Applications', value: stats.applications, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Mock Interviews', value: stats.interviews, icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { label: 'Resume Versions', value: stats.resumes, icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  ]

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'DSA Problems', icon: Code, path: '/dsa' },
    { label: 'Applications', icon: Briefcase, path: '/applications' },
    { label: 'Mock Interviews', icon: MessageSquare, path: '/interviews' },
    { label: 'Resumes', icon: FileText, path: '/resumes' },
    { label: 'AI Coach', icon: Sparkles, path: '/ai' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white">Prep<span className="text-violet-500">nex</span></h1>
          <p className="text-gray-400 text-sm mt-1">Welcome, {name}!</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition text-left"
            >
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 mt-1">Track your placement preparation progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {cards.map((card) => (
            <div key={card.label} className={`${card.bg} border ${card.border} rounded-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">{card.label}</span>
                <card.icon size={20} className={card.color} />
              </div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => navigate('/dsa')} className="bg-violet-600 hover:bg-violet-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition">
              Solve a Problem
            </button>
            <button onClick={() => navigate('/applications')} className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition">
              Add Application
            </button>
            <button onClick={() => navigate('/ai')} className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition">
              Get AI Suggestions
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}