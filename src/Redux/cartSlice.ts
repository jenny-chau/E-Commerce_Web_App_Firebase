import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../Components/Products';

export interface ProductQuantity {
    product: Product,
    quantity: number
}

export interface CartState {
    products: ProductQuantity[],
    totalNumberItems: number,
    totalPrice: number
}

const initialState: CartState = {
    products: [],
    totalNumberItems: 0,
    totalPrice: 0
};

const storeToSession = (state: CartState) => {
    sessionStorage.setItem('shoppingCart', JSON.stringify(state));
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setProductState: () => {
            const sessionData = sessionStorage.getItem('shoppingCart');
            
            if (sessionData) {
                const parsedData: CartState = JSON.parse(sessionData);
                return parsedData;
            } else {
                return initialState;
            }
        },
        addProduct: (state, action: PayloadAction<Product>) => {
            const productToAdd: ProductQuantity = {product: action.payload, quantity: 1};
            const existingProductInCart = state.products.find(product => product.product.docID === productToAdd.product.docID)
            if (existingProductInCart) {
                existingProductInCart.quantity++;
            }
            else {
                state.products.push(productToAdd);
            }
            state.totalNumberItems += 1;
            state.totalPrice += productToAdd.product.price;
            storeToSession(state);
        },
        removeProduct: (state, action: PayloadAction<Product>) => {
            const existingProductInCart = state.products.find(product => product.product.docID === action.payload.docID)
            if (!existingProductInCart){
                console.log("Item not found in cart")
                return;
            }
            state.totalNumberItems -= existingProductInCart.quantity;
            state.totalPrice -= existingProductInCart.quantity * existingProductInCart.product.price;

            state.products = state.products.filter(products => products.product.docID !== action.payload.docID);
            storeToSession(state);
        },
        decrementProductQuantity: (state, action: PayloadAction<Product>) => {
            const existingProductInCart = state.products.find(product => product.product.docID === action.payload.docID)
            if (!existingProductInCart){
                console.log("Item not found in cart")
                return;
            }
            if (existingProductInCart.quantity == 1) {return}
            else {
                existingProductInCart.quantity--;

                state.totalNumberItems -= 1;
                state.totalPrice -= action.payload.price;
                storeToSession(state);
            }
        },
        incrementProductQuantity: (state, action: PayloadAction<Product>) => {
            const existingProductInCart = state.products.find(product => product.product.docID === action.payload.docID)
            if (!existingProductInCart){
                console.log("Item not found in cart")
                return;
            }
            existingProductInCart.quantity++;

            state.totalNumberItems += 1;
            state.totalPrice += action.payload.price;
            storeToSession(state);
        },
        clearCart: () => {
            return initialState;
        },
    },
});

export const { addProduct, removeProduct, decrementProductQuantity, incrementProductQuantity, clearCart, setProductState } = cartSlice.actions;
export default cartSlice.reducer;