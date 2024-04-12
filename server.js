// import express from 'express';
// import dotenv from 'dotenv';
// import stripe from 'stripe';
// import bodyParser from "body-parser";
// import mongoose from "mongoose";


var express = require('express');
var dotenv = require('dotenv');
var stripe = require('stripe');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//import Order from "/js/order.js"


//const main = require("main.js")


// Load variables
dotenv.config();

// Start Server
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Home Route
app.get('/', (req, res) => {
    res.sendFile('index.html', {root: 'public'});
});


//start here
//Success
app.get('/sucess', (req, res) => {
    res.sendFile('sucess.html', {root: 'public'});
});

//Cancel
app.get('/cancel', (req, res) => {
    res.sendFile('cancel.html', {root: 'public'});
});

//Stripe
let stripeGateway = stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

app.post('/stripe-checkout', async (req, res) => {
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, '') * 100);
        console.log('item-price:', item.price);
        console.log('unitAmount:', unitAmount);
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    //paymentId: Date.now().toString(), 
                    name: item.title,
                    images: [item.productImg]
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        };
    });
    console.log('lineItems:', lineItems);
    //create Checkout Session
    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${DOMAIN}/sucess`,
        cancel_url: `${DOMAIN}/cancel`,
        line_items: lineItems,

        //Asking Address in stripe checkout Page
        billing_address_collection: 'required'
    });
    
    res.json(session.url);
});


//cart database

const Order = require('./public/js/order');
async function addToCart(userId, cartItems, price, name){
    try{

        const orderItems = [];

        for (const cartItem of cartItems) {
            const orderItem = {
                title: cartItem.title,
                quantity: cartItem.quantity,
                price: cartItem.price
            };
            orderItems.push(orderItem);
        }

        const order = new Order({
        user: userId,
        items: orderItems,
        price: price,
        name: name
    });
   order.save()
  .then(savedOrder => {
    console.log("Order saved:", savedOrder);
  })
  .catch(error => {
    console.error("Error saving order:", error);
  });
    }catch (error){
        console.error("Error saving order:", error);
        throw error;
    }
}

// Assuming you have valid userId, cartId, address, name, and paymentId
const userId = new mongoose.Types.ObjectId(); // Replace this with the actual user ID
const cartItems = [
    { title: "product 2", quantity: 2, price: 10 },
  { title: "Product 2", quantity: 1, price: 20 }
]
const address = "123 Main St, City, Country";
const name = "John Doe";



addToCart(userId, cartItems, address, name)
    .then(() => {
        console.log("Order added successfully");
    })
    .catch((error) => {
        console.error("Error adding order:", error);
    });









//correct start

//Cart Database

//var Order = require('./public/js/main')
// const Order = require('./public/js/order');
// async function addToCart(userId, cartId, address, name){
//     try{
//         var order = new Order({
//         user: userId,
//         cart: cartId,
//         address: address,
//         name: name
//     });
//    order.save()
//   .then(savedOrder => {
//     console.log("Order saved:", savedOrder);
//   })
//   .catch(error => {
//     console.error("Error saving order:", error);
//   });
//     }catch (error){
//         console.error("Error saving order:", error);
//         throw error;
//     }
// }

// // Assuming you have valid userId, cartId, address, name, and paymentId
// const userId = new mongoose.Types.ObjectId(); // Replace this with the actual user ID
// const cartId = new mongoose.Types.ObjectId();
// const address = "123 Main St, City, Country";
// const name = "John Doe";



// addToCart(userId, cartId, address, name)
//     .then(() => {
//         console.log("Order added successfully");
//     })
//     .catch((error) => {
//         console.error("Error adding order:", error);
//     });


//correct end











//Sign Up database

app.use(bodyParser.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}));


mongoose.connect('mongodb://localhost:27017/mydb-new',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=> console.log("Error in connecting to Database"));
db.once('open', ()=>console.log("Connected to Database"));

app.post("/sign_up",(req,res)=>{
    var id = Date.now().toString();
    var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;
    

    var data = {
        "id": id,
        "name": name,
        "email": email,
        "phno": phno,
        "password": password
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Sucessfuly");
    });

    return res.redirect('signup_success.html');
})

app.get("/sign_up",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": "*"
    })
    return res.redirect('signup.html');
})
app.get("/login", (req,res) =>{
    res.render("login.html")
});


//end here
app.listen(3030, () => {
    console.log('listening on port 3030;');
});

