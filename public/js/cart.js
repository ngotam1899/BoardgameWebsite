$(document).ready(() => {
	$('.add-to-cart').on('click', addToCart);
});

// Khi gọi hàm addToCart(), POST data lên Server.
// Thành công thì cập nhật lại số lượng sản phẩm trong giỏ hàng lên giao diện
function addToCart() {
	var id = $(this).data('id'); // data-id={{id}}
	var quantity = $('#sst') ? $('#sst').val() : 1;
	$.ajax({
		url: '/cart',
		type: 'POST',
		data: { id, quantity },
		success: function(result) {
			$('#cart-badge').html(result.totalQuantity);
		}
	});
}

updateCart = (id, quantity) => {
	if (quantity == 0) removeCartItem(id);
	else {
		updateCartItem(id, quantity);
	}
};

removeCartItem = (id) => {
	$.ajax({
		url: `/cart`,
		type: 'DELETE',
		data: { id },
		success: function(result) {
			// cập nhật lại totalQuantity và totalPrice trên giao diện
			$('#cart-badge').html(result.totalQuantity);
			$('#totalPrice').html('$' + result.totalPrice);
      if(result.totalQuantity > 0){
        // xóa thanh sản phẩm {{id}} muốn delete
			  $(`#item${id}`).remove();
      }
			else{ // thông báo empty
        $('#cart-body').html('<div class="alert alert-info text-center">Your cart is empty</div>');
      }
		}
	});
};

updateCartItem = (id, quantity) => {
  $.ajax({
    url: `/cart`,
		type: 'PUT',
		data: { id, quantity },
		success: function(result) {
			// cập nhật lại totalQuantity và totalPrice trên giao diện
			$('#cart-badge').html(result.totalQuantity);
			$('#totalPrice').html('$' + result.totalPrice);

			// cập nhật lại price khi thay đổi quantity
			$(`#price${id}`).html('$' + result.item.price)
		}
  })
};

clearCart = () =>{
  if(confirm('Do you really want to remove all items?')){
    $.ajax({
		url: `/cart/all`,
		type: 'DELETE',
		success: function() {
			// cập nhật lại totalQuantity và totalPrice trên giao diện
			$('#cart-badge').html(0);
			$('#cart-body').html('<div class="alert alert-info text-center">Your cart is empty</div>');
		}
	  });
  }
}
