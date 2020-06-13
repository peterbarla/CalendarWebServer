const { MongoClient } = require('mongodb');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');

let mongodb = null;

const connectionString = 'mongodb+srv://m001-student:m001-mongodb-basics@petercluster-2rjbe.mongodb.net/test?retryWrites=true&w=majority';
const saltRounds = 10;

MongoClient.connect(connectionString, {
  poolSize: 10,
  useUnifiedTopology: true,
}, (err, db) => {
  if (err) {
    throw err;
  }
  mongodb = db;
  exports.mongo = mongodb;
  const database = mongodb.db('Web');
  database.createCollection('tantargy', (err2) => {
    if (err2) {
      throw err2;
    }
    console.log('Tantargy collection created!');
  });
  database.createCollection('felhasznalo', (err2) => {
    if (err2) {
      throw err2;
    }
    console.log('Felhasznalo collection created!');
  });
  database.createCollection('ora', (err2) => {
    if (err2) {
      throw err2;
    }
    console.log('Ido collection created!');
  });
});

function getMaterialsBack(database, callback) {
  database.collection('tantargy').find().toArray((err2, result) => {
    if (err2) throw err2;
    callback(err2, result);
  });
}

function storeIDInSession(callback, req, id, err2) {
  req.login(id, (err4) => {
    if (err4) throw err4;
    console.log('user inserted!');
    callback(err2);
  });
}

exports.insertMaterials = (req, callback) => {
  const material = {
    jegy: req.body.tantargykod,
    nev: req.body.tantargynev,
    sylabus: req.body.filename,
    laborok: req.body.laborok,
    szeminarok: req.body.szeminarok,
    kurzusok: req.body.kurzusok,
    creator: req.user.username,
  };
  const database = mongodb.db('Web');
  database.collection('tantargy').insertOne(material, (err) => {
    if (err) {
      throw err;
    } else {
      console.log('material inserted!');
      callback(err);
    }
  });
};

exports.insertMaterialsWithApi = (req, callback) => {
  const material = {
    jegy: req.body.jegy,
    nev: req.body.nev,
    sylabus: req.body.sylabus,
    laborok: req.body.laborok,
    szeminarok: req.body.laborok,
    kurzusok: req.body.kurzusok,
    creator: req.body.creator,
  };
  console.log(material);
  const database = mongodb.db('Web');
  database.collection('tantargy').insertOne(material, (err) => {
    if (err) {
      throw err;
    } else {
      console.log('material inserted!');
      callback({ msg: 'Beszurva!', source: `api/materials/${req.body.jegy}` });
    }
  });
};

exports.insertClass = (req, callback) => {
  // const fileHandler = req.files.filename;
  const classt = {
    kod: req.query.kod,
    tipus: req.body.classtype,
    nap: req.body.day,
    ora: req.body.hour,
    terem: req.body.room,
  };
  const database = mongodb.db('Web');
  database.collection('ora').insertOne(classt, (err) => {
    if (err) {
      throw err;
    }
    console.log('class inserted!');
    callback(err);
  });
};

exports.insertSylabus = (req, callback) => {
  const database = mongodb.db('Web');
  const fileHandler = req.files.filename;
  const query = { jegy: req.query.kod };
  const newSylabus = { $set: { sylabus: path.basename(fileHandler.path) } };
  database.collection('tantargy').updateMany(query, newSylabus, (err) => {
    if (err) {
      throw err;
    } else {
      console.log('sylabus added!');
      callback(err);
    }
  });
};

exports.getMaterials = (callback) => {
  const database = mongodb.db('Web');
  database.collection('tantargy').find().toArray((err, result) => {
    if (err) throw err;
    // console.log(result);
    callback(err, result);
  });
};

exports.getClasses = (req, callback) => {
  const database = mongodb.db('Web');
  const query = { kod: req.query.kod };
  database.collection('ora').find(query).toArray((err, result) => {
    if (err) {
      throw err;
    } else {
      callback(err, result);
    }
  });
};

exports.getSylabus = (req, callback) => {
  const database = mongodb.db('Web');
  const query = { jegy: req.query.kod };
  console.log(query);
  database.collection('tantargy').findOne(query, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result[0].sylabus);
      callback(err, result[0].sylabus);
    }
  });
};

exports.deleteMaterial = (req, callback) => {
  const database = mongodb.db('Web');
  const name = req.body.nev;
  const query = { jegy: name };
  console.log(query);
  database.collection('tantargy').find(query).each((err, doc) => {
    if (err) {
      throw err;
    } else if (doc !== null) {
      const kod2 = doc.jegy;
      console.log(kod2);
      const query2 = { kod: kod2 };
      database.collection('ora').deleteMany(query2, () => {
        database.collection('tantargy').deleteOne(query, () => {
          getMaterialsBack(database, callback);
        });
      });
    }
  });
};

