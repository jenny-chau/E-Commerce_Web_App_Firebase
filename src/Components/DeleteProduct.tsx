import { Button, Modal } from "react-bootstrap";
import { db } from "../firebaseConfig";
import {deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";

export interface DeleteProductProps {
    productDocID: string;
    handleParentClose?: () => void;
}

const DeleteProduct: React.FC<DeleteProductProps> = ({productDocID, handleParentClose}) => {
    const [show, setShow] = useState<boolean>(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "products", productDocID))
            handleClose();
            if (handleParentClose) {
                handleParentClose();
            }
        } catch (err: any) {
            console.log(err.message);
        }
    }

    return (
        <>
            <Button variant='danger' onClick={handleShow} className='mx-2'>Delete</Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} className='m-1'>
                        No, keep it!
                    </Button>
                    <Button variant="danger" onClick={handleDelete} className='m-1'>
                        Yes!
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DeleteProduct;