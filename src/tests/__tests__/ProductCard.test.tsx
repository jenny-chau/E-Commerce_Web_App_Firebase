jest.mock('../../firebaseConfig', () => ({
  auth: { currentUser: null },
  db: { __type: 'fake-db' },
}));

// mock UpdateFirestoreShoppingCart component
jest.mock('../../Components/ShoppingCart/UpdateFirestoreShoppingCart', () => ({
    updateFirestoreShoppingCart: jest.fn(),
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from '../../Components/Products/ProductCard';
import { addProduct } from '../../Redux/cartSlice';
import { updateFirestoreShoppingCart } from '../../Components/ShoppingCart/UpdateFirestoreShoppingCart';
import cartReducer from '../../Redux/cartSlice';

// make a test cart reducer for the shopping cart
function makeStore() {
    return configureStore({
        reducer: {
        cart: cartReducer,
        },
    });
}

const mockProduct = {
    docID: '1',
    title: "Shirt",
    price: 30,
    description: "Shirt Description",
    category: "Shirt",
    image: "Shirt image",
    rating: {
        rate: 0,
        count: 0
    }
};

describe('ProductCard - Add to Cart integration', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('dispatches addProduct(product) and calls updateFirestoreShoppingCart()', () => {
        const store = makeStore();

        // Spy on dispatch so we can assert the exact action object
        const dispatchSpy = jest.spyOn(store, 'dispatch');

        render(
            <Provider store={store}>
                <ProductCard
                    product={mockProduct}
                    showEditButtons={false}
                    alertCallback={jest.fn()}
                />
            </Provider>
        );

        // click the “Add to Cart” button
        fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

        // expect correct dispatched action to have been called
        expect(dispatchSpy).toHaveBeenCalledWith(addProduct(mockProduct));

        const state = store.getState();
        expect(state.cart.products).toStrictEqual([{ product: {...mockProduct}, quantity: 1 }]);
        expect(state.cart.totalNumberItems).toStrictEqual(1);
        expect(state.cart.totalPrice).toStrictEqual(30);


        // updateFirestoreShoppingCart called once after dispatch
        expect(updateFirestoreShoppingCart).toHaveBeenCalledTimes(1);

        // check session storage shopping cart data
        expect(sessionStorage.getItem('shoppingCart')).toBe(JSON.stringify({products: [{ product: {...mockProduct}, quantity: 1 }], totalNumberItems: 1, totalPrice: 30}))
    });
});