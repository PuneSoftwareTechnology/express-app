import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import demoRequestRoutes from "./src/routes/demo.routes.js";
import adminRouter from "./src/routes/admin.routes.js";
import { connectToDatabase } from "./src/database/dbConnection.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

await connectToDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/demo", demoRequestRoutes);
app.use("/admin", adminRouter);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
