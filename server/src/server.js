require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const router = require('./routes/routes')

// CREDENTIALS
const user = process.env.DB_USER
const pass = process.env.DB_PASS

const mongoose = require('mongoose')


mongoose.connect(`mongodb+srv://${user}:${pass}@cluster0.nqs6xef.mongodb.net/?retryWrites=true&w=majority`)
.then(() => {
  console.log("Conectado ao banco de dados")
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
  })
}).catch((err) => {
  console.log(err)
})

app.use(express.json())
app.use(router)
