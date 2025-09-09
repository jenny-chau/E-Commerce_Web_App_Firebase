jest.mock('firebase/firestore', () => {
  return {
    doc: jest.fn((db, col, id) => ({ __type: 'docRef', db, col, id })),
    updateDoc: jest.fn(async (_ref, _data) => {}),
  };
});

jest.mock('../../firebaseConfig', () => ({
  auth: { currentUser: null },
  db: { __type: 'fake-db' },
}));

import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

import { updateFirestoreShoppingCart } from '../../Components/ShoppingCart/UpdateFirestoreShoppingCart';

describe('updateFirestoreShoppingCart', () => {
    beforeEach(() => {
        // Reset storage and mocks between tests
        sessionStorage.clear();
        jest.clearAllMocks();
        // ensure auth starts as null unless a test sets it
        (auth as any).currentUser = null;
    });

    test('Integration test: updates Firestore when user is logged in and cart exists', async () => {
        // setup fake user + cart saved to sesionStorage
        (auth as any).currentUser = { uid: 'mock-user-id' };
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
        const cartString = JSON.stringify([mockProduct]);
        sessionStorage.setItem('shoppingCart', cartString);

        // run component
        await updateFirestoreShoppingCart();

        // check doc was called in updateFirestoreShoppingCart component
        expect(doc).toHaveBeenCalledWith(db, 'shoppingCart', 'mock-user-id');

        // Grab the exact doc ref we created so we can check updateDoc called with it
        const ref = (doc as jest.Mock).mock.results[0].value;
        expect(updateDoc).toHaveBeenCalledWith(ref, { cart: cartString });
    });

    test('Firestore is not updated if no user is logged in', async () => {
        // set no user
        (auth as any).currentUser = null;
        sessionStorage.setItem('shoppingCart', '{"anything":true}');

        await updateFirestoreShoppingCart();

        expect(doc).not.toHaveBeenCalled();
        expect(updateDoc).not.toHaveBeenCalled();
    });

    test('Firestore is not updated if there is no cart in sessionStorage', async () => {
        // set user logged in but with a missing cart
        (auth as any).currentUser = { uid: 'mock-user-id' };
        sessionStorage.removeItem('shoppingCart'); // ensure null

        await updateFirestoreShoppingCart();

        expect(doc).toHaveBeenCalledWith(db, 'shoppingCart', 'mock-user-id');
        expect(updateDoc).not.toHaveBeenCalled();
    });
});
