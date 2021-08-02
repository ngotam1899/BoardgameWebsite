let controller = {};
let models = require('../models');
let Squelize = require('sequelize');
let Op = Squelize.Op;
let User = models.User;
let bcrypt = require('bcryptjs')

controller.getUserByEmail = (email) => {
  return User.findOne({
    where: {username: email}
  });
}

controller.createUser = (user) =>{
  var salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
  return User.create(user)
}

controller.comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
}

// Middleware kiểm tra nếu người dùng đã đăng nhập, sẽ cho thực hiện tiếp, 
// ngược lại chuyển user sang trang login, login xong thì về lại
controller.isLoggedIn = (req, res, next) => {
  if(req.session.user){
    next();
  }
  else{
    res.redirect(`/users/login?returnURL=${req.originalUrl}`)
  }
}

module.exports = controller;