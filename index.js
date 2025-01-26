import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import demoRequestRoutes from "./routes/demo.routes.js";
import { connectToDatabase } from "./database/dbConnection.js";
import adminRouter from "./routes/admin.routes.js";

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
