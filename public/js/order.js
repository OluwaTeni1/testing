//var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

//var schema = new Schema({
  //  cart: {type: Object, required: true},
   // paymentId: {type: String, required: true}
//}) 



// const submit = document.querySelector('.btn-buy');

// submit.addEventListener('click', () => {
//     fetch('/cart-save', {
//         method: 'post',
//         headers: new Headers({'Content-Type': 'application/Json'}),
//         body:JSON.stringify({
//             items: JSON.parse(localStorage.getItem('cartItems')),
//         }),
//     })
//     .then((res) => res.json())
//     .catch((err) => console.log(err));
// });



// // Send item data to backend
//     fetch('/api/cart', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(newItem)
//     })
//       .then(response => response.json())
//       .then(data => {
//         console.log(data.message);
//         // Refresh cart items after adding new item
//         fetchCartItems();
//       })





var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({

    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Schema.Types.ObjectId, ref: 'cartContent'},
    name: {type: String, required: true}
});

module.exports = mongoose.model('Order', schema);