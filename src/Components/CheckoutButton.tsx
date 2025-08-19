import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../Redux/store';
import { clearCart } from '../Redux/cartSlice';

interface CheckoutButtonProps {
    callback: () => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({callback}) => {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    
    const handleClose = () => {
        setShow(false);
        callback();
    }
    const handleCheckout = () => {
        dispatch(clearCart());
        setShow(true);
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