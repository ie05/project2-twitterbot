var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	
	res.render('index', { title: 'Jack Robo Burton', description: 'You know what ol\' Jack Burton always says at a time like this?'});

});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', description: 'Ol\' Jack always says... what the hell?' });
});

module.exports = router;
