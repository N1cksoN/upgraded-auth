//  TODO: 
// 1. работающий шаблон во views 
// 2. подвязать к нему гугл 
// 3. подвязать к нему фейсбук
// 4. подвязать к нему логинку

const express = require('express');
const http = require('http');  
const app = express();
const session = require('express-session');
const { initialize } = require('passport');
const passport = require('passport');
const { response } = require('express');
const path = require('path');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
require('dotenv').config();

const port = process.env.PORT;


//app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('/views'));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'))
  });

  
// app.get('/', (req, res) => {
//     res.render('../views/auth');
// });

//passport
let userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => { res.send(userProfile) });
app.get('/error', (req, res) => { res.send('Error logging in') });

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

//google auth
const GOOGLE_CLIENT_ID = 'our-google-client-id';
const GOOGLE_CLIENT_SECRET = 'our-google-client-secret';

const GOOGLE_CID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CS = process.env.GOOGLE_CLIENT_SECRET;


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CID,
    clientSecret: GOOGLE_CS,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });



app.listen(port , () => console.log('App listening on port ' + port));