//Video Part 6: 8m24s
let express = require('express');
let app =express();

/* Ignore lỗi allowInsecurePrototypeAccess */ 
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
/* Ignore lỗi allowInsecurePrototypeAccess */ 

// Cấu hỉnh folder public
app.use(express.static(__dirname + '/public'));

//Use View Engine
let expressHBs=require('express-handlebars');
//đăng ký sử dụng helper.js
let helper=require('./controllers/helper');
//đăng ký sử dụng paginate - phân trang
let paginateHelper=require('express-handlebars-paginate');

let hbs=expressHBs.create({
    extname:'hbs',
    defaultLayout:'layout',
    layoutsDir:__dirname + '/views/layouts',
    partialsDir:__dirname + '/views/partials',
    helpers: {
        createStarList:helper.createStarList,
        createStar:helper.createStar,
        createPagination:paginateHelper.createPagination
    },
    handlebars: allowInsecurePrototypeAccess(Handlebars) /* Ignore lỗi allowInsecurePrototypeAccess */ 
});
app.engine('hbs',hbs.engine);
app.set('view engine','hbs');

//sử dụng body-parser
let bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//sử dụng cookie-parser
let cookieParser=require('cookie-parser');
app.use(cookieParser());

//sử dụng session
let session=require('express-session');
app.use(session({   //cookie lưu đc tối đa 30 ngày
    cookie : { httpOnly : true, maxAge : null }, //30*24*60*60*1000 : 30 ngày*giờ*phút*giây*(<giây)
    secret : 'S3cret',
    resave : false,
    saveUninitialized : false
}));

//sử dụng cartController
let Cart=require('./controllers/cartController');
app.use((req, res, next)=> {
    //lưu giỏ hàng trong session, khiến cho trang nào cũng load đc giỏ hàng
    //nếu cart có trong bộ nhớ (session) thì lấy thông tin có sẵn, ngược lại thì khởi tạo cart rỗng
    var cart = new Cart(req.session.cart ? req.session.cart : {});    //khởi tạo giỏ hàng
    
    //lưu lại giỏ hàng vào bộ nhớ (session)
    req.session.cart = cart;

    //lấy ra thông tin giỏ hàng để hiển thị
    res.locals.totalQuantity = cart.totalQuantity;

    // Khi user login, nếu login thành công, lưu user vào session:
    // req.session.user = userData
    // Tạo 2 biến username, isLoggedIn để hiển thị trạng thái login
    res.locals.username = req.session.user ? req.session.user.username.slice(0,7) : '';
    res.locals.isLoggedIn = req.session.user ? true : false;

    next();
});

//Định nghĩa đường link dẫn
// '/ => index '
app.use('/', require('./routers/indexRouter'));
// '/products' => category
app.use('/products',require('./routers/productRouter'));
// '/cart'
app.use('/cart',require('./routers/cartRouter'));
// '/comments'
app.use('/comments',require('./routers/commentRouter'));
// '/reviews'
app.use('/reviews',require('./routers/reviewRouter'));
// '/users'
app.use('/users',require('./routers/userRouter'));

//Định nghĩa router để tạo database
app.get('/sync',(req,res)=>{
    let models=require('./models');
    models.sequelize.sync().then(()=>{
        res.send(`Database sync completed`);
    });
});


//Giới hạn banner
app.get('/:page',(req,res)=>{
   let banners = {
        blog:'Our blog',
        //category: 'Shop Category',
        cart:'Shopping Cart',
        checkout: 'Checkout',
        confirmation:'Shop Category',
        contact: 'Contact Us',
        login:'Login/Register',
        register: 'Register'
        //single-blog: 'Blog Details',
        //single-product:'Shop Single',
        //tracking-order: 'Order Tracking'
    };
    let page = req.params.page;
    res.render(page,{banner: banners[page]});
});

//Khởi tạo Server Epreess
app.set('port',process.env.PORT || 8000); 
//Biến PORT có giá trị là 5000 (local host), khi chạy trên môi trường 
//web sẽ thay đổi thành biến riêng cho từng MT

//Server lắng nghe yêu cầu từ người dùng
app.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`); 
    // Khi start server, thành công, xuất ra để ktra 
});
