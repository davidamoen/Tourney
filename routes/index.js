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

		res.json(JSON.parse(data));
	});
});

router.post('/saveHistory', function(req, res) {
	var obj = req.body;
	var fs = require('fs');

	console.log(req.body);

	fs.writeFile('data/history.js', JSON.stringify(req.body, null, 4), function(err, data) {
		res.json({"success": "true"});
	});
});

module.exports = router;
