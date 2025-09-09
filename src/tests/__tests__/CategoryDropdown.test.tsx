import { render, screen, within, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Firestore
jest.mock('firebase/firestore', () => {
    const mockDocs = [
        { data: () => ({ category: 'Shirt' }) },
        { data: () => ({ category: 'Pants' }) },
    ];
    return {
        collection: jest.fn(() => ({ __type: 'collectionRef' })),
        onSnapshot: jest.fn((ref, callback) => {
            const snapshot = { docs: mockDocs };
            const timer = setTimeout(() => callback(snapshot), 1);

            return () => clearTimeout(timer); // unsubscribe
        }),
    };
});

// Mock the firebase config
jest.mock('../../firebaseConfig', () => ({
    db: { __type: 'fake-db' },
}));

// Mock Products component
jest.mock('../../Components/Products/Products', () => ({
    __esModule: true,
    default: ({ category, showEditButtons }: { category: string; showEditButtons: boolean }) => (
        <div data-testid="product-mock">
            Category: <span data-testid="product-mock-cat">{category}</span> | Edit:{' '}
            <span data-testid="product-edit">{String(showEditButtons)}</span>
        </div>
    ),
}));

// Mock AddProduct component
jest.mock('../../Components/Products/AddProduct', () => ({
    __esModule: true,
    default: ({ callback }: { callback: (msg: string) => void }) => (
        <button onClick={() => callback('Saved!')} aria-label="trigger-alert">
        Trigger Alert
        </button>
    ),
}));

import CategoryDropdown from '../../Components/CategoryDropdown';

describe('CategoryDropdown', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading then shows dropdown with categories from Firestore', async () => {
        render(<CategoryDropdown />);

        // initial loading
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

        // wait for rendering to finish
        await screen.findByTestId('product-mock');
        
        const button = document.getElementById('category-dropdown') as HTMLButtonElement | null;
        expect(button).toBeInTheDocument();

        // open the dropdown
        await userEvent.click(button!);

        const list = screen.queryByRole('menu', { hidden: true }) || document.body;
        expect(within(list).getByRole('button', { name: 'Shirt' })).toBeInTheDocument();
        expect(within(list).getByRole('button', { name: 'Pants' })).toBeInTheDocument();
    });

    test('changes selected category on click and passes it to Products', async () => {
        render(<CategoryDropdown />);

        // wait for rendering to finish
        await screen.findByTestId('product-mock');
        
        const button = document.getElementById('category-dropdown') as HTMLButtonElement | null;
        expect(button).toBeInTheDocument();

        // open the dropdown
        await userEvent.click(button!);
        await userEvent.click(screen.getByRole('button', { name: 'Shirt' }));

        // dropdown title updates
        const shirtButtons = await screen.findAllByRole('button', { name: 'Shirt' });
        expect(shirtButtons).toHaveLength(2);

        const allButtons = await screen.findAllByRole('button', { name: 'All' });
        expect(allButtons).toHaveLength(1);

        // Mock products component received the prop
        expect(screen.getByTestId('product-mock-cat').textContent).toBe('Shirt');
    });

    test('toggles edit mode when "Edit Products" is clicked', async () => {
        render(<CategoryDropdown />);
        expect(await screen.findByTestId('product-edit')).toHaveTextContent('false');

        await userEvent.click(screen.getByRole('button', { name: /Edit Products/i }));
        expect(screen.getByTestId('product-edit')).toHaveTextContent('true');

        await userEvent.click(screen.getByRole('button', { name: /Edit Products/i }));
        expect(screen.getByTestId('product-edit')).toHaveTextContent('false');
    });

    test('shows a success alert from AddProduct callback and auto-hides after 5s', async () => {
        jest.useFakeTimers();

        render(<CategoryDropdown />);

        await act(async () => {
            jest.advanceTimersByTime(1);
        });

        const alertButton = await screen.findByRole('button', { name: /trigger-alert/i });
        fireEvent.click(alertButton);

        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Saved!');

        await act(async () => {
            jest.advanceTimersByTime(5000);
        });

        expect(screen.queryByRole('alert')).toBeNull();

        jest.useRealTimers();
    });
});