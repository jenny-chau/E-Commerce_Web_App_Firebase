import { useState, type FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import Register from "./Register";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>('');   
    
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError("Error Logging in");
            console.log(err);
        }
    };

    return (
        <Container className='col-md-6'>
            <Form onSubmit={handleLogin}>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3}>Email: </Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {setEmail(e.target.value); setError('');}}
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
                            onChange={(e) => {setPassword(e.target.value); setError('');}}
                        />
                    </Col>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
                {error && <p className="text-danger m-3">{error}</p>}
            </Form>
            <p className='m-3'>New user? <Register/></p>
        </Container>
    );
};

export default Login;