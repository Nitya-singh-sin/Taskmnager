const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/:projectId').get(getTasks).post(createTask);
router.route('/task/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
