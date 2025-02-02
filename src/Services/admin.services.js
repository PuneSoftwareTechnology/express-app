import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAll, insert, updateSql } from "../database/dbConnection.js";
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
    if (users.length === 0) return sendError(404, "User not found.");

    const user = users[0];

    // Check if the user is deleted (you can adjust this condition based on your database schema)
    if (user?.deleted) {
      return sendError(404, "User not found.");
    }

    // Validate the password
    if (!(await bcrypt.compare(password, user.password))) {
      return sendError(401, "Invalid username or password.");
    }

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

export const deleteUserService = async ({ email }) => {
  try {
    const user = await findAll("admin_users", "email = ?", [email]);
    if (user.length === 0) {
      return sendError(404, "User not found.");
    }

    await updateSql("admin_users", { deleted: 1 }, "email = ?", [email]);

    return {
      status: 200,
      data: {
        success: true,
        message: "User marked as deleted successfully.",
      },
    };
  } catch (error) {
    console.error("Error in deleteUserService:", error);
    return sendError(500, "Internal server error.");
  }
};

export const updateUserService = async (payload) => {
  try {
    const { email, password, ...data } = payload;

    const user = await findAll("admin_users", "email = ?", [email]);
    if (user.length === 0) {
      return sendError(404, "User not found.");
    }

    if (!data || Object.keys(data).length === 0) {
      return sendError(400, "No fields to update.");
    }

    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      data.password = hashedPassword;
    }

    await updateSql("admin_users", data, "email = ?", [email]);

    return {
      status: 200,
      data: {
        success: true,
        message: "User updated successfully.",
      },
    };
  } catch (error) {
    console.error("Error in updateUserService:", error);
    return sendError(500, "Internal server error.");
  }
};
