import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState, type ReactHTMLElement } from "react";
import { Button, Modal } from "react-bootstrap";
import { db } from "../firebaseConfig";
import type { Product } from "./Products";
import ProductForm from "./ProductForm";

const AddProduct: React.FC = () => {
    const [show, setShow] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    
    const submitButton = (
        <Button variant="primary" type="submit">
            Add Product
        </Button>
    )

    const handleShow = () => {setShow(true)};

    const handleHide = () => {
        setShow(false)
    };

    const handleAddProduct = async (product: Product) => {
        try {
            const ref = await addDoc(collection(db, 'products'), {...product});
            await updateDoc(ref, {docID: ref.id});
            alert("Product added!");
            handleHide();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <>
            <Button className='m-2' variant='info' onClick={handleShow}>Add Product</Button>
            
            <Modal show={show} onHide={handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductForm callback={handleAddProduct} submitButton={submitButton}/>
                    {error && <p>{error}</p>}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AddProduct;