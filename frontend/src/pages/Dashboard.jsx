import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProjectModal from '../components/ProjectModal'
import ConfirmModal from '../components/ConfirmModal'
import * as api from '../utils/api'

const Dashboard = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.getProjects()
      setProjects(res.data.data)
    } catch { setError('Failed to load projects') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const handleCreate = async (form) => {
    setSaving(true)
    try { await api.createProject(form); await fetchProjects(); setModalOpen(false) }
    catch (err) { setError(err.response?.data?.message || 'Failed to create') }
    finally { setSaving(false) }
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    try { await api.updateProject(editProject._id, form); await fetchProjects(); setModalOpen(false); setEditProject(null) }
    catch (err) { setError(err.response?.data?.message || 'Failed to update') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await api.deleteProject(confirmDelete); await fetchProjects(); setConfirmDelete(null) }
    catch (err) { setError(err.response?.data?.message || 'Failed to delete') }
    finally { setDeleting(false) }
  }

  const openEdit = (e, project) => { e.preventDefault(); e.stopPropagation(); setEditProject(project); setModalOpen(true) }
  const openDelete = (e, id) => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(id) }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-container">
        <div className="page-header">
          <div className="page-header-text">
            <h2>My Projects</h2>
            <p>Manage all your projects in one place</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditProject(null); setModalOpen(true) }}>+ New Project</button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}

        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-value">{projects.length}</div>
            <div className="stat-label">Total Projects</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 64 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <h3>No projects yet</h3>
            <p>Create your first project to get started</p>
            <button className="btn btn-primary" onClick={() => { setEditProject(null); setModalOpen(true) }}>+ Create Project</button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <Link to={`/projects/${project._id}`} key={project._id} className="project-card">
                <div className="project-card-accent" />
                <h3>{project.title}</h3>
                <p>{project.description || 'No description'}</p>
                <div className="project-card-footer">
                  <span className="project-card-meta">{new Date(project.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <div className="project-card-actions">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => openEdit(e, project)}>✏️</button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={(e) => openDelete(e, project._id)}>🗑</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <ProjectModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditProject(null) }} onSubmit={editProject ? handleUpdate : handleCreate} initialData={editProject} loading={saving} />
      <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleting} title="Delete Project" message="All tasks in this project will also be deleted permanently." />
    </div>
  )
}
export default Dashboard
