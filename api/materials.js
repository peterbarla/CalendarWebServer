const express = require('express');
const db = require('../db/db');

const router = express.Router();

// findAll
router.get('/', (req, res, next) => {
  const queries = req.query;
  if (Object.keys(queries).length !== 0) {
    next();
  } else {
    db.getMaterials((err, materials) => {
      if (err) {
        res.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
      } else {
        res.json(materials);
      }
    });
  }
});

// findAll with specific conditions as parameters
router.get('/', (req, res) => {
  db.getMaterialsWithConditions(req, (materials) => {
    res.json(materials);
  });
});

// findById
router.get('/:materialID', (req, res) => {
  console.log('ebben');
  db.getSpecificMaterialByID(req, (resultMaterial) => {
    res.json(resultMaterial);
  });
});

// findById
router.get('/:materialID', (req, res) => {
  const { materialID } = req.params;
  const query = req.query.properties;
  console.log(materialID);
  console.log(query);
  if (query) {
    db.getSpecificMaterialByID(req, (resultMaterial) => {
      res.json(resultMaterial);
    });
  }
});

// delete class from a specific material
router.delete('/:materialID/classes', (req, res) => {
  db.deleteSpecificClass(req, (err, response) => {
    if (err) {
      res.status(500).render('error', { message: `Specific class deletion unsuccessful: ${err.message}` });
    } else {
      console.log(response);
      res.json(response);
    }
  });
});

// insert new  material
router.post('/', (req, res) => {
  console.log(req.body.nev);
  console.log('insert');
  db.insertMaterialsWithApi(req, (response) => {
    console.log(response);
    res.status(201).json(response);
  });
});

// delete material by id
router.delete('/:materialID', (req, res) => {
  db.deleteMaterialWithApi(req, (response) => {
    console.log(response);
    if (response.msg !== 'Deleted!') {
      res.status(500).json(response);
    }
    res.status(204).json(response);
  });
});

// update with patch
router.patch('/:materialID', (req, res) => {
  db.updateMaterialWithSpecificID(req, (response) => {
    if (response.msg !== 'Updated!') {
      res.status(500).json(response);
    } else {
      res.status(204).json(response);
    }
  });
});

module.exports = router;
