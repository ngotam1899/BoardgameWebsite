let controller = {};
let models = require('../models');
let Color = models.Color;
let Squelize = require('sequelize');
let Op = Squelize.Op;

controller.getAll = (query) => {
	return new Promise((resolve, reject) => {
		// SELECT COLORS.name FROM 
		// (SELECT COLORS.name FROM COLORS INNER JOIN PRODUCTCOLORS) 
		// INNER JOIN PRODUCTS 
		let options = {
			attributes: [ 'id', 'name', 'imagepath', 'code' ],
			include: [
				{
					model: models.ProductColor,
					include: [
						{
							model: models.Product,
							attributes: [],
							where: {
								price: {
									[Op.gte]: query.min, //greater than equal
									[Op.lte]: query.max //little than equal
								}
							}
						}
					]
				}
			] //lấy khóa ngoại
		};
		if (query.category > 0) {
			options.include[0].include[0].where.categoryId = query.category;
		}
		if (query.search != '') {
			options.include[0].include[0].where.name = {
				[Op.iLike]: `%${query.search}%`
			};
		}
		if (query.brand > 0) {
			options.include[0].include[0].where.brandId = query.brand;
		}
		Color.findAll(options)
		.then((data) => resolve(data))
		.catch((error) => reject(new Error(error)));
	});
};

module.exports = controller;
