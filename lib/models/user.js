// /server/models/User.js
import pool from "../db";
import { hash } from "bcrypt";

class User {
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    const [results] = await pool.execute(query, [email]); // Use execute() for prepared statements
    return results[0];
  }

  static async findById(id) {
    const query = "SELECT * FROM users WHERE id = ?";
    const [results] = await pool.execute(query, [id]);
    return results[0];
  }

  static async createUser(name, email, password) {
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const hashedPassword = await hash(password, 10);
    const [result] = await pool.execute(query, [name, email, hashedPassword]);
    return result.insertId;
  }

  static async fetchUsers() {
    const query = "SELECT * FROM users";
    const [results] = await pool.execute(query);
    return results;
  }

  static async deleteUser(userId) {
    const query = "DELETE FROM users WHERE id = ?";
    const [result] = await pool.execute(query, [userId]);
    return result.affectedRows;
  }

  static async updateUser(userId, userData) {
    const { name, password } = userData;
    const hashedPassword = await hash(password, 10);
    const query = "UPDATE users SET name = ?, password = ? WHERE id = ?";
    const [result] = await pool.execute(query, [name, hashedPassword, userId]);
    return result.affectedRows;
  }
}

export default User;
