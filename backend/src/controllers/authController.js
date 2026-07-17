const UserModels = require("../models/authModels");
const bcrypt = require("bcrypt");

// Create User
const createUser = async (req, res) => {
    const { body } = req;

    if (!body.name || !body.email || !body.password) {
        return res.status(400).json({
            "message": "field must be filled"
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

const login = async (req, res) => { };

module.exports = {
    createUser,
    login
};