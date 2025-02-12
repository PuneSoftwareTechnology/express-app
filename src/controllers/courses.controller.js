import {
  saveCourseService,
  getCoursesService,
  deleteCourseService,
  updateCourseService,
  saveCourseSyllabusService,
  getCourseSyllabusService,
  deleteCourseSyllabusService,
  updateCourseSyllabusService,
  getCourseNamesService,
} from "../Services/courses.services.js";
import { handleResponse } from "../utils/helperFunctions.js";

export const createCourseController = (req, res) =>
  handleResponse(saveCourseService, req, res);

export const getCoursesController = (req, res) =>
  handleResponse(getCoursesService, req, res);

export const deleteCourseController = (req, res) =>
  handleResponse(deleteCourseService, req, res);

export const updateCourseController = (req, res) =>
  handleResponse(updateCourseService, req, res);

export const createCourseSyllabusController = (req, res) =>
  handleResponse(saveCourseSyllabusService, req, res);

export const getCourseSyllabusController = (req, res) =>
  handleResponse(getCourseSyllabusService, req, res);

export const deleteCourseSyllabusController = (req, res) =>
  handleResponse(deleteCourseSyllabusService, req, res);

export const updateCourseSyllabusController = (req, res) =>
  handleResponse(updateCourseSyllabusService, req, res);

export const getCourseNamesController = (req, res) =>
  handleResponse(getCourseNamesService, req, res);
