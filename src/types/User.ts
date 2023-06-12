import db from '../database/mariadb';

class User {
    id: number;
    email: string;
    password: string;

    constructor(id: number | null, email: string, password: string) {
        this.id = id;
        this.email = email;
        this.password = password;
    }

    async save() {
        try {
            await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [this.email, this.password]);

            if (this.id == null) {
                const rows = await db.query('SELECT id FROM users WHERE email = ?', [this.email])
                this.id = rows[0].id;
            }
        } catch (err) {
            throw err;
        }
    }

    async updateEmail(email: string) {
        try {
            await db.query('UPDATE users SET email = ? WHERE id = ?', [email, this.id]);
            this.email = email;
        } catch (err) {
            throw err;
        }
    }

    async updatePassword(password: string) {
        try {
            await db.query('UPDATE users SET password = ? WHERE id = ?', [password, this.id]);
            this.password = password;
        } catch (err) {
            throw err;
        }
    }

    static async findByEmail(email: string) {
        const rows = await db.query('SELECT * FROM users WHERE email = ?', [email])
        
        if (rows.length == 1)
            return new User(rows[0].id, rows[0].email, rows[0].password);
        else
            return null;
    }

    static async findById(id: number) {
        const rows = await db.query('SELECT * FROM users WHERE id = ?', [id])
        
        if (rows.length == 1)
            return new User(rows[0].id, rows[0].email, rows[0].password);
        else
            return null;
    }

    static async findAll() {
        return await db.query('SELECT * FROM users');
    }
}

export default User;