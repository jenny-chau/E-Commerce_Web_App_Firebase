import type { JSX } from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('firebase/firestore', () => {
    return {
        collection: jest.fn(() => ({ __type: 'collectionRef'})),
        addDoc: jest.fn(async (_collectionRef, _data) => ({ id: 'mock-doc-id' } as any)),
        updateDoc: jest.fn(async (_docRef, _data) => {}),
    }
});

jest.mock('../../firebaseConfig', () => ({
    db: {__type: 'fake-db'}
}))

jest.mock('../../Components/Products/ProductForm', () => ({
    __esModule: true,
    default: ({callback, submitButton}: {callback: (product: any) => void; submitButton: JSX.Element}) => {
        const mockProduct = {
            docID: '',
            title: "",
            price: 0,
            description: "",
            category: "",
            image: "",
            rating: {
                rate: 0,
                count: 0
            }
        };
        return(
            <div data-testid="product-form-mock">
                {submitButton}
                <button data-testid="mock-submit" onClick={() => callback(mockProduct)}>
                    Submit (mock)
                </button>
            </div>
        )
    }
}));

import AddProduct from '../../Components/Products/AddProduct';

describe('AddProduct', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('load ProductForm after opening the Modal and runs parent callback on success', async () => {
        const parentCallback = jest.fn((message: 'string') => {});

        render(<AddProduct callback={parentCallback}/>);

        // finish rendering AddProduct component
        expect(await screen.findByRole('button', {name: 'Add Product'})).toBeInTheDocument();
        
        // Find then click on the Add Product button
        const button = screen.getByRole('button', {name: 'Add Product'});
        fireEvent.click(button);

        // wait for mock ProductForm to load
        await screen.findByTestId('product-form-mock');

        // find the mock submit button and click it
        const formButton = screen.getByTestId('mock-submit');
        fireEvent.click(formButton);

        // wait for parent callback to be called
        await waitFor(() => 
            expect(parentCallback).toHaveBeenCalledWith('Successfully added product!')
        )
    });

    test('error message displayed after error in addDoc', async () => {
        const parentCallback = jest.fn();

        render(<AddProduct callback={parentCallback}/>);

        // make mocked addDoc return an error string
        const {addDoc} = await import('firebase/firestore');
        (addDoc as jest.Mock).mockRejectedValueOnce('addDoc error');

        // click on the Add Product button
        fireEvent.click(await screen.findByRole('button', {name: /add product/i}));
        await screen.findByTestId('product-form-mock');

        // render the mock ProductForm and click the mock submit button 
        fireEvent.click(await screen.findByTestId('mock-submit'));

        // expect the error string to be loaded and parent callback not to have been called 
        expect(await screen.findByText('addDoc error')).toBeInTheDocument();
        expect(parentCallback).not.toHaveBeenCalled();
    })
})