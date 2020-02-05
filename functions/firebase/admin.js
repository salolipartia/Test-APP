const admin = require('firebase-admin')
const ServiceAccountKey = require('../serviceAccountKey.json')
admin.initializeApp({
    credential: admin.credential.cert(ServiceAccountKey),
    databaseURL: 'https://test-app-5e90f.firebaseio.com'

})

module.exports = admin