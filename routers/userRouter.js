let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');

router.get('/login', (req, res, next) => {
  req.session.returnURL = req.query.returnURL
  res.render('login');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  let fullname = req.body.fullname;
  let email = req.body.username;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  let keepLoggedIn = (req.body.keepLoggedIn != undefined);   

  // Kiểm tra confirmPassword = password
  if(password != confirmPassword){
    return res.render('register',{
      message: 'Confirm password does not match',
      type: 'alert-danger'
    });
  }
  // Kiểm tra username chưa tồn tại
  userController
  .getUserByEmail(email)
  .then(user =>{
    if(user){
      return res.render('register',{
        message: `Email ${email} exists! Please choose another email`,
        type: 'alert-danger'
      });
    }
    // Khởi tạo user
    user = {
      fullname,
      username: email,
      password
    };
    // -> tạo tài khoản
    return userController
      .createUser(user)
      .then(user =>{
        if(keepLoggedIn){
          req.session.cookie.maxAge = 60*60*1000; //lưu session trong 60 phút
          req.session.user = user;  // lưu lại thông tin user vào session
          return res.render('/')
        }
        else{
          return res.render('login',{
            message: 'You have registered, now please login!',
            type: 'alert-success'
          });
        }
      })
    
  })
  .catch((error) => next(error))
})

router.post('/login', (req, res, next) => {
  let email = req.body.username;
  let password = req.body.password;
  let keepLoggedIn = (req.body.keepLoggedIn != undefined);  

  // Kiểm tra email có tồn tại hay chưa
  userController.getUserByEmail(email)
  .then(user =>{
    // Kiểm tra password
    if(user){
      if(userController.comparePassword(password, user.password)){
        // password: password người dùng nhập
        // user.password: password trong CSDL (hash)
        req.session.cookie.maxAge = keepLoggedIn ? 60*60*1000 : null; //lưu session trong 60 phút
        req.session.user = user;

        if(req.session.returnURL){
          res.redirect(req.session.returnURL);
        }
        else{
          res.redirect('/');
        }
      }
      else{
        res.render('login',{
          message: `Incorrect password!`,
          type: 'alert-danger'
        });
      }
    }
    else{
      res.render('login',{
        message: `Email ${email} does not exist`,
        type: 'alert-danger'
      });
    }
  })
  .catch((error) => next(error))
})

router.get('/logout', (req, res, next)=>{
  req.session.destroy(error =>{
    if(error){
      return next(error);
    }
    res.locals.username = 'Login'
    return res.render('login');
  })
})

module.exports = router;
