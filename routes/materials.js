const express = require('express');
const db = require('../db/db');

const router = express.Router();

router.get('/', (req, resp) => {
  db.getMaterials((err, materials) => {
    if (err) {
      resp.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
    } else {
      console.log(req.user);
      console.log(req.isAuthenticated());
      resp.render('fooldal', { materials, user: req.user.username });
    }
  });
});

router.get('/download_sylabus', (req, resp) => {
  console.log('router');
  db.getSylabus(req, (err, sylabus) => {
    if (err) {
      resp.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
    } else {
      // console.log(sylabus);
      const file = `uploadDir/${sylabus}`;
      if (sylabus !== null) {
        resp.download(file);
      } else {
        resp.redirect(`/materials/reszletek?kod=${req.query.kod}`);
      }
    }
  });
});

router.post('/delete', (req, resp) => {
  console.log('delete');
  db.deleteMaterial(req, (err, materials) => {
    if (err) {
      resp.status(500).render('error', { message: `Deletion unsuccessful: ${err.message}` });
    } else {
      resp.render('fooldal', { materials, user: req.user.username });// , user: req.user });
    }
  });
});

router.post('/add_tantargy', (req, resp) => {
  db.getSpecificUser(req, (err, adminMode) => {
    if (err) throw err;
    else if (adminMode !== null) {
      resp.render('add_tantargy', { user: req.user.username });
    } else {
      resp.status(403).render('error', { message: 'You do not have permission to this page!' });
    }
  });
});

router.get('/details', (req, resp) => {
  db.getSpecificMaterialsCreator(req, (materialCreator) => {
    db.getClasses(req, (err2, classes) => {
      if (err2) {
        resp.status(500).render('error', { message: `Selection unsuccessful: ${err2.message}` });
      } else {
        const equals = req.user.username === materialCreator;
        resp.render('reszletek', {
          classes, kod: req.query.kod, user: req.user.username, isCreator: equals,
        });
      }
    });
  });
});

/* router.get('/list_properties', (req, resp) => {
  db.getSpecificMaterialByID(req, (resultMaterial) => {
    resp.json(resultMaterial);
  });
}); */

/* router.post('/delete_class', (req, resp) => {
  console.log(req.body);
  db.deleteSpecificClass(req, (err, response) => {
    if (err) {
      resp.status(500).render('error',
      { message: `Specific class deletion unsuccessful: ${err.message}` });
    } else {
      console.log(response);
      resp.json(response);
    }
  });
}); */

module.exports = router;
