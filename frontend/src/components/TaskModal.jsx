import React, { useState, useEffect } from 'react'

const TaskModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [form, setForm] = useState({ title: '', description: '', status: 'pending', dueDate: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    setForm({
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'pending',
      dueDate: initialData?.dueDate ? initialData.dueDate.split('T')[0] : '',
    })
    setError('')
  }, [initialData, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    setError('')
    await onSubmit({ ...form, dueDate: form.dueDate || null })
  }

  if (!isOpen) return null
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{initialData ? 'Edit Task' : 'New Task'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task name" autoFocus />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the task..." />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Due Date (optional)</label>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : initialData ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default TaskModal
