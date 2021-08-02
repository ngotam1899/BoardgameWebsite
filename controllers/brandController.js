let controller = {};
let models = require('../models');
let Brand = models.Brand;
let Squelize = require('sequelize');
let Op = Squelize.Op;

controller.getAll = (query) => {
	return new Promise((resolve, reject) => {
		// SELECT BRANDS.name FROM BRANDS INNER JOIN PRODUCTS 
		// WHERE PRODUCTS.price > query.min AND PRODUCTS.price < query.max
		let options = {
			attributes: [ 'id', 'name', 'imagepath' ],
			include: [{
					model: models.Product,
					attributes: [ 'id' ], //productId
					where: {
						price: {
							[Op.gte]: query.min, //greater than equal
							[Op.lte]: query.max //little than equal
						}
					}
				}] 
		};
		// SELECT BRANDS.name FROM BRANDS INNER JOIN PRODUCTS 
    // WHERE PRODUCTS.categoryId = query.category
		if (query.category > 0) {
			options.include[0].where.categoryId = query.category;
		}
		if (query.search != '') {
			options.include[0].where.name = {
				[Op.iLike]: `%${query.search}%`
			};
		}
		// SELECT BRANDS.name (SELECT BRANDS.name FROM BRANDS INNER JOIN PRODUCTS) 
		// INNER JOIN PRODUCTCOLORS 
		// WHERE PRODUCTCOLORS.colorId = query.color
		if (query.color > 0) {
			options.include[0].include = [
				{
					model: models.ProductColor,
					attributes: [],
					where: { colorId: query.color }
				}
			];
		}
    Brand.findAll(options)
    .then((data) => resolve(data))
    .catch((error) => reject(new Error(error)));
	});
};

module.exports = controller;
