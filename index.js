try {
	require('dotenv').load();
} catch (err) {
	console.error(err);
}
var uuid = 0;
var express = require('express'), app = express();
var session = require('express-session');
var passport = require('passport');
var LinkedIn = require('passport-linkedin-oauth2').Strategy;


app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(session({
  secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



passport.use(new LinkedIn({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: process.env.HOST + "/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true
}, function(accessToken, refreshToken, profile, done) {
  var newProfile = {id: profile.id, displayName: profile.displayName};
  done(null,newProfile );
}));

app.get('/', function(request, response) {
	response.render(request.user ? 'loggedin' : 'loggedout');
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



app.listen(process.env.PORT || 8000, function() {
  console.log('The NSA is listening on port', process.env.PORT || 8000);
});

function genuuid() {
	return uuid++;
}
