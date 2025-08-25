import { useState, type FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const [show, setShow] = useState<boolean>(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, "users", user.uid); 
                await setDoc(userRef, {email: email, displayName: "", phoneNumber: "", photoURL: "", address: ""});
                setEmail("");
                setPassword("");
                alert("Registration successful!");
            } else {
                console.log("No user found")
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <>
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