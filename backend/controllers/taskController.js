const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  try {
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    const task = await Task.create({ title, description, status: status || 'pending', dueDate: dueDate || null, project: req.params.projectId, owner: req.user._id });
    res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (project.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    const tasks = await Task.find({ project: req.params.projectId }).sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, data: task });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const updateTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  try {
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    task = await Task.findByIdAndUpdate(req.params.id, { title, description, status, dueDate: dueDate || null }, { new: true, runValidators: true });
    res.json({ success: true, message: 'Task updated', data: task });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (task.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
