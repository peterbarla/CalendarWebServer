const db = require('../db/db');

module.exports = (req, resp, next) => {
  const database = (db.mongo).db('Web');
  database.collection('felhasznalo').distinct('username', {}, (err, result) => {
    const name = req.body.username;
    if (err) throw err;
    else if (result.includes(name)) {
      resp.status(500).render('error', { message: 'Insertion unsuccessful, username already exists!' });
    } else {
      next();
    }
  });
};
