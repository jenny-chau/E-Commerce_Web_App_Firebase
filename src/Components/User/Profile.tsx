import type React from "react";
import PageLayout from "../PageLayout";
import { auth, db } from "../../firebaseConfig";
import { Container, Row, Col, Button, Form, Image, Alert } from "react-bootstrap";
import { useEffect, useState, type FormEvent } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import DeleteAccount from "./DeleteAccount";

interface UpdateProfileKeys {
    displayName?: string,
    photoURL?: string,
    phoneNumber?: string,
    address?: string,
}

const Profile: React.FC = () => {
    const user = auth.currentUser;

    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [phoneNum, setPhoneNum] = useState<string>("");
    const [photoURL, setPhotoURL] = useState<string>("");
    const [isValid, setIsValid] = useState<boolean>(true);
    const [isFormDisabled, setIsFormDisabled] = useState<boolean>(true);

    const [showAlert, setShowAlert] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get profile data from Firestore
        const fetchData = async () => {
            if (user){
                const querySnapshot = await getDoc(doc(db, 'users', user.uid));
                if (querySnapshot.exists()) {
                    const dataArray = {...querySnapshot.data()};
                    setName(dataArray.displayName);
                    setPhoneNum(dataArray.phoneNumber);
                    setPhotoURL(dataArray.photoURL);
                    setAddress(dataArray.address);
                } else {
                    console.log("No such document!");
                }
            }
        };
        fetchData();
    }, []);

    // Regex to validate a 10-digit phone number
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        const newPhoneNumber = e.target.value;
        setPhoneNum(newPhoneNumber);
        setIsValid(phoneRegex.test(newPhoneNumber));
        if (newPhoneNumber == "") {setIsValid(true)};
    };
        
    const handleUpdate = async (e: FormEvent) => {
        e.preventDefault();        
        if (user) {
            try {
                // Check if phone number is valid
                if (!isValid) {
                    throw error;
                }

                // update user profile in Firestore
                const updatedUser: UpdateProfileKeys = {
                    displayName: name,
                    photoURL: photoURL,
                    phoneNumber: phoneNum,
                    address: address,
                }
                const userDoc = doc(db, 'users', user.uid);
                await updateDoc(userDoc, {...updatedUser});

                // Reset state
                setIsFormDisabled(true);
                setError("");

                // Show success alert for 5 seconds (or user's can manually close the alert)
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 5000)
            } catch (err: any) { 
                setError("Error Updating Profile");
                console.log(err);
            }
        }
    };

    return (
        <PageLayout>
            {user ? 
                <>
                {showAlert && <Alert variant='success' dismissible onClose={()=>setShowAlert(false)} className='alert fixed-top'>Successfully updated user profile!</Alert>}

                <h2>Profile</h2>
                <Container className='col-md-6'>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Name: </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isFormDisabled}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Phone Number: </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    placeholder="(XXX) XXX-XXXX"
                                    value={phoneNum}
                                    onChange={handlePhoneChange}
                                    isInvalid={!isValid && phoneNum.length > 0}
                                    disabled={isFormDisabled}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Address: </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    placeholder="Full Address, City, State, Zip Code"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    disabled={isFormDisabled}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm={3}>Photo URL: </Form.Label>
                            <Col sm={9}>
                                <Form.Control 
                                    type="text" 
                                    value={photoURL}
                                    onChange={(e) => setPhotoURL(e.target.value)}
                                    disabled={isFormDisabled}
                                />
                            </Col>
                            {photoURL && <Image src={photoURL} alt={photoURL} className='profile_image my-2'/>}
                        </Form.Group>
                        {isFormDisabled && <Button variant='warning' onClick={() => setIsFormDisabled(false)}>
                        Update Profile
                        </Button>}
                        {!isFormDisabled && <Button variant="primary" type="submit">
                            Update
                        </Button>}
                        {error && <p className="text-danger m-3">{error}</p>}
                    </Form>
                    <br/>
                    <DeleteAccount/>
                    </Container>
                </>
                : <div>Please login.</div>}
        </PageLayout>
    )
}

export default Profile;