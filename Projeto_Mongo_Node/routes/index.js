var express = require('express');
//var mongoose = require('mongoose');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';


/* GET home page. */
router.get('/', function(req, res, next) {

  mongoClient.connect(url, function(err, db){
    if (err) throw err;
      console.log("Conectado");  
    var dbo = db.db("internacao");
    dbo.collection('internacao').find({}).toArray(function(er, result){
      if (er) throw er;
      //console.log(result);
      res.render('index', { title: 'Pacientes', nomes: result });
      db.close();
    });
  }); 
});

router.post('/request', function(req, res, next) {
  console.log('AQUI')

  var request_method = req.body._request_method
  var elem_id = req.body._element_id
  var cod = req.body.cod
  var nome = req.body.nome
  var idade = req.body.idade

  obj = {
    "cod" : cod,
    "nome" : nome,
    "idade" : idade
  }

  if(request_method === 'delete'){

    mongoClient.connect(url, function(err, db){
      if (err) throw err;
      var dbo = db.db("internacao");
      dbo.collection('internacao').deleteOne({ cod: elem_id}, function(er, result){
        if (er) throw er;
        res.redirect('/')
        db.close();
      });
    });

  }
  else{

    mongoClient.connect(url, function(err, db){
      if (err) throw err;
      var dbo = db.db("internacao");

      console.log('FABIOOOOOOOO'+obj.cod)

      dbo.collection('internacao').findOne({ cod: obj.cod}, function(er, result){
        if (er) throw er;

        // something found -> update
console.log('FABIOOOOOOOO::'+result)

        if(result){

            mongoClient.connect(url, function(err, db){
              if (err) throw err;
              var dbo = db.db("internacao");
              dbo.collection('internacao').updateOne(
                {"_id" : result._id },
                { $set: {"nome": obj.nome} } 
              , function(er, result){
                if (er) throw er;
                res.redirect('/')
                db.close();
              });
            });

        }
        // nothing found -> insert
        else{

          mongoClient.connect(url, function(err, db){
            if (err) throw err;
            var dbo = db.db("internacao");
            dbo.collection('internacao').insertOne(obj, function(er, result){
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
