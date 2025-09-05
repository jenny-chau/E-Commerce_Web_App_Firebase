import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { db } from "../../firebaseConfig";
import type { Product } from "./Products";
import ProductForm from "./ProductForm";

export interface EditProductProps {
    currentProduct: Product,
    alertCallback: (message: string) => void
}

const EditProduct: React.FC<EditProductProps> = ({currentProduct, alertCallback}) => {
    const submitButton = (
        <Button variant="warning" type="submit">
            Edit
        </Button>
    )

    const [show, setShow] = useState<boolean>(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleEdit = async (product: Product) => {
        try {
            const ref = doc(db, "products", product.docID);
            await updateDoc(ref, {...product})
            handleClose();
            alertCallback(`Successfully updated ${product.title}`);
        } catch (err: any) {
            console.log(err.message);
        }
    }

    return (
        <>
            <Button className='mx-2 mt-1' variant='warning' onClick={handleShow}>Edit</Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductForm callback={handleEdit} existingProduct={currentProduct} submitButton={submitButton}/>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default EditProduct;