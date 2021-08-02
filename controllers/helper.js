let helper ={};

helper.createStarList = (stars) =>{
    let str=`<ul class="list">
    <li><a href="#">5 Star <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i
             class="fa fa-star"></i><i class="fa fa-star"></i> ${stars[4]}</a></li>
    <li><a href="#">4 Star <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i
             class="fa fa-star"></i><i class="fa fa-star disabled"></i> ${stars[3]}</a></li>
    <li><a href="#">3 Star <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i
             class="fa fa-star disabled"></i><i class="fa fa-star disabled"></i> ${stars[2]}</a></li>
    <li><a href="#">2 Star <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star disabled"></i><i
             class="fa fa-star disabled"></i><i class="fa fa-star disabled"></i> ${stars[1]}</a></li>
    <li><a href="#">1 Star <i class="fa fa-star"></i><i class="fa fa-star disabled"></i><i class="fa fa-star disabled"></i><i
             class="fa fa-star disabled"></i><i class="fa fa-star disabled"></i> ${stars[0]}</a></li>
</ul>`;
    return str;
};
//hiển thị số sao vàng tương ứng

helper.createStar = (star) =>{
    let str=  ``;
    let i;
    //hiện thị tổng số sao vàng mà người dùng đánh giá
    for (i=1;i<=star;i++){
        str+='<i class="fa fa-star"></i>';
    }
    //ngược lại màu xám
    for(i= star + 1; i<=5;i++){
        str+='<i class="fa fa-star disabled"></i>';
    }
    return str;
}

module.exports=helper;
