import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../Components/Products';

export interface ProductQuantity {
    product: Product,
    quantity: number
}

interface CartState {
    products: ProductQuantity[],
    totalNumberItems: number,
    totalPrice: number
}

const initialState: CartState = {
    products: [],
    totalNumberItems: 0,
    totalPrice: 0
};

const storeToSessionStorage = (state: CartState) => {
    sessionStorage.setItem('shoppingCart', JSON.stringify(state));
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            const productToAdd: ProductQuantity = {product: action.payload, quantity: 1};
            const existingProductInCart = state.products.find(product => product.product.id === productToAdd.product.id)
            if (existingProductInCart) {
                existingProductInCart.quantity++;
            }
            else {
                state.products.push(productToAdd);
            }
            state.totalNumberItems += 1;
            state.totalPrice += productToAdd.product.price;
            storeToSessionStorage(state);
        },
        removeProduct: (state, action: PayloadAction<Product>) => {
            const existingProductInCart = state.products.find(product => product.product.id === action.payload.id)
            if (!existingProductInCart){
                console.log("Item not found in cart")
                return;
            }
            state.totalNumberItems -= existingProductInCart.quantity;
            state.totalPrice -= existingProductInCart.quantity * existingProductInCart.product.price;

            state.products = state.products.filter(products => products.product.id !== action.payload.id);
            storeToSessionStorage(state);
        },
        decrementProductQuantity: (state, action: PayloadAction<Product>) => {
            const existingProductInCart = state.products.find(product => product.product.id === action.payload.id)
            if (!existingProductInCart){
                console.log("Item not found in cart")
                return;
            }
            if (existingProductInCart.quantity == 1) {return}
            else {
                existingProductInCart.quantity--;

                state.totalNumberItems -= 1;
                state.totalPrice -=
                action.payload.price;
                storeToSessionStorage(state);
            }
        },
        incrementProductQuantity: (state, action: PayloadAction<Product>) => {
            const existingProductInCart = state.products.find(product => product.product.id === action.payload.id)
            if (!existingProductInCart){
                console.log("Item not found in cart")
                return;
            }
            existingProductInCart.quantity++;

            state.totalNumberItems += 1;
            state.totalPrice += action.payload.price;
            storeToSessionStorage(state);
        },
        clearCart: (state) => {
            state.products = [];
            state.totalNumberItems = 0;
            state.totalPrice = 0;
            storeToSessionStorage(state);
        },
    },
});

export const { addProduct, removeProduct, decrementProductQuantity, incrementProductQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;