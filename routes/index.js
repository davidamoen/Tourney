var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/history', function(req, res) {
	var fs = require('fs');
	res.setHeader('Content-Type', 'application/json');
	fs.readFile('data/history.js', 'utf8', function(err, data) {
		res.json(data);
	});
});

module.exports = router;
