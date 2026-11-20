import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/basket";


interface BasketState {
    basket: Basket | null
}

const initialState: BasketState = {
    basket: null
}

export const basketSlice = createSlice({
    name:'basket',
    initialState, 
    reducers:{
        setBasket: (state, action: PayloadAction<Basket | null>) =>{
            state.basket = action.payload
        }
    }
})
export const {setBasket} = basketSlice.actions;
