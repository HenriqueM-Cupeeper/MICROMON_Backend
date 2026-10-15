import express from "express"
import { db } from "../db"
import { pokemon } from "../db/schemas/micromon"
const app = express()
const port = 3000

app.get('/', (req, res) => {
  db.insert(pokemon).values({})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})