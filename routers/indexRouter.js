let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
	let categoryController = require('../controllers/categoryController');
	categoryController
		.getAll(req.query)
		.then((data) => {
			res.locals.categories = data;
			let productController = require('../controllers/productController');
			return productController.getTrengdingProducts();
		})
		.then((data) => {
			res.locals.trendingProducts = data;
			res.render('index');
		})
		.catch((error) => next(error));
});

module.exports = router;
