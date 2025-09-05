import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactElement } from "react";
import { Form, Row, Col, Image } from "react-bootstrap";
import { db } from "../../firebaseConfig";
import type { Category } from "../CategoryDropdown";
import type { Product } from "./Products";

interface ProductFormProps {
    callback: (product: Product) => void;
    existingProduct?: Product;
    submitButton: ReactElement;
}

const ProductForm: React.FC<ProductFormProps> = ({callback, existingProduct, submitButton}) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const [categories, setCategories] = useState<Category[]>([]);
    const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
    const [customCategory, setCustomCategory] = useState<string>('');

    const initialState: Product = {
        docID: '',
        title: "",
        price: 0,
        description: "",
        category: "",
        image: "",
        rating: {
            rate: 0,
            count: 0
        }
    }

    const [product, setProduct] = useState<Product>(initialState);

    const handleCategoryDropdown = (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value == "other") {
            setShowCustomInput(true);
        } else {
            setShowCustomInput(false);
            setCustomCategory('');
            setProduct(prev => ({...prev, category: e.target.value}));
        }
    }

    const handleCustomCategoryInput = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomCategory(e.target.value);
        setProduct(prev => ({...prev, category: e.target.value}));
    }

    useEffect(() => {
        if (existingProduct) {
            setProduct({...existingProduct});
        }
        // Get categories from category collection
        const categoriesRef = collection(db, 'categories')
        const unsubscribe = onSnapshot(categoriesRef, (snapshot) => {
            const dataArray = snapshot.docs.map((doc) => ({
                ...doc.data(),
            })) as Category[];

            setCategories(dataArray);
            setLoading(false);

            return () => unsubscribe();
    })}, [existingProduct]);

    const handleAddProduct = async (e: FormEvent) => {
            e.preventDefault();
            try {
                // add category to category collection if it's a new category
                if (customCategory) {
                    await addDoc(collection(db, 'categories'), {category: product.category});
                }
                setShowCustomInput(false);
                setCustomCategory('');
                setError('');
                callback({...product});
            } catch (err: any) {
                setError(err.message);
            }
        };
    
    if (loading) {return <p>Loading...</p>}

    return (
        <>
            <Form onSubmit={handleAddProduct}>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Title: </Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="product title"
                                value={product.title}
                                onChange={(e) => setProduct(prev => ({...prev, title: e.target.value}))}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Description: </Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                placeholder="product description"
                                value={product.description}
                                onChange={(e) => setProduct(prev => ({...prev, description: e.target.value}))}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Category: </Form.Label>
                        <Col sm={9}>
                            <Form.Select required defaultValue={existingProduct?.category || ''} onChange={handleCategoryDropdown}>
                                <option value="">Category</option>
                                {categories.map((category, index) => <option key={index} value={category.category}>{category.category}</option>)}
                                <option value="other">New Category</option>
                            </Form.Select>
                            {showCustomInput && (
                                <Form.Control
                                    type="text"
                                    placeholder="Enter custom category"
                                    value={customCategory}
                                    onChange={handleCustomCategoryInput}
                                    className="mt-2"
                                />
                            )}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Price: </Form.Label>
                        <Col sm={9}>
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="product price"
                                value={product.price}
                                onChange={(e) => setProduct(prev => ({...prev, price: parseFloat(e.target.value)}))}
                                min="0.01"
                                step="0.01"
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Product Image URL: </Form.Label>
                        <Col sm={9}>
                            <Form.Control 
                                type="text" 
                                value={product.image}
                                onChange={(e) => setProduct(prev => ({...prev, image: e.target.value}))}
                                required
                            />
                        </Col>
                        {product.image && <Image src={product.image} alt={product.image} className='my-2 add-product-image'/>}
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        {submitButton}
                    </div>
                    {error && <p className="text-danger m-3">{error}</p>}
                </Form>
        </>
    )
}

export default ProductForm;