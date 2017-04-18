var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	
	res.render('index', { title: 'I.H. Botman', description: 'Does Something Yet Undecided by Author'});

});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About', description: 'Does Something Yet Undecided by Author' });
});

module.exports = router;
