'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		let data = [
			{ name: 'Cờ', imagepath: '/img/home/c1.png', summary: 'Các loại cờ' },
			{ name: 'Gia đình', imagepath: '/img/home/f1.png', summary: 'Kết nối gia đình' },
			{ name: 'Trẻ em', imagepath: '/img/home/kid2.png', summary: 'Giúp trẻ phát triển' },
			{ name: 'Rút gỗ', imagepath: '/img/home/r2.png', summary: 'Luyện tính tỉ mỉ' },
			{ name: 'Rubix', imagepath: '/img/home/rub8.png', summary: 'Luyện trí thông minh' },
			{ name: 'Việt Nam', imagepath: '/img/home/u4.png', summary: 'Hàng Việt Nam chất lượng cao' },
			{ name: 'Quốc tế', imagepath: '/img/home/v2.png', summary: 'Hàng quốc tế khỏi chê' }
		];
		// Bắt buộc phải thêm định nghĩa 2 thuộc tính (createdAt - updatedAt)
		data.map((item) => {
			item.createdAt = Sequelize.literal('NOW()');
			item.updatedAt = Sequelize.literal('NOW()');
			return item;
		});
		return queryInterface.bulkInsert('Categories', data, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('Categories', null, {});
	}
};
