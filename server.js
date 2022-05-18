const express = require("express");
const routes = require("./controllers");
const session = require("express-session");
const path = require("path");
const exhbs = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
  secret: "This is a secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

const hbs = exhbs.create({});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(require('./controllers/'));

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  });