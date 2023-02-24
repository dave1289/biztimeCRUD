const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const db = require('../db.js')
const { json } = require("express")


router.get("/", async function(req,res){
   try {
      const result = await db.query(
         'SELECT * FROM companies'
      )
      return res.json({companies: result.rows})
   } catch(e) {
      return next(e)
   }
})

router.get('/:code', async (req, res, next) => {
   try{
      const code = req.params.code

      const results = await db.query(
         'SELECT * FROM companies WHERE code=$1;', [code]
      )
      if (results.rows.length === 0) {
         throw new ExpressError(`Cannot find company with code of ${code}`, 404)
      }
      return res.send({user: results.rows[0]})
      } catch(e){
      return next(e)
   }
})

router.post("/", async function (req, res) {
   try {
      const { code, name, description } = req.body
      const results = await db.query(
         'INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING *', [code, name, description]
      )
      return res.status(201).json({company: results.rows[0]})
   } catch(e) {
      return next(e)
   }
})

router.patch('/:code', async (req, res, next) => {
   try{
      const { name, description } = req.body;
      const code = req.params.code

      const results = await db.query(
         'UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING *;', [name, description]
      )
      if (results.rows.length === 0) {
         throw new ExpressError(`Cannot find company with code of ${code}`, 404)
      }
      return res.status(200).json({ company: results.rows[0]})
      } catch(e){
      return next(e)
   }
})

router.delete('/:code', async (req, res, next) => {
   try{
      const code = req.params.code

      const results = await db.query(
         'DELETE FROM companies WHERE code=$1;', [code]
      )
      return res.json({message: "Deleted"});
      } catch(e){
      return next(e)
   }
})


module.exports = router;