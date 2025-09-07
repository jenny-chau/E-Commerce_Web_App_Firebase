import { useState } from "react";
import { Button, Container, Offcanvas } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../Redux/store';
import { clearCart } from '../../Redux/cartSlice';
import CartItemCard from "./CartItemCard";
import CheckoutButton from "./CheckoutButton";
import { updateFirestoreShoppingCart } from "./UpdateFirestoreShoppingCart";

const ShoppingCart: React.FC = () => {
    // Handle showing the shopping cart
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state:RootState) => state);

    const handleCartClear = () => {
        dispatch(clearCart());
        sessionStorage.setItem('shoppingCart', JSON.stringify({
            products: [],
            totalNumberItems: 0,
            totalPrice: 0
        }));
        updateFirestoreShoppingCart();
    }

    return (
        <div>
            <Container className="d-flex">
                <Button onClick={handleShow}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                        <span className="badge">{cart.totalNumberItems}</span>
                </Button>
            </Container>
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {cart?.products?.map((productQuantity, index) => (
                        <CartItemCard key={index} {...productQuantity} />
                    ))}
                </Offcanvas.Body>
                <Container className='d-flex flex-column mt-3'>
                    <p className='align-self-center'>Total: ${cart.totalPrice.toFixed(2) || 'loading'}</p>
                    <div className='d-flex justify-content-between m-2'>
                        <Button onClick={handleCartClear} variant='outline-secondary' size="sm">Clear</Button>
                        <CheckoutButton callback={handleClose}/>
                    </div>
                </Container>
            </Offcanvas>
        </div>
    )
}

export default ShoppingCart;