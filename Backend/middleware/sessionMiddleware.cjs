const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Verify that this is the correct value
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === 'production',
  },
});

module.exports = sessionMiddleware;
