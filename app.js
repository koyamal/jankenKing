const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { NULL } = require('mysql/lib/protocol/constants/types');
const session = require('express-session');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'jankenking'
});

connection.connect((err) => {
  if (err) {
    console.log('Error Connecting: ' + err.stack);
    return;
  }
  console.log('Connection Successfully!');
});

app.use((req, res, next) =>{
  if (req.session.userName === undefined){
    res.locals.userName = "Guest";
    res.locals.isLogin = false;
  }else{
    res.locals.userName = req.session.userName;
    res.locals.userInfo = req.session.userInfo;
    res.locals.isLogin = true;
  }
  next();
});

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/login', (req, res) =>{
  res.render('login.ejs');
});

app.post('/login', (req, res) =>{
  const email = req.body.email;
  const password = req.body.password;
  if (email === ""){
    console.log("Login failed e-mail error");
    res.render('login.ejs');
  }else{
    connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (error, results) =>{
        if (results.length > 0){
          if (results[0].password === password){
            req.session.userName = results[0].name;
            req.session.userInfo = results[0];
            console.log("Login: " + results[0].name);
            res.redirect('/');
          } else {
            console.log("Login failed password error");
            console.log("  - Inputed email: " + email);
            console.log("  - Inputed password: " + password);
            res.render('login.ejs');
          }
        } else {
          console.log("Login failed e-mail error");
          console.log("  - Inputed email: " + email);
          console.log("  - Inputed password: " + password);
          res.render('login.ejs');
        }
      }
    );
  }
});

app.get('/logout', (req, res) =>{
  req.session.destroy((error) =>{
    res.redirect('/');
  });
});

app.get('/play', (req, res) =>{
  res.render('janken.ejs');
});

app.get('/result', (req, res) =>{
  res.render('result.ejs');
});

app.get('/ranking', (req, res) =>{
  res.render('ranking.ejs');
});

app.listen(3000);