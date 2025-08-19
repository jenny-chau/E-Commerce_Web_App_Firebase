import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Container, Dropdown, DropdownButton } from "react-bootstrap";
import Products from "./Products";

const fetchCategories = async (): Promise<string[]> => {
    const response = await axios.get('https://fakestoreapi.com/products/categories');
    return response.data;
};

const CategoryDropdown: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            setSelectedCategory(eventKey);
        }
    }

    const { data, isLoading, error } = useQuery<string[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories
    })

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading products</p>;

    return(
        <Container>
            <Container className='d-flex flex-wrap justify-content-center align-items-center m-3'>
                <p className='mx-3 my-0'>Category:</p>
                <DropdownButton title={selectedCategory} onSelect={handleSelect} variant="warning">
                    <Dropdown.Item key={0} eventKey="All">All</Dropdown.Item>
                    {data?.map((category: string, index: number) => <Dropdown.Item key={index+1} eventKey={category}>{category}</Dropdown.Item>)}
                </DropdownButton>
            </Container>
            <Products category={selectedCategory}/>
        </Container>
    )
}

export default CategoryDropdown;