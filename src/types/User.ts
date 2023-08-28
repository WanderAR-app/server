import db from '../database/mariadb';
class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;

    constructor(id: number | null, firstName: string, lastName: string, email: string, passwordHash: string | null) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    async save() {
        try {
            const sql = `INSERT INTO user_account (first_name, last_name) VALUES (?, ?)`;
            await db.query(sql, [this.firstName, this.lastName]);

            if (this.id == null) {
                const rows = await db.query('SELECT id FROM user_account WHERE first_name = ? AND last_name = ?', [this.firstName, this.lastName]);
                this.id = rows[0].id;
            }

            const sql2 = `INSERT INTO user_login_data (user_id, email, password_hash) VALUES (?, ?, ?, ?)`;
            await db.query(sql2, [this.id, this.email, this.passwordHash]);

            return this;
        } catch (err) {
            throw err;
        }
    }

    static async findByEmail(email: string) {
        try {
            const rows = await db.query('SELECT * FROM user_login_data WHERE email = ?', [email]);

            if (rows.length != 1) {
                return null;
            }

            const userLoginData = rows[0];
            const rows2 = await db.query('SELECT * FROM user_account WHERE id = ?', [userLoginData.user_id]);

            if (rows2.length != 1) {
                return null;
            }

            const userAccount = rows2[0];
            return new User(userAccount.id, userAccount.first_name, userAccount.last_name, userLoginData.email, userLoginData.password_hash);

        } catch (err) {
            throw err;
        }
    }

    static async findById(id: number) {
        try {

            const rows = await db.query('SELECT * FROM user_account WHERE id = ?', [id]);

            if (rows.length != 1) {
                return null;
            }

            const userAccount = rows[0];
            const rows2 = await db.query('SELECT * FROM user_login_data WHERE user_id = ?', [userAccount.id]);

            if (rows2.length != 1) {
                return null;
            }

            const userLoginData = rows2[0];
            return new User(userAccount.id, userAccount.first_name, userAccount.last_name, userLoginData.email, userLoginData.password_hash);

        } catch (err) {
            throw err;
        }
    }

    static async findAll() {
        try {
            const rows = await db.query('SELECT * FROM user_account');
            const users = [];

            for (let i = 0; i < rows.length; i++) {
                const userAccount = rows[i];
                const rows2 = await db.query('SELECT * FROM user_login_data WHERE user_id = ?', [userAccount.id]);

                if (rows2.length != 1) {
                    return null;
                }

                const userLoginData = rows2[0];
                users.push(new User(userAccount.id, userAccount.first_name, userAccount.last_name, userLoginData.email, userLoginData.password_hash));
            }

            return users;

        } catch (err) {
            throw err;
        }
    }
}

export default User;