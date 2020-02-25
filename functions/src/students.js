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
            address: address || null
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

app.get('/:id/:field', (req, res) => {
    try {
        const field = req.params.field
        getCurrentStudent(req.params.id, (doc) => {
            if (!doc) {
                res.status(400).send('Does Not Exist')
            } else {
                const user = doc.data()
                res.status(200).send(user[field])
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

app.get('/scores', (req, res) => {
    db.collection('scores').get().then(snapshot => {
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

app.post('/scores', (req, res) => {
    const {
        studentId,
        score
    } = req.body

    const scores = {
        studentId: studentId || null,
        score: score || null

    }

    try {
        db.collection('scores').doc(studentId).set(scores)
        return res.status(200).send(scores)
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }

})

app.put('/scores/:id', (req, res) => {
    try {
        db.collection('scores').doc(`${req.params.id}`).update(req.body).then(() => {
            db.collection('scores').doc(`${req.params.id}`).get().then(doc => {
                if (!doc) {
                    res.status(400).send('Does Not Exist')
                } else {
                    res.status(200).send(doc.data())
                }
            })
        })


    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

app.get('/scores/average/:id', (req, res) => {
    try {
        db.collection('scores').doc(`${req.params.id}`).get().then(doc => {
            if (!doc) {
                res.status(400).send('Does Not Exist')
            } else {

                const { score } = doc.data()

                const length = score.length
                let sum = 0

                for (let i = 0; i < length; i++) {
                    sum += parseInt(score[i])
                }

                const average = sum / length

                res.status(200).send(`${average}`)
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
})

module.exports = app