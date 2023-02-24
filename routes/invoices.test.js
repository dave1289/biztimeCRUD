process.env.NODE_ENV = 'test';
const request = require('supertest')
const app = require('../app.js')
const db = require('../db.js')


let testInvoice;

beforeEach(async () => {
   const result = await db.query(
      `INSERT INTO invoices (comp_code, amt) VALUES ('NVI', 400) RETURNING *`)
   testInvoice = result.rows[0]
   
})

afterEach(async () => {
   await db.query(
      `DELETE FROM invoices;`
   )
})

afterAll(async () => {
   await db.end();
})

describe("GET /invoices", () => {
   test('Get a list of invoices', async () => {
      const res = await request(app).get('/invoices')
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual([testInvoice])
   })
})

describe("GET /invoices/:id", () => {
   test('Get a single invoice', async () => {
      const res = await request(app).get(`/invoices/${testInvoice.id}`)
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual({ invoice: testInvoice })
   })
   test('Responds with 404 for invalid id', async () => {
      const res = await request(app).get(`/invoices/0`)
      expect(res.statusCode).toBe(404)
   })
})

describe("POST /invoices", () => {
   test('Post new invoice', async () => {
      const res = await request(app).post('/invoices').send({
         comp_code: 'slp',
         amt: 300
      })
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
         invoice: {
            id: expect.any(Number),
            comp_code: 'slp',
            amt: 300}
      })
   })
})

describe("PATCH /invoices", () => {
   test('updates a invoice', async () => {
      const res = await request(app).patch(`/invoices/${testInvoice.id}`).send({
         name: 'BillyBob',
         type: 'admin'
      })
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
         invoice: {
            id: expect.any(Number),
            name: 'BillyBob',
            type: 'admin'}
      })
   })
   test('Responds with 404 for invalid id', async () => {
      const res = await request(app).get(`/invoices/0`)
      expect(res.statusCode).toBe(404)
   })
})


