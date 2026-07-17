const dbPool = require("../config/database");

const getUserByEmail = async(userEmail) => {
    const sqlQuery = "SELECT * FROM users_table WHERE email = ?";
    return dbPool.execute(sqlQuery, [userEmail]);
};

// Create User
const createUser = async(userData) => {
    const sqlQuery = 'INSERT INTO users_table (name, email, password) VALUES (?, ?, ?)';
    const values = [userData.name, userData.email, userData.password];

    return dbPool.execute(sqlQuery, values);
};

module.exports = {
    getUserByEmail,
    createUser,
};