import express from "express";
import {
  createCourseController,
  getCoursesController,
  deleteCourseController,
  updateCourseController,
  getCourseSyllabusController,
  createCourseSyllabusController,
  deleteCourseSyllabusController,
  updateCourseSyllabusController,
} from "../controllers/courses.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const CourseRouter = express.Router();

CourseRouter.post("/create", authenticate, createCourseController);
CourseRouter.get("/all", getCoursesController);
CourseRouter.patch("/delete", authenticate, deleteCourseController);
CourseRouter.patch("/update", authenticate, updateCourseController);
//syllabus
CourseRouter.post(
  "/syllabus/create",
  authenticate,
  createCourseSyllabusController
);
CourseRouter.get("/syllabus/:course_id", getCourseSyllabusController);
CourseRouter.patch(
  "/syllabus/delete",
  authenticate,
  deleteCourseSyllabusController
);
CourseRouter.patch(
  "/syllabus/update",
  authenticate,
  updateCourseSyllabusController
);

export default CourseRouter;
