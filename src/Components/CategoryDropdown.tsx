import { useEffect, useState } from "react";
import { Alert, Button, Container, Dropdown, DropdownButton } from "react-bootstrap";
import Products, { type Product } from "./Products/Products";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AddProduct from "./Products/AddProduct";

export interface Category {
    category: string;
}

const CategoryDropdown: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const [showEditButtons, setShowEditButtons] = useState<boolean>(false);

    // show/hide alerts for adding/editing/deleteing products
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Get categories from category collection
        const categoriesRef = collection(db, 'categories')

        // set up listener to update list of categories when a new category is added
        const unsubscribe = onSnapshot(categoriesRef, (snapshot) => {
            const dataArray = snapshot.docs.map((doc) => ({
                ...doc.data(),
            })) as Category[];

            setCategories(dataArray);
            setLoading(false);
        });
        
        return () => unsubscribe();
    }, []);
        
    if (loading) return <p>Loading...</p>;

    // Handle user's category selection
    const handleSelect = (eventKey: string | null) => {
        if (eventKey === null) {
            return
        }
        setSelectedCategory(eventKey);
    }

    // shows the edit/delete buttons no products when user clicks "Edit Products" button
    const handleShowEditButtons = () => {
        setShowEditButtons(showEditButtons ? false : true);
    }

    // handle showing a success alert 
    const handleShowAlert = (message: string, product?: Product) => {
        // redirect to specific category of added product (or stay on 'All' products)
        if (product && selectedCategory != "All") {
            setSelectedCategory(product.category);
        }
        
        setAlertMessage(message);
        setShowAlert(true);
        // show alert of 5 seconds (users may also close the alert manually)
        setTimeout(() => {
            setShowAlert(false);
        }, 5000);
    }

    return(
        <Container fluid className='p-0'>
            {showAlert && <Alert className='fixed-top alert' variant='success' onClose={()=> setShowAlert(false)} dismissible>{alertMessage}</Alert>}

            <Container className='d-flex flex-wrap justify-content-center align-items-center m-3'>
                <p className='mx-3 my-0'>Category:</p>
                <DropdownButton id="category-dropdown" title={selectedCategory} onSelect={handleSelect} variant="success">
                    <Dropdown.Item key={0} eventKey="All" id='category-all-option'>All</Dropdown.Item>
                    {categories.map((category: Category, index: number) => <Dropdown.Item key={index+1} eventKey={category.category}>{category.category}</Dropdown.Item>)}
                </DropdownButton>
            </Container>
            <Container className='mb-5 pb-5'>
                <Products category={selectedCategory} showEditButtons={showEditButtons} alertCallback={handleShowAlert}/>
            </Container>
            <Container fluid className='fixed-bottom justify-content-end bg-light m-0 p-0'>
                <AddProduct callback={handleShowAlert}/>
                <Button className='m-2' variant='warning' onClick={handleShowEditButtons}>Edit Products</Button>
            </Container>
        </Container>
    )
}

export default CategoryDropdown;