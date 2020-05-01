const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.dev.html')))
app.use('/static', express.static(__dirname))

app.listen(port, () => console.log(`Debug app listening on port ${port}!`))