import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import demoRequestRoutes from "./src/routes/demo.routes.js";
import adminRouter from "./src/routes/admin.routes.js";
import testimonialRouter from "./src/routes/testimonial.route.js";
import { connectToDatabase } from "./src/database/dbConnection.js";
import faqRouter from "./src/routes/faq.route.js";
import blogRouter from "./src/routes/blog.routes.js";
import settingsRouter from "./src/routes/settings.route.js";
import companiesRouter from "./src/routes/companies.routes.js";
import ProjectRouter from "./src/routes/projects.route.js";
import JobRouter from "./src/routes/jobs.route.js";
import CourseRouter from "./src/routes/courses.route.js";
import serverless from "serverless-http";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Database connection
await connectToDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/demo", demoRequestRoutes);
app.use("/admin", adminRouter);
app.use("/testimonial", testimonialRouter);
app.use("/faq", faqRouter);
app.use("/blog", blogRouter);
app.use("/settings", settingsRouter);
app.use("/companies", companiesRouter);
app.use("/projects", ProjectRouter);
app.use("/jobs", JobRouter);
app.use("/courses", CourseRouter);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

// Lambda Handler
export const handler = serverless(app);

// Start the server locally (useful for testing)
if (process.env.NODE_ENV !== "lambda") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
