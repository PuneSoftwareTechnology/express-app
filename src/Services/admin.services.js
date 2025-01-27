import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findAll, insert } from "../database/dbConnection.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const createAdminUserService = async ({ username, password }) => {
  try {
    if (!username || !password) {
      return {
        status: 400,
        data: {
          success: false,
          message: "Username and password are required.",
        },
      };
    }

    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      username,
      password: encryptedPassword,
    };
    await insert("admin_users", newUser);

    return {
      status: 200,
      data: {
        success: true,
        message: "User has been created successfully.",
        user: {
          id: newUser.id,
          username: newUser.username,
        },
      },
    };
  } catch (error) {
    console.error("Error in createAdminUser:", error);
    return {
      status: 500,
      data: {
        success: false,
        error: "An internal server error occurred. Please try again later.",
      },
    };
  }
};

// Login Admin User Service
export const loginAdminUserService = async ({ username, password }) => {
  try {
    if (!username || !password) {
      return {
        status: 400,
        data: {
          success: false,
          message: "Username and password are required.",
        },
      };
    }

    // Fetch user from the database
    const users = await findAll("admin_users", "username = ?", [username]);

    if (!users || users.length === 0) {
      return {
        status: 401,
        data: {
          success: false,
          message: "Invalid username or password.",
        },
      };
    }

    const user = users[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        status: 401,
        data: {
          success: false,
          message: "Invalid username or password.",
        },
      };
    }

    // Generate JWT token with 1-month expiry
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "30d" } // Set expiry to 30 days (1 month)
    );

    return {
      status: 200,
      data: {
        success: true,
        message: "Login successful.",
        user: {
          id: user.id,
          username: user.username,
        },
        token, // Include the token in the response
      },
    };
  } catch (error) {
    console.error("Error in loginAdminUser:", error);
    return {
      status: 500,
      data: {
        success: false,
        error: "An internal server error occurred. Please try again later.",
      },
    };
  }
};
