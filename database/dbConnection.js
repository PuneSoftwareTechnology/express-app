import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_ENDPOINT,
  user: process.env.DB_USER,
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_SCHEMA,
  password: process.env.DB_PASSWORD,
};

let connection;

export async function connectToDatabase() {
  if (!connection) {
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log("Database connection established successfully");
    } catch (error) {
      console.error("Error connecting to the database:", error.message);
      throw error;
    }
  }
  return connection;
}

// Insert a single record
export async function insert(table, data) {
  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(
      `INSERT INTO \`${table}\` (${Object.keys(data).join(
        ", "
      )}) VALUES (${Object.keys(data)
        .map(() => "?")
        .join(", ")})`,
      Object.values(data)
    );
    return result;
  } catch (error) {
    console.error("Error inserting data:", error.message);
    throw error;
  }
}

// Execute a raw query
export async function executeRawQuery(query, params = []) {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error executing raw query:", error.message);
    throw error;
  }
}

// Bulk insert
export async function bulkInsert(table, data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Data for bulk insert must be a non-empty array");
  }

  try {
    const connection = await connectToDatabase();
    const keys = Object.keys(data[0]);
    const values = data.map((row) => keys.map((key) => row[key]));
    const placeholders = data
      .map(() => `(${keys.map(() => "?").join(", ")})`)
      .join(", ");

    const query = `INSERT INTO \`${table}\` (${keys.join(
      ", "
    )}) VALUES ${placeholders}`;
    const [result] = await connection.execute(query, values.flat());
    return result;
  } catch (error) {
    console.error("Error during bulk insert:", error.message);
    throw error;
  }
}

// Update SQL
export async function updateSql(table, data, whereClause, whereParams = []) {
  try {
    const connection = await connectToDatabase();
    const setClause = Object.keys(data)
      .map((key) => `\`${key}\` = ?`)
      .join(", ");
    const query = `UPDATE \`${table}\` SET ${setClause} WHERE ${whereClause}`;
    const [result] = await connection.execute(query, [
      ...Object.values(data),
      ...whereParams,
    ]);
    return result;
  } catch (error) {
    console.error("Error during update:", error.message);
    throw error;
  }
}

// Find all records
export async function findAll(table, whereClause, whereParams = []) {
  try {
    const connection = await connectToDatabase();
    const query = `SELECT * FROM \`${table}\` WHERE ${whereClause}`;
    const [rows] = await connection.execute(query, whereParams);
    return rows.length > 0 ? rows : []; // Return all matching rows
  } catch (error) {
    console.error("Error during find all:", error.message);
    throw error;
  }
}
