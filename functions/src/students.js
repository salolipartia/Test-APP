const express = require('express')
const { admin } = require('../firebase')
const app = express()

app.get('/', (req, res) => {
    const reference = admin.database().ref('/students')

    reference.on('value', (snapshot) => {
        res.json(snapshot.val())
        reference.off('value')
    }, (errorObject) => {
        res.send(`somethig wrong: ${errorObject.code}`)
    })
})

app.post('/', (req, res) => {

})

module.exports = app