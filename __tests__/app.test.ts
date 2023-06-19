import request from "supertest";
import app from "../src/app";
import port from "../src/app";
import mariadb from 'mariadb';


let server: any;

beforeAll(async () => {
  server = await app.listen();
});

afterAll(async () => {
  await server.close();
});

describe("Server.ts tests", () => {
    test("Server is working !", () => {
        expect(2 + 2).toBe(4);
    });
});

describe('GET /', () => {
    it('should return 200 and a message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Server is working !' });
    });
});

// VARIABLE ENV //

// describe('port assignment', () => {
//   it('should use port 8080 if environment variable is not set', () => {
//     delete process.env.PORT;
//     expect(port).toBe(8080);
//   });

//   it('should use port from environment variable if set', () => {
//     process.env.PORT = '3000';
//     expect(port).toBe(3000);
//   });
// });

// MARIADB //

describe('database connection', () => {
  let pool: mariadb.Pool;

  // connexion à la DB
  beforeAll(async () => {
    pool = mariadb.createPool({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'wandercore',
      port: 3306,
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should return test email from the database', async () => {
    const query = 'SELECT * FROM admins WHERE id =?';
    const params = [1];
    const expectedRows = [{ id: 1, email: 'test@test.com' }];

    const conn = await pool.getConnection();
    const rows = await conn.query(query, params);
    const expectedEmails = expectedRows.map(row => row.email);
    const emails = rows.map(row => row.email);
    expect(emails).toEqual(expectedEmails);
    conn.end();
  });
  test('should throw an error if the query fails', async () => { // la requete doit échouer car la table admins existe déjà
    const query = `
      CREATE TABLE admins (
        id INT NOT NULL AUTO_INCREMENT UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
      );
    `;
    const params = [];
    const conn = await pool.getConnection();
    await expect(conn.query(query, params)).rejects.toThrow();
    conn.end();
  });
});