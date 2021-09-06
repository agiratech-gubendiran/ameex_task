const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 4000;

const auth = require("./core/service/authServiceProvider");
const fs = require("fs");
const filePath = './remote-file-store.txt'

app.use(auth().validateUserToken);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(JSON.stringify({ info: 'External server response', status: 'success'  }))
})
app.post('/data', (req, res) => {
  const payload = req.body || {}
  fs.writeFileSync(filePath, JSON.stringify(payload), { encoding: 'utf8', flag:'w'});
  res.send(JSON.stringify({ info: 'External server response', status: 'success', payload }))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})