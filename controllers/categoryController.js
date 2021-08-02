let controller = {};
let models = require('../models');
let Category = models.Category;
let Squelize = require('sequelize');
let Op = Squelize.Op;

controller.getAll = (query) => {
	return new Promise((resolve, reject) => {
		let options = {
			attributes: [ 'id', 'name', 'imagepath', 'summary' ],
			include: [{
				model: models.Product,
				where: {}
			}] //lấy khóa ngoại
		};
		//thêm vào if(query) vì hàm getAll() này đc gọi từ phía indexRouter
		if (query && query.search != '') {
			options.include[0].where.name = {
				[Op.iLike]: `%${query.search}%`
			};
		}
		Category.findAll(options).then((data) => resolve(data)).catch((error) => reject(new Error(error)));
	});
};

module.exports = controller;
