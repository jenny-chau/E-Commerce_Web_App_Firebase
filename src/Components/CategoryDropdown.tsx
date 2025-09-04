import { useEffect, useState } from "react";
import { Button, Col, Container, Dropdown, DropdownButton } from "react-bootstrap";
import Products from "./Products";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AddProduct from "./AddProduct";

export interface Category {
    category: string;
}

const CategoryDropdown: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [showEditButtons, setShowEditButtons] = useState<boolean>(false);
        
    useEffect(() => {
        // Get categories from category collection
        const categoriesRef = collection(db, 'categories')
        const unsubscribe = onSnapshot(categoriesRef, (snapshot) => {
            const dataArray = snapshot.docs.map((doc) => ({
                ...doc.data(),
            })) as Category[];

            setCategories(dataArray);
            setLoading(false);

            return () => unsubscribe();
    })}, []);
        
    if (loading) return <p>Loading...</p>;

    const handleSelect = (eventKey: string | null) => {
        if (eventKey === null) {
            return
        }
        setSelectedCategory(eventKey);
    }

    const handleShowEditButtons = () => {
        setShowEditButtons(showEditButtons ? false : true);
    }

    return(
        <Container fluid className='p-0'>
            <Container className='d-flex flex-wrap justify-content-center align-items-center m-3'>
                <p className='mx-3 my-0'>Category:</p>
                <DropdownButton title={selectedCategory} onSelect={handleSelect} variant="success">
                    <Dropdown.Item key={0} eventKey="All">All</Dropdown.Item>
                    {categories.map((category: Category, index: number) => <Dropdown.Item key={index+1} eventKey={category.category}>{category.category}</Dropdown.Item>)}
                </DropdownButton>
            </Container>
            <Container className='mb-5 pb-5'>
                <Products category={selectedCategory} showEditButtons={showEditButtons}/>
            </Container>
            <Container fluid className='fixed-bottom justify-content-end m-2 w-100'>
                <Col sm={2} style={{justifySelf: "end"}}>
                <AddProduct />
                <Button className='m-2' variant='warning' onClick={handleShowEditButtons}>Edit Products</Button>
                </Col>
            </Container>
        </Container>
    )
}

export default CategoryDropdown;