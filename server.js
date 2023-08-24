const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Session configuration
const sess = {
  secret: 'My darkest secret', // Secret used to sign the session ID cookie
  cookie: {
    maxAge: 300000, // Session max age in milliseconds (5 minutes)
    httpOnly: true, // Only accessible through JavaScript
    secure: false, // Set to true for HTTPS only
    sameSite: 'strict', 
  },
  resave: false, // Don't save session if unmodified
  saveUninitialized: true, // Save new sessions
  store: new SequelizeStore({
    db: sequelize, // Store sessions in the Sequelize database
  }),
};

app.use(session(sess)); // Attach session middleware to the app

// Set Handlebars as the view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public'

app.use(routes); // Attach route handlers to the app

// Sync Sequelize with the database
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App is now listening on port ${PORT}`));
});