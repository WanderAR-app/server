import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
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