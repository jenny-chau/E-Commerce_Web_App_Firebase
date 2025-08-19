import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCard from './ProductCard';

export type Product = {
    "id": number;
    "title": string;
    "price": number;
    "description": string;
    "category": string;
    "image": string;
    "rating": {
        "rate": number;
        "count": number;
    }
};

// Fetch function
const fetchProducts = async ({queryKey}): Promise<Product[]> => {
    const [key, category] = queryKey; 
    if (category && category != "All") {
        const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
        return response.data;
    }
    else {
        const response = await axios.get('https://fakestoreapi.com/products');
        return response.data;
    }
};

interface ProductProps {
    category: string;
}
// Using `useQuery` to fetch products
const Products:React.FC<ProductProps> = ({category}) => {
    const { data, isLoading, error } = useQuery<Product[]>({
        queryKey: ['products', category],
        queryFn: fetchProducts
    })

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading products</p>;

    return (
        <ul className='list-unstyled d-flex flex-wrap'>
            {data?.map(product => (
            <li key={product.id} className='m-2 w-100'>
                <ProductCard {...product} />
            </li>
            ))}
        </ul>
    );
};

export default Products;