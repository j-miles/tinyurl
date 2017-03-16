var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
var cookieParser = require('cookie-parser');

app.use(cookieParser());

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 6; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

var random = generateRandomString();


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

app.get("/register", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user:users[req.cookies['user_id']]
  };
  res.render("urls_register", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user:users[req.cookies['user_id']]
  };
  res.render("urls_index", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user:users[req.cookies['user_id']]
  };
  res.render("urls_login", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
  user:users[req.cookies['user_id']],
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    link: urlDatabase[req.params.id],
    user:users[req.cookies['user_id']]
    };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  var random = generateRandomString();
  urlDatabase[random] = req.body.longURL
  var newURL = random;
  res.redirect("urls/" + newURL);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post('/register', (req, res) => {
  var random = generateRandomString();
  var authenticated = true;
  newObj = {};
  newObj.id = random;
  newObj.email = req.body.email;
  newObj.password = req.body.password;
  if (authenticated) {
    for(i in users) {
      if (users[i].email === req.body.email) {
        authenticated = false;
      }
    }
  if (req.body.email === '' || req.body.password === '') {
    authenticated = false;
    }
    if (authenticated) {
      users[random] = newObj;
      res.cookie('user_id', random);
      res.redirect("/urls");
      console.log(users);
    } else {
      res.statusCode = 400
      res.send('400');
      }
    }
});

app.post('/login', (req, res) => {
  var loggedIn = false;
  if (!loggedIn) {
    for(i in users){
      if (users[i].email === req.body.email && users[i].password === req.body.password)
        loggedIn = true
    }
    if (loggedIn) {
      res.cookie('user_id', users[i].id);
      res.redirect('/urls');
      console.log(users[i].id);
    } else {
      res.statusCode = 403;
      res.send('403');
    }
  }
});

app.post('/urls/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect('/urls/' + req.params.id);
});


app.listen(PORT, () => {
  console.log(`TinyApp app listening on port ${PORT}!`);
});