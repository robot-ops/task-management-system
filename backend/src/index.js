const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();
// Port configuration
const PORT = process.env.PORT;

// Initialize Express app
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});