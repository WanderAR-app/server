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

    save() {
        try {
            db.query('INSERT INTO users (email, password) VALUES (?, ?)', [this.email, this.password]);

            if (this.id == null)
                db.query('SELECT id FROM users WHERE email = ?', [this.email]).then((rows: any) => {
                    this.id = rows[0].id;
                });
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