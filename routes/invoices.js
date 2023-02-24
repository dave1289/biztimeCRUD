const express = require("express")
const router = new express.Router()
const ExpressError = require("../expressError")
const db = require('../db.js')
const { json } = require("express")


router.get("/", async function(req,res){
   try {
      const result = await db.query(
         'SELECT * FROM invoices'
      )
      return res.json({invoices: result.rows})
   } catch(e) {
      return next(e)
   }
})

router.get('/:id', async (req, res, next) => {
   try{
      const id = req.params.id

      const results = await db.query(
         'SELECT * FROM invoices WHERE id=$1;', [id]
      )
      if (results.rows.length === 0) {
         throw new ExpressError(`Cannot find user with id of ${id}`, 404)
      }
      return res.send({invoice: results.rows[0]})
      } catch(e){
      return next(e)
   }
})

router.post("/", async function (req, res) {
   try {
      const { comp_code, amt } = req.body
      const results = await db.query(
         'INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *', [comp_code, amt]
      )
      return res.status(201).json({invoice: results.rows[0]})
   } catch(e) {
      return next(e)
   }
})

router.patch('/:id', async (req, res, next) => {
   try{
      const { comp_code, amt } = req.body;
      const id = req.params.id

      const results = await db.query(
         'UPDATE invoices SET comp_code=$1, amt=$2 RETURNING *;', [comp_code, amt]
      )
      if (results.rows.length === 0) {
         throw new ExpressError(`Cannot find user with id of ${id}`, 404)
      }
      return res.status(200).json({ invoice: results.rows[0]})
      } catch(e){
      return next(e)
   }
})

router.delete('/:id', async (req, res, next) => {
   try{
      const id = req.params.id

      const results = await db.query(
         'DELETE FROM users WHERE id=$1;', [id]
      )
      return res.json({message: "Deleted"});
      } catch(e){
      return next(e)
   }
})


module.exports = router;