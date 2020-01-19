const express = require('express');
const morgan = require('morgan')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const ficConfig = require("./config/config")
require('./config/validation/passport')

const mongoose = require('mongoose')
const passport = require('passport')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/MOBY')
const app = express();
app.use(morgan('dev'));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// --- Config Express
// --- middleware
// - body-parser needed to catch and to treat information inside req.body

app.use(bodyParser.json());
//Définition des CORS
app.use(ficConfig.activateCors);

app.use(bodyParser.urlencoded({ extended: false }));
let busboy     = require('connect-busboy');
app.use(busboy());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  cookie: { maxAge: 600000 },
  secret: 'MOBYCAR',
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(flash());
//*********Config********* */
app.use(ficConfig.activateCors);
//Affichage des alertes/ variable pour le user*

app.use((req,res,next) => {

  res.locals.success_messages = req.flash('success')
  res.locals.error_messages = req.flash('error')
  res.locals.isAuthenticated = req.user ? true:false


  next()

})
app.use('/', require('./routes/index'));
app.use('/users', require('./Ressources/User/routeUser'));
app.use('/media', require('./Ressources/Media/routeMedia'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.render('notFound');
});
app.listen(5000, () => console.log('Server started listening on port 5000!'));