const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/login', (req, res) =>{
  res.render('login.ejs');
});

app.get('/play', (req, res) =>{
  res.render('janken.ejs');
});

app.listen(3000);