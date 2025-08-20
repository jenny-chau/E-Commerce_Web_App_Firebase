import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../Redux/store';
import { clearCart } from '../Redux/cartSlice';

interface CheckoutButtonProps {
    callback: () => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({callback}) => {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state);
    
    const handleClose = () => {
        setShow(false);
        callback();
    }
    const handleCheckout = () => {
        if (cart.products.length == 0) {
            callback(); // closes the shopping cart without showing successful checkout modal
        }
        else if (cart.products.length > 0) {
            dispatch(clearCart());
            setShow(true);
        }
    }

    return (
        <>
            <Button onClick={handleCheckout}>
                Checkout
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Successful Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Thank you for shopping at Coins! Your order has successfully been checked out. Have a great day!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Continue Shopping
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CheckoutButton;