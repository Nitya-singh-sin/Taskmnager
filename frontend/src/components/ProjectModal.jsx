import React, { useState, useEffect } from 'react'

const ProjectModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [form, setForm] = useState({ title: '', description: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    setForm({ title: initialData?.title || '', description: initialData?.description || '' })
    setError('')
  }, [initialData, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    setError('')
    await onSubmit(form)
  }

  if (!isOpen) return null
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{initialData ? 'Edit Project' : 'New Project'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project name" autoFocus />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What is this project about?" />
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
export default ProjectModal
