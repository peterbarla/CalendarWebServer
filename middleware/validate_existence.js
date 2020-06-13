const db = require('../db/db');

module.exports = (req, resp, next) => {
  const database = (db.mongo).db('Web');
  database.collection('tantargy').distinct('jegy', {}, (err, result) => {
    const kod = req.body.tantargykod;
    if (err) throw err;
    else if (result.includes(kod)) {
      resp.status(500).render('error', { message: 'Insertion unsuccessful, unique code taken!' });
    } else {
      next();
    }
  });
};
