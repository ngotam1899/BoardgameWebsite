let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');

router.post('/', userController.isLoggedIn, (req, res, next) => {
	let reviewController = require('../controllers/reviewController');
  
  // Khởi tạo review
  let review = {
    userId: req.session.user.id,   // test
    productId: req.body.productId,
    message: req.body.messageReview,
    rating: req.body.rating
  }

  reviewController
		.add(review)
		.then(() => {
      // nếu add review thành công -> refresh lại trang web
      res.redirect('/products/' + review.productId);
			res.locals.review = review;
		})
		.catch((error) => next(error));
});

module.exports = router;
