const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const eformidable = require('express-formidable'),
  hbs = require('express-handlebars'),
  db = require('./db/db'),
  insertMaterialMiddleware = require('./middleware/insert_material'),
  insertClassMiddleware = require('./middleware/insert_class'),
  insertSylabusMiddleware = require('./routes/insert_sylabus'),
  redirectToRequestsMiddleware = require('./routes/redirect_to_materials'),
  redirectToClassesMiddleware = require('./routes/redirect_to_specific_classes'),
  requestRoutes = require('./routes/materials'),
  errorMiddleware = require('./middleware/error'),
  validateExistenceMiddleware = require('./middleware/validate_existence'),
  validateCorrectnessOfInputs = require('./middleware/validate_correctness_of_inputs'),
  registerUserMiddleware = require('./middleware/registerUser'),
  validateExistenceOfUser = require('./middleware/validate_existence_of_user'),
  logoutEndpoint = require('./routes/logout'),
  apiRoutes = require('./api/server');

const app = express();
const port = 8080;
const dirName = path.join(__dirname, 'static');
const uploadDir = path.join(__dirname, 'uploadDir');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

    if (req.isAuthenticated()) return next();
    return res.redirect('/login.html');
  };
}

app.use(express.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(express.static(dirName));
app.use(bodyParser.json());
app.use(session({
  secret: 'shhh!it`s secret!',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  ((username, password, done) => {
    const database = (db.mongo).db('Web');
    database.collection('felhasznalo').findOne({ username }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        console.log('nem ok a username');
        return done(null, false, { message: 'Incorrect username.' });
      }
      const hash = user.password;
      return bcrypt.compare(password, hash, (err2, resp) => {
        if (err2) throw err;
        if (resp) {
          console.log('minden ok');
          return done(null, user);
        }
        console.log('nem ok a pass');
        return done(null, false, { message: 'Incorrect password.' });
      });
    });
  }),
));
const hbsInstance = hbs.create({
  extname: 'hbs',
  defaultLayout: '',
  partialsDir: path.join(__dirname, 'views/partials'),
});

app.engine('hbs', hbsInstance.engine);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// user registration
app.post('/register', validateExistenceOfUser);
app.post('/register', registerUserMiddleware);

// user authetication
app.post('/login', passport.authenticate(
  'local', {
    successRedirect: '/materials',
    failureRedirect: '/login.html',
  },
));

app.get('/logout', logoutEndpoint);

// materials validation
app.post('/submit_tantargyak', authenticationMiddleware(), validateCorrectnessOfInputs);
app.post('/submit_tantargyak', validateExistenceMiddleware);
app.post('/submit_tantargyak', insertMaterialMiddleware);
app.use('/submit_tantargyak', redirectToRequestsMiddleware);

app.use('/api', apiRoutes);
app.use('/materials', authenticationMiddleware(), requestRoutes);
app.post('/add_class', insertClassMiddleware);
app.use('/add_class', redirectToClassesMiddleware);
app.use(eformidable({ uploadDir }));
app.post('/add_sylabus', insertSylabusMiddleware);

app.use(errorMiddleware);

app.listen(port, () => console.log(`server is listening on port: ${port}`));
