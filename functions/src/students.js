const express = require('express')
const { firebase, admin } = require('../firebase')
const app = express()
const db = admin.firestore()

const getCurrentStudent = (id, callback) => {
  if (id) {
    db.collection('students').doc(`${id}`).get().then(doc => {
      callback(doc)
    })
  }
}

app.get('/', (req, res) => {
  db.collection('students').get().then(snapshot => {
    const data = []
    snapshot.forEach(doc => {
      data.push(doc.data())
    })
    return res.status(200).send(data)
  }).catch(error => {
    console.log(error)
    return res.status(500).send(error)
  })
})

app.get('/:id', (req, res) => {
  const id = req.params.id || null
  getCurrentStudent(id, (doc) => {
    if (!doc) {
      res.status(400).send('Does Not Exist')
    } else {
      res.status(200).send(doc.data())
    }
  })
})

app.post('/', (req, res) => {
  const {
    firstName,
    lastName,
    birthDate,
    address,
    score
  } = req.body

  const date = birthDate ? admin.firestore.Timestamp.fromDate(new Date(birthDate)) : null

  db.collection('students').get().then(snap => {

    const student = {
      id: snap.size + 1,
      firstName: firstName || null,
      lastName: lastName || null,
      birthDate: date,
      address: address || null,
      score: score || null
    }

    try {
      db.collection('students').doc(`${snap.size + 1}`).set(student)
      return res.status(200).send(student)
    } catch (error) {
      console.log(error)
      return res.status(500).send(error)
    }
  }).catch(error => {
    console.log(error)
    return res.status(500).send(error)
  })



})

app.put('/:id', (req, res) => {
  try {
    db.collection('students').doc(`${req.params.id}`).update(req.body)
    getCurrentStudent(req.params.id, (doc) => {
      if (!doc) {
        res.status(400).send('Does Not Exist')
      } else {
        res.status(200).send(doc.data())
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
})

module.exports = app
