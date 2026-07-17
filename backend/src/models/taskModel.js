const dbPool = require("../config/database");

const createTask = (taskData) => {
    const sqlQuery = "INSERT INTO tasks_table (title, description, status, deadline, user_id) VALUES (?, ?, ?, ?, ?)";
    const values = [taskData.title, taskData.description, taskData.status, taskData.deadline, taskData.userId];

    return dbPool.execute(sqlQuery, values);
};

const getAllTasks = (userId, status) => {
    let sqlQuery = "SELECT * FROM tasks_table WHERE user_id = ?";
    const values = [userId];

    if (status) {
        sqlQuery += " AND status = ?";
        values.push(status);
    }

    return dbPool.execute(sqlQuery, values);
};

const getTasksByUserId = (userId, taskId) => {
    const sqlQuery = "SELECT * FROM tasks_table WHERE user_id = ? AND id = ?";
    const values = [userId, taskId];

    return dbPool.execute(sqlQuery, values);
};

const updateTask = (taskId, taskData, userId) => {
    const sqlQuery = "UPDATE tasks_table SET title = ?, description = ?, status = ?, deadline = ? WHERE id = ? AND user_id = ?";
    const values = [taskData.title, taskData.description, taskData.status, taskData.deadline, taskId, userId];

    return dbPool.execute(sqlQuery, values);
};

const deleteTask = (taskId, userId) => {
    const sqlQuery = "DELETE FROM tasks_table WHERE id = ? AND user_id = ?";

    return dbPool.execute(sqlQuery, [taskId, userId]);
};

module.exports = {
    createTask,
    getAllTasks,
    getTasksByUserId,
    updateTask,
    deleteTask
};