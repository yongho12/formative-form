const express = require("express");
const csrf = require('csurf'); 
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const csrfProtection = csrf({ cookie: true });

app.get("/", (req, res) => {
  res.render('index.pug', {users});
});

app.get('/create', csrfProtection, (req, res, next) => {
  res.render('create', { title: 'Create User', messages: [], csrfToken: req.csrfToken() });
})

app.get("/create-interesting", csrfProtection, (req, res, next) => {
  res.render("create-interesting", {
    title: `Create an intersting user`,
    messages: [],
    csrfToken: req.csrfToken()
  })
});

const validationErr = (req, res, next) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  const errors = [];

  if (!firstName) {
    errors.push("Please provide a first name.");
  }

  if (!lastName) {
    errors.push("Please provide a last name.");
  }

  if (!email) {
    errors.push("Please provide an email.");
  }

  if (!password) {
    errors.push("Please provide a password.");
  }

  if (password && password !== confirmedPassword) {
    errors.push(
      "The provided values for the password and password confirmation fields did not match."
    );
  }

  req.errors = errors;
  next();
};

app.post('/create', csrfProtection, validationErr, (req, res) => {
  
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  const errors = req.errors;

  if (errors.length > 0) {
    res.render("create", {
      title: "Create a user",
      firstName,
      lastName,
      email,
      csrfToken: req.csrfToken(),
      messages: errors
    });
    return;
  }

  users.push({ id: users.length+1, firstName, lastName, email });
  res.redirect('/');
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
