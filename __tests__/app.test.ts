import request from "supertest";
import app from "../src/app";

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