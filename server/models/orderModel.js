import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
products:[
    {
        type:mongoose.ObjectId,
        ref:"products"
    }
],
quantities:[
    {
        productId: {
            type: mongoose.ObjectId,
            ref: "products",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 0
        }
    }
],
customer:{
        type:mongoose.ObjectId,
        ref:"users"
},
status:{
    type:String,
    default:"Not processed",
    enum:["Not processed","processing","Shipped","Out For Delivery","Delivered","Canceled"]
},
totalcash:{
type:Number
},
estimatedDeliveryDate:{
    type:Date,
    required:true
},
maxDeliveryDuration:{
    type:Number, //////
    required:true
}
},{timestamps:true})

const orderModel = mongoose.model('Order', orderSchema);

export default orderModel;