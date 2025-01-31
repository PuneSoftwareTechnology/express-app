import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createBlogController,
  fetchBlogsController,
  fetchOneBlogController,
  updateBlogController,
} from "../controllers/blog.controllers.js";

const blogRouter = Router();

blogRouter.post("/create", authenticate, createBlogController);
blogRouter.get("/all", fetchBlogsController);
blogRouter.patch("/update", authenticate, updateBlogController);
blogRouter.get("/", fetchOneBlogController);

export default blogRouter;
