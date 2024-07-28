import pool from "../db";

class Match {
  static async createMatch(
    match_name,
    secret_key,
    description,
    match_url,
    id_user,
    id_game
  ) {
    const query =
      "INSERT INTO matchs (match_name, secret_key, description, match_url, id_user, id_game) VALUES (?, ?, ?, ?, ?, ? )";
    const [result] = await pool.execute(query, [
      match_name,
      secret_key,
      description,
      match_url,
      id_user,
      id_game,
    ]);
    return result.insertId;
  }

  static async findByUrl(matchUrl) {
    const query = "SELECT * FROM matchs WHERE match_url = ?";
    const [result] = await pool.execute(query, [matchUrl]);
    return result[0];
  }

  static async findAllMyMatches(id_user) {
    const query = "SELECT * FROM matchs WHERE id_user = ?";
    const [result] = await pool.execute(query, [id_user]);
    return result;
  }

  static async findById(id) {
    const query = "SELECT * FROM matchs WHERE id = ?";
    const [results] = await pool.execute(query, [id]);
    return results[0];
  }

  static async getPlayers(matchId) {
    const query = "SELECT * FROM players WHERE match_id = ? ORDER BY id DESC";
    const [results] = await pool.execute(query, [matchId]);
    return results;
  }

  static async getGame(id) {
    const query = "SELECT * FROM games WHERE id = ?";
    const [results] = await pool.execute(query, [id]);
    return results[0];
  }

  static async submitNickname(matchId, nickname) {
    const query = "INSERT INTO players (match_id, nickname) VALUES (?, ?)";
    await pool.execute(query, [matchId, nickname]);
    return true;
  }
}

export default Match;
