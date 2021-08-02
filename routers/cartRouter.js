let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
	var cart = req.session.cart;
	res.locals.cart = cart.getCart();
	res.render('cart');
});

router.post('/', (req, res, next) => {
	// lấy thông tin của product được thêm
	var productId = req.body.id;
	var quantity = isNaN(req.body.quantity) ? 1 : req.body.quantity;
	var productController = require('../controllers/productController');
	productController
		.getById(productId)
		.then((product) => {
			// ép kiểu đối tượng được add dạng json
			var cartItem = req.session.cart.add(product, productId, quantity);
			res.json(cartItem);
		})
		.catch((error) => next(error));
});

router.put('/', (req,res,next) => {
	var productId = req.body.id;
	var quantity = parseInt(req.body.quantity);
	var cartItem = req.session.cart.update(productId, quantity);
	// sau khi cập nhật, trả về thông tin của cart
	res.json(cartItem)
});

router.delete('/', (req,res,next) => {
	var productId = req.body.id;
	req.session.cart.remove(productId);
	// sau khi xóa, trả về totalQuantity và totalPrice
	res.json({
		totalQuantity: req.session.cart.totalQuantity,
		totalPrice: req.session.cart.totalPrice
	})
});

router.delete('/all', (req,res,next) => {
	req.session.cart.empty();
	res.sendStatus(204);
	res.end();
});

module.exports = router;
