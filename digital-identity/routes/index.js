var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/passport-form',function(req,res,next){
  res.render('passport-form');
});

router.get('/government-form',function(req,res,next){
  res.render('government-form');
});


module.exports = router;
