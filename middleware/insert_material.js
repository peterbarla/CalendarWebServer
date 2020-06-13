const db = require('../db/db');

module.exports = (req, res, next) => {
  db.insertMaterials(req, (err) => {
    if (err) {
      res.status(500).render('error', { message: `Insertion unsuccessful: ${err.message}` });
    } else {
      next();
    }
  });
};
