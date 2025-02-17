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
  getCourseNamesController,
  getCourseCategoriesController,
} from "../controllers/courses.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const CourseRouter = express.Router();

CourseRouter.post("/create", authenticate, createCourseController);
CourseRouter.get("/all", getCoursesController);
CourseRouter.patch("/delete", authenticate, deleteCourseController);
CourseRouter.patch("/update", authenticate, updateCourseController);
CourseRouter.get("/all-course-names", getCourseNamesController);
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

CourseRouter.get("/categories", getCourseCategoriesController);

export default CourseRouter;
