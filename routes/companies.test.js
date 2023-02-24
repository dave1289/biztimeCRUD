process.env.NODE_ENV = 'test';
const request = require('supertest')
const app = require('../app.js')
const db = require('../db.js')


let testCompany;

beforeEach(async () => {
   const result = await db.query(
      `INSERT INTO companies (code,  name, description) VALUES ('NVI', 'National Vision', 'sucks') RETURNING *`)
   testCompany = result.rows[0]
   
})

afterEach(async () => {
   await db.query(
      `DELETE FROM companies;`
   )
})

afterAll(async () => {
   await db.end();
})

describe("GET /companies", () => {
   test('Get a list of companies', async () => {
      const res = await request(app).get('/companies')
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual([testCompany])
   })
})

describe("GET /companies/:id", () => {
   test('Get a single user', async () => {
      const res = await request(app).get(`/companies/${testCompany.id}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({ user: testCompany })
   })
   test('Responds with 404 for invalid id', async () => {
      const res = await request(app).get(`/companies/0`)
      expect(res.statusCode).toBe(404)
   })
})

describe("POST /companies", () => {
   test('Post new user', async () => {
      const res = await request(app).post('/companies').send({
         code: 'bbb',
         name: 'BillyBob',
         description: 'staff'
      })
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
         user: {
            id: expect.any(Number),
            code: 'bbb',
            name: 'BillyBob',
            description: 'staff'}
      })
   })
})

describe("PATCH /companies", () => {
   test('updates a user', async () => {
      const res = await request(app).patch(`/companies/${testCompany.id}`).send({
         code: 'bbb',
         name: 'BillyBob',
         description: 'admin'
      })
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
         user: {
            id: expect.any(Number),
            name: 'BillyBob',
            description: 'admin'}
      })
   })
   test('Responds with 404 for invalid id', async () => {
      const res = await request(app).get(`/companies/0`)
      expect(res.statusCode).toBe(404)
   })
})


