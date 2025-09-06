import { useState, type FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../Redux/store";
import { clearCart } from '../../Redux/cartSlice';


const Register = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [error, setError] = useState<string | null>(null);

    const initialCartState = {
        products: [],
        totalNumberItems: 0,
        totalPrice: 0
    }
    const dispatch = useDispatch<AppDispatch>();

    const [showAlert, setShowAlert] = useState<boolean>(false);
    
    const [show, setShow] = useState<boolean>(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setEmail("");
        setPassword("");
        setError('');
    }

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;

            if (user) {
                // Create user document in Firestore
                const userRef = doc(db, "users", user.uid); 
                await setDoc(userRef, {email: email, displayName: "", phoneNumber: "", photoURL: "", address: ""});

                // Create shopping cart document in Firestore
                const cartRef = doc(db, "shoppingCart", user.uid); 
                dispatch(clearCart()); // clear Redux cart in case not cleared yet
                await setDoc(cartRef, {cart: JSON.stringify(initialCartState)});
                sessionStorage.setItem('shoppingCart', JSON.stringify({
                    products: [],
                    totalNumberItems: 0,
                    totalPrice: 0
                }));

                // reset state
                setEmail("");
                setPassword("");

                // show successful registration alert for 5 seconds (users may manually close the alert)
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000)
            } else {
                console.log("No user found")
            }
        } catch (err: any) {
            setError(err);
        }
    };

    return (
        <>
            {showAlert && <Alert variant='success' dismissible onClose={()=>setShowAlert(false)} className='alert fixed-top'>Successfully Registered! Welcome!</Alert>}
            <Button onClick={handleShow} variant="secondary">Register</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegister}>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Email: </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Password: </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="primary" type="submit">
                                Register
                            </Button>
                        </div>
                        {error && <p className="text-danger m-3">{error}</p>}
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Register;
