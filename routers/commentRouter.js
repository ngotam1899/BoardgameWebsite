let express = require('express');
let router = express.Router();

let userController = require('../controllers/userController');

router.post('/', userController.isLoggedIn , (req, res, next) => {
	let commentController = require('../controllers/commentController');
  
  // Khởi tạo comment
  let comment = {
    userId: req.session.user.id,   // test
    productId: req.body.productId,
    message: req.body.message
  }

  // kiểm tra comment đó có phải comment con ko -> thêm vào parentCommentId
  if(!isNaN(req.body.parentCommentId) && req.body.parentCommentId !=""){
    comment.parentCommentId = req.body.parentCommentId
  }

  commentController
		.add(comment)
		.then((data) => {
      // nếu add comment thành công -> refresh lại trang web
      res.redirect('/products/' + data.productId);
			res.locals.comment = comment;
			
		})
		.catch((error) => next(error));
});

module.exports = router;
