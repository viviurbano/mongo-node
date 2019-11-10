var express = require('express');
//var mongoose = require('mongoose');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';


/* GET home page. */
router.get('/', function (req, res, next) {

  mongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Conectado");
    var dbo = db.db("controle_internacao");
    dbo.collection('controle_internacao').find({}).toArray(function (er, result) {
      if (er) throw er;
      //console.log(result);
      res.render('index', { title: 'Pacientes', nomes: result });
      db.close();
    });
  });
});

router.post('/request', function (req, res, next) {

  var request_method = req.body._request_method
  var elem_id = req.body._element_id
  var cod = req.body.cod
  var nome = req.body.nome
  var endereco = req.body.endereco
  var dt_nascto = req.body.dt_nascto
  var telefone = req.body.telefone
  var sexo = req.body.sexo
  var tipo_sanguineo = req.body.tipo_sanguineo

  obj = {
    "cod": cod,
    "nome": nome,
    "endereco": endereco,
    "dt_nascto": dt_nascto,
    "telefone": telefone,
    "sexo": sexo,
    "tipo_sanguineo": tipo_sanguineo

  }

  if (request_method === 'delete') {

    mongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("controle_internacao");
      dbo.collection('controle_internacao').deleteOne({ cod: elem_id }, function (er, result) {
        if (er) throw er;
        res.redirect('/')
        db.close();
      });
    });

  }
  else {

    mongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("controle_internacao");

      dbo.collection('controle_internacao').findOne({ cod: obj.cod }, function (er, result) {
        if (er) throw er;

        if (result) {

          mongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("controle_internacao");
            dbo.collection('controle_internacao').updateOne(
              { "_id": result._id },
              { $set: { "nome": obj.nome, 
                        "endereco": obj.endereco,
                        "dt_nascto": obj.dt_nascto,
                        "telefone": obj.telefone,
                        "sexo": obj.sexo,
                        "tipo_sanguineo": obj.tipo_sanguineo  } }
              , function (er, result) {
                if (er) throw er;
                res.redirect('/')
                db.close();
              });
          });

        }
        // nothing found -> insert
        else {

          mongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("controle_internacao");
            dbo.collection('controle_internacao').insertOne(obj, function (er, result) {
              if (er) throw er;
              res.redirect('/')
              db.close();
            });
          });

        }
      });

    });

  }

});

module.exports = router;
