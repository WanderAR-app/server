import { type } from 'os';
import db from '../database/mariadb';

type ConnectedWith = 'google' | 'email';

class User {
    id: number;
    email: string;
    password: string;
    connectedWith: ConnectedWith;

    constructor(id: number | null, email: string, password: string | null, connectedWith: ConnectedWith = 'email') {
        this.id = id;
        this.email = email;
        this.password = password;
        this.connectedWith = connectedWith;
    }

    async save() {
        try {
            await db.query('INSERT INTO users (email, password, connected_with) VALUES (?, ?, ?)', [this.email, this.password, this.connectedWith]);

            if (this.id == null) {
                const rows = await db.query('SELECT id FROM users WHERE email = ?', [this.email])
                this.id = rows[0].id;
            }
        } catch (err) {
            throw err;
        }
    }

    static async findByEmail(email: string) {
        const rows = await db.query('SELECT * FROM users WHERE email = ?', [email])
        
        if (rows.length == 1)
            return new User(rows[0].id, rows[0].email, rows[0].password, rows[0].connected_with);
        else
            return null;
    }

    static async findById(id: number) {
        const rows = await db.query('SELECT * FROM users WHERE id = ?', [id])
        
        if (rows.length == 1)
            return new User(rows[0].id, rows[0].email, rows[0].password, rows[0].connected_with);
        else
            return null;
    }

    static async findAll() {
        return await db.query('SELECT * FROM users');
    }
}

export default User;