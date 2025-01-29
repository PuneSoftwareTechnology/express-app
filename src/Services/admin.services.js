import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAll, insert } from "../database/dbConnection.js";
import { checkMissingFields, sendError } from "../utils/helperFunctions.js";

const JWT_SECRET = process.env.JWT_SECRET;
const validRoles = ["ADMIN", "SUPER_ADMIN"];

export const createAdminUserService = async (fields) => {
  try {
    const { username, password, email, role, name } = fields;
    const missingFieldsError = checkMissingFields(fields, [
      "username",
      "password",
      "email",
      "role",
      "name",
    ]);
    if (missingFieldsError) return missingFieldsError;

    if (!/^[a-zA-Z0-9._%+-]+@punesoftwaretechnologies\.com$/.test(email))
      return sendError(400, "Invalid email format.");

    if (!validRoles.includes(role))
      return sendError(400, `Invalid role. Allowed: ${validRoles.join(", ")}`);

    const existingUsers = await findAll(
      "admin_users",
      "username = ? OR email = ?",
      [username, email]
    );
    if (existingUsers.length > 0)
      return sendError(
        400,
        "User with the same username or email already exists."
      );

    const encryptedPassword = await bcrypt.hash(password, 10);
    await insert("admin_users", {
      username,
      password: encryptedPassword,
      email,
      role,
    });

    return {
      status: 200,
      data: { success: true, message: "User created successfully." },
    };
  } catch (error) {
    console.error("Error in createAdminUserService:", error);
    return sendError(500, "Internal server error.");
  }
};

// Login Admin User Service
export const loginAdminUserService = async ({ username, password }) => {
  try {
    if (!username || !password)
      return sendError(400, "Username and password are required.");

    const users = await findAll("admin_users", "username = ?", [username]);
    if (
      users.length === 0 ||
      !(await bcrypt.compare(password, users[0].password))
    )
      return sendError(401, "Invalid username or password.");

    const user = users[0];
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return {
      status: 200,
      data: {
        success: true,
        message: "Login successful.",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        token,
      },
    };
  } catch (error) {
    console.error("Error in loginAdminUserService:", error);
    return sendError(500, "Internal server error.");
  }
};

// Get All Users Service
export const getAllUsersService = async () => {
  try {
    const users = await findAll("admin_users", "deleted = ?", [false]);
    if (users.length === 0) return sendError(404, "No active users found.");

    return {
      status: 200,
      data: {
        success: true,
        message: "Users fetched successfully.",
        data: users.map(({ password, ...userData }) => userData),
      },
    };
  } catch (error) {
    console.error("Error in getAllUsersService:", error);
    return sendError(500, "Internal server error.");
  }
};
