import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../Redux/store';
import { clearCart } from '../../Redux/cartSlice';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import Login from '../User/Login';
import { updateFirestoreShoppingCart } from './UpdateFirestoreShoppingCart';

interface CheckoutButtonProps {
    callback: () => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({callback}) => {
    const [show, setShow] = useState<boolean>(false);
    const [showLogin, setShowLogin] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state: RootState) => state);
    const user = auth.currentUser;
    
    const handleClose = () => {
        setShow(false);
        callback();
    }
    const handleCheckout = async () => {
        if (cart.products.length == 0) {
            callback(); // closes the shopping cart without showing the 'successfully checked out' message
        }
        else if (cart.products.length > 0) {
            if (user) {
                const data = {
                    items: cart.products,
                    totalPrice: cart.totalPrice,
                    totalItems: cart.totalNumberItems,
                    uid: user.uid,
                }

                try {
                    const q = query(collection(db, "orders"), where("uid", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    
                    await addDoc(collection(db, 'orders'), {...data, createdAt: serverTimestamp(), orderNumber: querySnapshot.docs.length+1}); //not the best way to set orderNumber, but works since orders can't be deleted by user
                    
                    // reset redux cart and session storage
                    dispatch(clearCart());
                    sessionStorage.setItem('shoppingCart', JSON.stringify({
                        products: [],
                        totalNumberItems: 0,
                        totalPrice: 0
                    }));
                    updateFirestoreShoppingCart();

                    // show the successfully checked out message
                    setShow(true);
                } catch (err: any) {
                    console.log(err);
                }
            } else {
                setShowLogin(true);
                console.log("Not logged in");
            }
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

            <Modal show={showLogin} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Login/>
            </Modal>
        </>
    );
}

export default CheckoutButton;