import React, { useState, useEffect, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import TaskModal from '../components/TaskModal'
import ConfirmModal from '../components/ConfirmModal'
import * as api from '../utils/api'

const COLUMNS = [
  { key: 'pending', label: 'Pending', dot: 'pending' },
  { key: 'in progress', label: 'In Progress', dot: 'in-progress' },
  { key: 'completed', label: 'Completed', dot: 'completed' },
]

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [pRes, tRes] = await Promise.all([api.getProject(id), api.getTasks(id)])
      setProject(pRes.data.data)
      setTasks(tRes.data.data)
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 404) navigate('/dashboard')
      else setError('Failed to load data')
    } finally { setLoading(false) }
  }, [id, navigate])

  useEffect(() => { fetchData() }, [fetchData])

  const handleCreate = async (form) => {
    setSaving(true)
    try { await api.createTask(id, form); await fetchData(); setTaskModalOpen(false) }
    catch (err) { setError(err.response?.data?.message || 'Failed to create task') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    try { await api.updateTask(editTask._id, form); await fetchData(); setTaskModalOpen(false); setEditTask(null) }
    catch (err) { setError(err.response?.data?.message || 'Failed to update task') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await api.deleteTask(confirmDelete); await fetchData(); setConfirmDelete(null) }
    catch (err) { setError(err.response?.data?.message || 'Failed to delete task') }
    finally { setDeleting(false) }
  }

  const byStatus = (s) => tasks.filter((t) => t.status === s)
  const isOverdue = (t) => t.dueDate && t.status !== 'completed' && new Date(t.dueDate) < new Date()

  if (loading) return <div className="app-layout"><Navbar /><div className="main-container" style={{ textAlign: 'center', paddingTop: 80 }}><div className="spinner" style={{ margin: '0 auto' }} /></div></div>

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-container">
        <div className="breadcrumb">
          <Link to="/dashboard">Dashboard</Link>
          <span className="breadcrumb-sep">›</span>
          <span>{project?.title}</span>
        </div>

        <div className="page-header">
          <div className="page-header-text">
            <h2>{project?.title}</h2>
            {project?.description && <p>{project.description}</p>}
          </div>
          <button className="btn btn-primary" onClick={() => { setEditTask(null); setTaskModalOpen(true) }}>+ New Task</button>
        </div>

        <div className="stats-bar">
          <div className="stat-card"><div className="stat-value">{tasks.length}</div><div className="stat-label">Total</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--yellow)' }}>{byStatus('pending').length}</div><div className="stat-label">Pending</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--blue)' }}>{byStatus('in progress').length}</div><div className="stat-label">In Progress</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: 'var(--green)' }}>{byStatus('completed').length}</div><div className="stat-label">Completed</div></div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No tasks yet</h3>
            <p>Add your first task to this project</p>
            <button className="btn btn-primary" onClick={() => { setEditTask(null); setTaskModalOpen(true) }}>+ Add Task</button>
          </div>
        ) : (
          <div className="task-board">
            {COLUMNS.map((col) => (
              <div key={col.key} className="task-column">
                <div className="task-column-header">
                  <div className="task-column-title">
                    <span className={`status-dot ${col.dot}`} />
                    {col.label}
                  </div>
                  <span className="task-column-count">{byStatus(col.key).length}</span>
                </div>

                {byStatus(col.key).length === 0 && (
                  <div style={{ color: 'var(--text3)', fontSize: 13, textAlign: 'center', paddingTop: 24 }}>No tasks</div>
                )}

                {byStatus(col.key).map((task) => (
                  <div key={task._id} className="task-card">
                    <h4>{task.title}</h4>
                    {task.description && <p>{task.description.length > 80 ? task.description.slice(0, 80) + '...' : task.description}</p>}
                    <div className="task-card-footer">
                      <span className={`task-due ${isOverdue(task) ? 'overdue' : ''}`}>
                        {task.dueDate ? `📅 ${new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                      </span>
                      <div className="task-actions">
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { setEditTask(task); setTaskModalOpen(true) }}>✏️</button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => setConfirmDelete(task._id)}>🗑</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskModal isOpen={taskModalOpen} onClose={() => { setTaskModalOpen(false); setEditTask(null) }} onSubmit={editTask ? handleUpdate : handleCreate} initialData={editTask} loading={saving} />
      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleting} title="Delete Task" message="Are you sure you want to delete this task?" />
    </div>
  )
}
export default ProjectDetail
