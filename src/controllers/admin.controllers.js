import {
  createAdminUserService,
  loginAdminUserService,
} from "../Services/admin.services.js";

export const createAdminUser = async (req, res) => {
  try {
    const result = await createAdminUserService(req.body);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error in creating User:", error);
    res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};

export const loginAdminUser = async (req, res) => {
  try {
    const result = await loginAdminUserService(req.body);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Error in loggin in :", error);
    res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
};
