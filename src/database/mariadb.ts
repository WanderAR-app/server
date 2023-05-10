import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

class DB {

    async query(query: string, params?: any) {
        let conn : mariadb.PoolConnection | null = null;
        try {
            conn = await pool.getConnection();
            const rows = await conn.query(query, params);
            return rows;
        } catch (err) {
            throw err;
        } finally {
            if (conn) conn.end();
        }
    }
}

export default new DB();