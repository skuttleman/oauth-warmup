try {
	require('dotenv').load();
} catch (err) {
	console.error(err);
}
var uuid = 0;
var express = require('express'), app = express();
var session = require('express-session');
var passport = require('passport');
var linkedIn = require('passport-linkedin-oauth2').Strategy;


app.use(session({
  genid: function() {
    return genuuid()
  },
  secret: process.env.SESSION_SECRET
}))

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.HOST + "/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true
}, function(accessToken, refreshToken, profile, done) {
  var newProfile = {id: profile.id, displayName: profile.displayName};
  done(null,newProfile );
}));

app.get('/', funtion(request, response) {
	response.json(request.user);
});

app.get('/auth/linkedin',
  passport.authenticate('linkedin'),
  function(req, res) {

  }
);

app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});




var crudl = require('./routes/crudl');
//app.use('/route', crudl('<table_name>', [
  { name: 'column1', type: 'integer' },
  { name: 'column2', type: 'string' },
  { name: 'column3', type: 'boolean' },
  { name: 'column3', type: 'datetime' }
]));

app.get('/*', function(request, response) {
	response.json(request.user);
});

app.listen(process.env.PORT || 8000, function() {
  console.log('The NSA is listening on port', process.env.PORT || 8000);
});

function genuuid() {
	return uuid++;
}
