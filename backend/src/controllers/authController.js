const UserModels = require("../models/authModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create User
const createUser = async (req, res) => {
    const { body } = req;

    if (!body.name || !body.email || !body.password) {
        return res.status(400).json({
            "message": "Field must be filled"
        });
    } else {
        try {
            const [email] = await UserModels.getUserByEmail(body.email);
            if (email.length > 0) {
                return res.status(409).json({
                    "message": "Email already exists."
                });
            } else {
                const hashedPassword = await bcrypt.hash(body.password, 10);
                body.password = hashedPassword;

                const [data] = await UserModels.createUser({ name: body.name, email: body.email, password: body.password });
                res.status(201).json({
                    "message": "User registered successfully",
                    "Id": data.insertId,
                    "data": {
                        "name": body.name,
                        "email": body.email
                    }
                });
            }
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({
                "message": "Internal server error"
            });
        }
    }
};

const login = async (req, res) => {
    const { body } = req;

    if (!body.email || !body.password) {
        return res.status(400).json({
            "message": "Field must be filled"
        });
    } else {
        try {
            const [user] = await UserModels.getUserByEmail(body.email);
            if (user.length === 0) {
                return res.status(404).json({
                    "message": "User not found"
                });
            } else {
                const isPasswordValid = await bcrypt.compare(body.password, user[0].password);
                if (!isPasswordValid) {
                    return res.status(401).json({
                        "message": "Invalid password"
                    });
                } else {
                    const payload = { 
                        id: user[0].id, 
                        email: user[0].email 
                    };

                    const token = jwt.sign(
                        payload, 
                        process.env.JWT_SECRET, 
                        { expiresIn: "1h" }
                    );
                    
                    res.status(200).json({
                        "message": "Login successful",
                        "token": token,
                        "data": {
                            "name": user[0].name,
                            "email": user[0].email
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error logging in user:", error);
            res.status(500).json({
                "message": "Internal server error"
            });
        }
    }
};

module.exports = {
    createUser,
    login
};