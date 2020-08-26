const express = require("express");
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
const csrfProtection = csrf({ cookie: true })

app.get("/", (req, res) => {
  res.render('index.pug', {users});
});

app.get('/create', csrfProtection, (req, res) => {
  res.render('index', { title: 'Create Form', csrfToken: req.csrfToken() });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
