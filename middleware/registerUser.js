const db = require('../db/db');

module.exports = (req, res) => {
  req.checkBody('username', 'Username field empty!').notEmpty();
  req.checkBody('password', 'Password field empty!').notEmpty();
  const error = req.validationErrors();
  if (error) {
    res.status(500).render('error', { message: 'You must fill every field!' });
    return;
  }
  db.registerUser(req, (err) => {
    if (err) {
      res.status(500).render('error', { message: `Insertion unsuccessful: ${err.message}` });
    } else {
      res.redirect('/login.html');
    }
  });
};
