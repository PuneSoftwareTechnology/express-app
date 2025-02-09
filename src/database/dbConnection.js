import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_ENDPOINT,
  user: process.env.DB_USER,
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_SCHEMA,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

export async function connectToDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log("Database connection established successfully");
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
}

// Insert a single record
export async function insert(table, data) {
  let connection;
  try {
    connection = await pool.getConnection();
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
  } finally {
    if (connection) connection.release();
  }
}

// Execute a raw query
export async function executeRawQuery(query, params = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    console.error("Error executing raw query:", error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Bulk insert
export async function bulkInsert(table, data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Data for bulk insert must be a non-empty array");
  }

  let connection;
  try {
    connection = await pool.getConnection();
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
  } finally {
    if (connection) connection.release();
  }
}

// Update SQL
export async function updateSql(table, data, whereClause, whereParams = []) {
  let connection;
  try {
    connection = await pool.getConnection();
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
  } finally {
    if (connection) connection.release();
  }
}

// Find all records
export async function findAll(table, whereClause, whereParams = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `SELECT * FROM \`${table}\` WHERE ${whereClause}`;
    const [rows] = await connection.execute(query, whereParams);
    return rows.length > 0 ? rows : []; // Return all matching rows
  } catch (error) {
    console.error("Error during find all:", error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}