exports.deleteMaterialWithApi = (req, callback) => {
  const database = mongodb.db('Web');
  const { materialID } = req.params;
  const query = { jegy: materialID };
  database.collection('tantargy').findOne(query, (err, doc) => {
    if (err) {
      throw err;
    } else if (doc === null) {
      callback({ msg: 'Not found!' });
    } else {
      const kod2 = doc.jegy;
      const query2 = { kod: kod2 };
      database.collection('ora').deleteMany(query2, () => {
        database.collection('tantargy').deleteOne(query, () => {
          callback({ msg: 'Deleted!' });
        });
      });
    }
  });
};

exports.getSpecificUser = (req, callback) => {
  console.log('bent');
  const database = mongodb.db('Web');
  const name = req.user.username;
  console.log(name);
  const query = { username: name };
  database.collection('felhasznalo').findOne(query, (err, doc) => {
    if (err) {
      throw err;
    } else if (doc !== null) {
      callback(err, doc.admin);
    }
  });
};

exports.getSpecificMaterialsCreator = (req, callback) => {
  const jegykod = req.query.kod;
  const database = mongodb.db('Web');
  const query = { jegy: jegykod };
  database.collection('tantargy').findOne(query, (err, doc) => {
    if (err) {
      throw err;
    } else if (doc !== null) {
      callback(doc.creator);
    }
  });
};

exports.updateMaterialWithSpecificID = (req, callback) => {
  const { materialID } = req.params;
  const database = mongodb.db('Web');
  const query = { jegy: materialID };

  const conditions = req.body;
  const newvalues = {};
  newvalues.$set = conditions; // { $set: values };
  console.log(query);
  console.log(newvalues);
  database.collection('tantargy').updateOne(query, newvalues, (err, res) => {
    if (err) throw err;
    if (res.result.nModified !== 0) {
      callback({ msg: 'Updated!' });
    } else {
      callback({ msg: 'Material not found or no modifications were made!' });
    }
  });
};

exports.getSpecificMaterialByID = (req, callback) => {
  const { materialID } = req.params;
  console.log(materialID);
  const database = mongodb.db('Web');
  const query = { jegy: materialID };
  database.collection('tantargy').findOne(query, (err, doc) => {
    if (err) {
      throw err;
    } else {
      console.log(doc);
      callback(doc);
    }
  });
};

exports.getMaterialsWithConditions = (req, callback) => {
  const conditions = req.query;
  const splittedConditions = JSON.stringify(conditions).replace(/"|{|}/g, '').split(',');
  const conditionValues = [];
  const conditionNames = [];
  for (let i = 0; i < splittedConditions.length; i += 1) {
    conditionValues.push(splittedConditions[i].split(':')[1]);
    conditionNames.push(splittedConditions[i].split(':')[0]);
  }

  const database = mongodb.db('Web');
  const query = { };

  for (let i = 0; i < conditionValues.length; i += 1) {
    query[conditionNames[i]] = conditionValues[i];
  }
  console.log(query);
  database.collection('tantargy').find(query).toArray((err, docs) => {
    if (err) {
      throw err;
    } else {
      console.log(docs);
      callback(docs);
    }
  });
};

exports.deleteSpecificClass = (req, callback) => {
  const database = mongodb.db('Web');
  const query = {
    kod: req.body.code,
    tipus: req.body.type,
    nap: req.body.day,
    ora: req.body.hour,
    terem: req.body.room,
  };
  console.log(query);
  database.collection('ora').deleteOne(query, (err) => {
    if (err) throw err;
    console.log('torolve');
    callback(err, { del: 'sikeresen torolve' });
  });
};

exports.registerUser = (req, callback) => {
  const username1 = req.body.username;
  const password1 = req.body.password;
  const isAdmin = req.body.admin;
  const database = mongodb.db('Web');
  bcrypt.hash(password1, saltRounds, (err, hash) => {
    const user = {
      username: username1,
      password: hash,
      admin: isAdmin,
    };
    database.collection('felhasznalo').insertOne(user, (err2) => {
      if (err2) {
        throw err2;
      } else {
        database.collection('felhasznalo').find({}).toArray((err3, docs) => {
          if (err3) throw err3;
          const id = docs[docs.length - 1].username;
          console.log(id);
          storeIDInSession(callback, req, id, err2);
        });
      }
    });
  });
};

passport.serializeUser((id, done) => {
  done(null, id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});
