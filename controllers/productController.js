let controller = {};
let models = require('../models');
let Product = models.Product;
let Squelize = require('sequelize');
let Op = Squelize.Op;

controller.getTrengdingProducts = () => {
	return new Promise((resolve, reject) => {
		Product.findAll({
			order: [ [ 'overallReview', 'DESC' ] ],
			limit: 8,
			include: [ { model: models.Category } ],
			attributes: [ 'id', 'name', 'imagepath', 'price' ]
		})
			.then((data) => resolve(data))
			.catch((error) => reject(new Error(error)));
	});
};
controller.getAll = (query) => {
	return new Promise((resolve, reject) => {
		//SELECT PRODUCTS.name FROM PRODUCTS INNER JOIN CATEGORIES
		//Vì thông tin sản phẩm có kèm Category name -> inner model CATEGORIES vào
		let options = {
			include: [ { model: models.Category } ],
			attributes: [ 'id', 'name', 'imagepath', 'price', 'categoryId' ],
			where: {
				price: {
					[Op.gte]: query.min, //greater than equal
					[Op.lte]: query.max //less than equal
				}
			}
		};
		// SELECT PRODUCTS.name FROM PRODUCTS INNER JOIN CATEGORIES
		// WHERE PRODUCTS.categoryId = query.category
		if (query.category > 0) {
			options.where.categoryId = query.category;
		}
		// SELECT PRODUCTS.name FROM PRODUCTS INNER JOIN CATEGORIES
		// WHERE PRODUCTS.brandId = query.brand
		if (query.brand > 0) {
			options.where.brandId = query.brand;
		}
		// SELECT PRODUCTS.name FROM PRODUCTS INNER JOIN CATEGORIES, PRODUCTCOLORS
		// WHERE PRODUCTCOLORS.colorId = query.color
		if (query.color > 0) {
			options.include.push({
				model: models.ProductColor,
				attributes: [],
				where: { colorId: query.color }
			});
		}
		if (query.limit > 0) {
			options.limit = query.limit;
			//offset: biểu diễn lấy từ ... đến ...
			//VD: lấy 9 sản phẩm (limit = 9) và mở trang thứ 2 (page = 2)
			//offset = 9 * (2 - 1) = 9 --> Lấy sản phẩm thứ 9 -> 18
			options.offset = query.limit * (query.page - 1);
		}
		if (query.sort) {
			switch (query.sort) {
				case 'name':
					options.order = [ [ 'name', 'ASC' ] ]; //tên theo alphabeth
					break;
				case 'price':
					options.order = [ [ 'price', 'ASC' ] ]; //giá tăng
					break;
				case 'overallReview':
					options.order = [ [ 'overallReview', 'DESC' ] ]; //số sao giảm dần
					break;
				default:
					options.order = [ [ 'name', 'ASC' ] ];
			}
		}
		if (query.search != '') {
			options.where.name = {
				[Op.iLike]: `%${query.search}%`
			};
		}
		Product.findAndCountAll(options) //trả về {rows,count} findAndCountAll có sẵn
			.then((data) => resolve(data))
			.catch((error) => reject(new Error(error)));
	});
};
controller.getById = (id) => {
	return new Promise((resolve, reject) => {
		let product;
		Product.findOne({
			where: { id: id },
			include: [ { model: models.Category } ]
		})
			//Một cách kết bảng tương tự include nhưng ct chạy nhanh hơn
			//Kết bảng ProductSpec và Spec và Product
			.then((result) => {
				product = result;
				return models.ProductSpecification.findAll({
					//1 product có nhiều đặc tả
					where: { productId: id },
					include: [ { model: models.Specification } ]
				});
			})
			.then((productSpecifications) => {
				product.ProductSpecifications = productSpecifications; //gán data
				return models.Comment.findAll({
					where: { productId: id, parentCommentId: null }, //lấy những comment cha
					include: [
						{ model: models.User },
						{
							model: models.Comment,
							as: 'SubComments',											
							include: [ { model: models.User } ]
						}
					]
				});
			})
			.then((comments) => {
				product.Comments = comments;
				return models.Review.findAll({
					where: { productId: id },
					include: [ { model: models.User } ]
				});
			})
			.then((reviews) => {
				product.Reviews = reviews;
				let stars = [];
				for (let i = 1; i <= 5; i++) {
					stars.push(reviews.filter((item) => item.rating == i).length);
					// mảng star bao gôm số lượng các review (1<rating<5)
					// VD: star[1] = số lượng tất cả các review có rating là 1
				}
				product.stars = stars;
				resolve(product);
			})
			.catch((error) => reject(new Error(error)));
	});
};
module.exports = controller;
