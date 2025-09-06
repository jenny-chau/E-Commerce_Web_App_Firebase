import { Button, Modal } from "react-bootstrap";
import { auth, db } from "../../firebaseConfig";
import { deleteUser, signOut } from "firebase/auth";
import {deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const DeleteAccount: React.FC = () => {
    const [show, setShow] = useState<boolean>(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const user = auth.currentUser;
    const navigate = useNavigate();
    
    const handleDelete = async () => {
        if (user) {
            try {
                await deleteDoc(doc(db, "users", user.uid)) // delete document from Firestore
                await deleteUser(user); // delete user from firebase
                
                // sign out and navigate back to login/register page
                await signOut(auth);
                handleClose();
                navigate("/");
            } catch (err: any) {
                console.log(err);
            }
        } else {
            console.log("No user to delete");
        }
    }

    return (
        <>
            <Button variant='danger' onClick={handleShow}>Delete Account</Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your account?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} className='m-1'>
                        No, take me back!
                    </Button>
                    <Button variant="danger" onClick={handleDelete} className='m-1'>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DeleteAccount;