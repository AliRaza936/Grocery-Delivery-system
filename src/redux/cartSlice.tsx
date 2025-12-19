import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity:number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ICartSlice{
cartData:IGrocery[] ,
subTotal:number,
deliveryfee:number,
finalTotal:number
}
const initialState:ICartSlice ={
    cartData:[],
    subTotal:0,
        deliveryfee:90,
        finalTotal:90

}


const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
       addToCart:(state,action:PayloadAction<IGrocery>)=>{
            state.cartData.push(action.payload)
            cartSlice.caseReducers.calculateTotal(state)
       },
       increaseQuantity:(state,action:PayloadAction<mongoose.Types.ObjectId>)=>{
        const item = state.cartData.find(i=>i?._id==action.payload)
        if(item){
            item.quantity = item.quantity +1
        }
            cartSlice.caseReducers.calculateTotal(state)

       },
       decreaseQuantity:(state,action:PayloadAction<mongoose.Types.ObjectId>)=>{
  const item = state.cartData.find(i=>i?._id==action.payload)
        if(item?.quantity && item.quantity>1){
            item.quantity = item.quantity -1
        }else{
            state.cartData = state.cartData.filter(i=>i?._id != action.payload)
        }
            cartSlice.caseReducers.calculateTotal(state)

       },
       removeFromCart:(state,action:PayloadAction<mongoose.Types.ObjectId>)=>{
         state.cartData = state.cartData.filter(i=>i?._id != action.payload)
            cartSlice.caseReducers.calculateTotal(state)

       },
       calculateTotal:(state)=>{
            state.subTotal = state.cartData.reduce((sum,item)=>sum + Number(item.price)*item.quantity,0)
            state.deliveryfee = state.subTotal > 500 ? 0 : 90
            state.finalTotal = state.subTotal + state.deliveryfee
       }
    }
})

export const {addToCart,increaseQuantity,decreaseQuantity,removeFromCart} = cartSlice.actions
export default cartSlice.reducer