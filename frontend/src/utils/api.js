import { API } from '../context/AuthContext'

export const getProjects = () => API.get('/projects')
export const getProject = (id) => API.get(`/projects/${id}`)
export const createProject = (data) => API.post('/projects', data)
export const updateProject = (id, data) => API.put(`/projects/${id}`, data)
export const deleteProject = (id) => API.delete(`/projects/${id}`)

export const getTasks = (projectId) => API.get(`/tasks/${projectId}`)
export const createTask = (projectId, data) => API.post(`/tasks/${projectId}`, data)
export const updateTask = (id, data) => API.put(`/tasks/task/${id}`, data)
export const deleteTask = (id) => API.delete(`/tasks/task/${id}`)
