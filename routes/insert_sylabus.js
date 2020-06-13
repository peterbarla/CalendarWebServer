const db = require('../db/db');

module.exports = (req, res) => {
  db.insertSylabus(req, (err) => {
    if (err) {
      res.status(500).render('error', { message: `Insertion unsuccessful: ${err.message}` });
    } else {
      res.redirect(`materials/details?kod=${req.query.kod}`);
    }
  });
};
