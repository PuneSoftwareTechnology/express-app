import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import blogRoutes from './routes/blogRoutes.js';
// import testimonialRoutes from './routes/testimonialRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/blogs', blogRoutes);
// app.use('/testimonials', testimonialRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
