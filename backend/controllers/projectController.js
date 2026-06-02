const Project = require('../models/Project');
const Task = require('../models/Task');

const createProject = async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    const project = await Project.create({ title, description, owner: req.user._id });
    res.status(201).json({ success: true, message: 'Project created', data: project });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, data: project });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const updateProject = async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    project = await Project.findByIdAndUpdate(req.params.id, { title, description }, { new: true });
    res.json({ success: true, message: 'Project updated', data: project });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await Task.deleteMany({ project: req.params.id });
    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };
