const express = require('express');
const app = express()
const parseurl = require('parseurl')
const mustache = require('mustache-express');
const session = require('express-session')
const bodyParser = require('body-parser');

app.engine("mustache", mustache())
app.set('view engine', 'mustache');
app.set('views', './views');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.listen(3000, function(){})

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(function (req, res, next) {
  var views = req.session.views

  if (!views) {
    views = req.session.views = {}
  }
  // get the url pathname
  var pathname = parseurl(req).pathname
  // count the views
  views[pathname] = (views[pathname] || 0) + 1
  next()
})

var username = '';
var password = '';
var topsecret = 
{users : [
  {username:'123', password:'123'}
]}
app.get('/home', function (req, res) {
  if(req.session.user){
    res.render('home',{
      username: req.session.user,
      password: req.session.password
    }) 
  } else {
    res.render("login",{
    })
  }
})
app.get('/login', function (req, res) {
  res.render("login",{
    username: username,
    password: password
  });
})
app.post('/login', function (req, res) {
  username = req.body.username;
  password = req.body.password;

  for (var i = 0; i <topsecret.users.length; i++) {
    if(topsecret.users[i].username === username && topsecret.users[i].password === password){
      req.session.user = username;
      req.session.password = password;
      console.log(req.session);
      res.redirect('/home')
    } 
  }
  res.redirect('/login')
})
app.post('/signup', function (req, res) {
  username = req.body.username;
  password = req.body.password;
  var newUser = {
    username: username,
    password: password
  }
  topsecret.users.push(newUser)
  req.session.user = username
  req.session.password = password
  console.log("signed up:" + topsecret.users)
  res.redirect('/home')
  
})

app.post('/logout', function (req, res){
  req.session.user = ''
  req.session.password = ''
  console.log("Logged out, Users:" + topsecret.users[1].username)
  res.redirect('/login')

})


app.get('/foo', function (req, res) {
  res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})

app.get('/bar', function (req, res) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})