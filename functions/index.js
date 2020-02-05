const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
const studentApi = require('./src/students')

app.use(cors())
app.use('/students', studentApi)

exports.api = functions.https.onRequest(app)