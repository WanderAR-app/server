import db from '../database/mariadb';

class Admin {
    id: number;
    email: string;
    password: string;
    societyId: number;

    constructor(id: number | null, email: string, password: string, society: number) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.societyId = society;
    }

    async save() {
        try {
            await db.query('INSERT INTO admins (email, password, society_id) VALUES (?, ?, ?)', [this.email, this.password, this.societyId]);

            if (this.id == null) {
                const rows = await db.query('SELECT id FROM admins WHERE email = ?', [this.email])
                this.id = rows[0].id;
            }
        } catch (err) {
            throw err;
        }
    }

    async updateEmail(email: string) {
        try {
            await db.query('UPDATE admins SET email = ? WHERE id = ?', [email, this.id]);
            this.email = email;
        } catch (err) {
            throw err;
        }
    }

    async updatePassword(password: string) {
        try {
            await db.query('UPDATE admins SET password = ? WHERE id = ?', [password, this.id]);
            this.password = password;
        } catch (err) {
            throw err;
        }
    }

    static async findByEmail(email: string) {
        const rows = await db.query('SELECT * FROM admins WHERE email = ?', [email])
        
        if (rows.length == 1)
            return new Admin(rows[0].id, rows[0].email, rows[0].password, rows[0].society_id);
        else
            return null;
    }

    static async findById(id: number) {
        const rows = await db.query('SELECT * FROM admins WHERE id = ?', [id])
        
        if (rows.length == 1)
            return new Admin(rows[0].id, rows[0].email, rows[0].password, rows[0].society_id);
        else
            return null;
    }

    static async findAll() {
        return await db.query('SELECT * FROM admins');
    }
}

export default Admin;