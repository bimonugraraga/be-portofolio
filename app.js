const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes')
const errHandler = require('./helpers/errorHandler')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', routes)
app.use(errHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})