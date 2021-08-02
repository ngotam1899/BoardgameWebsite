let controller = {};
let models = require('../models');
let Squelize = require('sequelize');
let Op = Squelize.Op;
let Review = models.Review

controller.add = (review) => {
	return new Promise((resolve, reject)=>{
    Review
    .findOne({  //một người dùng chỉ được review 1 lần
      where: {
        userId: review.userId,
        productId: review.productId
      }
    })
    .then((data) =>{  //nếu người này đã review rồi thì cho phép sửa review
      if(data){
        return Review.update(review, {
          where: {
            userId: review.userId,
            productId: review.productId
          }
        })
      }
      else{ //nếu chưa thì tạo mới
        return Review.create(review)
      }
    })
    // cập nhật 2 thuộc tính overallReview & reviewCount của Product
    .then((data) => {
      models.Product.findOne({
        where: { id: review.productId }, 
        include: [{ model: models.Review }]
      })
      .then(product =>{
        //tính trung bình rating
        let overallReview = 0;
        for (let i=0; i<product.Reviews.length; i++){
          overallReview += product.Reviews[i].rating;
        }
        overallReview = (overallReview / product.reviewCount).toFixed(2);
        
        // cập nhật lại Product đó
        models.Product.update({
          overallReview, 
          reviewCount : product.Reviews.length
        },{
          where: { id : product.id }
        })
      })
    })
    .then((data) => resolve(data))
    .catch(error => reject(new Error(error)));
  })
};

controller.getUserReviewProduct = (userId, productId) =>{
  return Review.findOne({
    where: {
      userId, productId
    }
  })
}

module.exports = controller;
