import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const loadState = () => {
    try {
        const serializedCart = sessionStorage.getItem('shoppingCart');
        if (serializedCart === null) {
            return undefined;
        }
        return JSON.parse(serializedCart);
    } 
    catch (error) {
        console.error("Error loading state from session storage:", error);
        return undefined;
    }
};

    const preloadedCartState = loadState();

export const store = configureStore({
    reducer: cartReducer,
    preloadedState: preloadedCartState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;