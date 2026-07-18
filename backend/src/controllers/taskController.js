const taskModel = require("../models/taskModel");

// Fetch Task
const getTasks = async (req, res) => {
    const userId = req.user.id;
    const { status } = req.query;

    try {
        const [tasks] = await taskModel.getAllTasks(userId, status);
        res.status(200).json({
            "message": "Tasks fetched successfully",
            "data": tasks
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({
            "message": "Error fetching tasks"
        });
    }
}

// Create Task
const createTask = async (req, res) => {
    const userId = req.user.id;
    const { body } = req;

    if (!body.title || !body.description || !body.status) {
        return res.status(400).json({
            "message": "All fields are required"
        });
    } else {
        try {
            const [data] = await taskModel.createTask({
                title: body.title,
                description: body.description,
                status: body.status || "pending",
                deadline: body.deadline || null,
                userId: userId
            });

            res.status(201).json({
                "message": "Task Created",
                "Id": data.insertId,
                "data": {
                    "title": body.title,
                    "description": body.description,
                    "status": body.status,
                    "deadline": body.deadline
                }
            });

        } catch (error) {
            console.error("Error creating task:", error);
            res.status(500).json({
                "message": "Internal server error"
            });
        }
    }
}

const updateTask = async (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.id;
    const { body } = req;

    if (!body.title || !body.status) {
        return res.status(400).json({ message: "Title and status are required" });
    }
    try {
        const [existingTask] = await taskModel.getTasksByUserId(userId, taskId);
        if (existingTask.length === 0) {
            return res.status(404).json({
                message: "Task not found or unauthorized"
            });
        }

        await taskModel.updateTask(taskId, {
            title: body.title,
            description: body.description,
            status: body.status,
            deadline: body.deadline
        }, userId);

        res.status(200).json({
            message: "Task updated successfully",
            data: {
                id: taskId,
                title: body.title,
                description: body.description,
                status: body.status,
                deadline: body.deadline
            }
        });

    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteTask = async (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.id;

    try {
        const [existingTask] = await taskModel.getTasksByUserId(userId, taskId);
        if (existingTask.length === 0) {
            return res.status(404).json({
                "message": "Task not found or unauthorized"
            });
        }
        
        await taskModel.deleteTask(taskId, userId);
        
        return res.status(200).json({
            "message": "Task deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
}