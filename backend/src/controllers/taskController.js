import Task from "../models/Task.js";
import { Parser } from "json2csv";

// Helper function to build filter object
const buildTaskFilter = (query, userId) => {
  const filter = { user: userId };

  // STATUS
  if (query.status) {
    filter.status = query.status;
  }

  // PRIORITY
  if (query.priority) {
    filter.priority = query.priority;
  }

  // SEARCH
  if (query.search) {
    filter.title = { $regex: query.search, $options: 'i' };
  }

  // OVERDUE (only tasks with dueDate)
  if (query.overdue === 'true') {
    filter.dueDate = {
      $exists: true,
      $ne: null,
      $lt: new Date(),
    };
    return filter;
  }

  // DATE RANGE FILTERS
  if (query.dueAfter || query.dueBefore || query.dueFrom || query.dueTo) {
    filter.dueDate = {
      $exists: true,
      $ne: null,
    };

    if (query.dueAfter || query.dueFrom) {
      filter.dueDate.$gte = new Date(query.dueAfter || query.dueFrom);
    }

    if (query.dueBefore || query.dueTo) {
      filter.dueDate.$lte = new Date(query.dueBefore || query.dueTo);
    }
  }

  return filter;
};

// SORTING
const buildTaskSort = (query) => {
  if (query.sortBy) {
    return {
      [query.sortBy]: query.order === 'asc' ? 1 : -1,
    };
  }
  return { createdAt: -1 };
};

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TASKS
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const filter = buildTaskFilter(req.query, userId);
    const sort = buildTaskSort(req.query);

    const tasks = await Task.find(filter).sort(sort);

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE TASK
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, req.body);

    if (req.body.dueDate === "") {
      task.dueDate = undefined;
    } else if (req.body.dueDate) {
      task.dueDate = new Date(req.body.dueDate);
    }

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHANGE TASK STATUS
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EXPORT CSV
export const exportTasksCSV = async (req, res) => {
  try {
    const userId = req.user.id;
    const filter = buildTaskFilter(req.query, userId);

    const tasks = await Task.find(filter).select('-__v -_id');

    if (!tasks.length) {
      return res.status(404).json({ message: 'No tasks found to export' });
    }

    // CSV fields
    const fields = [
      { label: 'Title', value: 'title' },
      { label: 'Description', value: 'description' },
      { label: 'Priority', value: 'priority' },
      { label: 'Status', value: 'status' },
      { label: 'Due Date', value: 'dueDate' },
      { label: 'Created At', value: 'createdAt' },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(tasks);

    res.header('Content-Type', 'text/csv');
    res.header(
      'Content-Disposition',
      'attachment; filename=quicktask_tasks.csv'
    );

    return res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};