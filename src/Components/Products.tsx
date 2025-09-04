import ProductCard from './ProductCard';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export type Product = {
    "docID": string;
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

interface ProductProps {
    category: string;
    showEditButtons: boolean;
}

const Products:React.FC<ProductProps> = ({category, showEditButtons}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let productsRef;
        if (category == 'All') {
            productsRef = collection(db, 'products');
        }
        else {
            productsRef = query(collection(db, 'products'), where("category", "==", category))
        }

        // Setup a listener to get the most up-to-date products when the user adds a new product
        const unsubscribe = onSnapshot(productsRef, (snapshot) => {
            const dataArray = snapshot.docs.map((doc) => ({
                ...doc.data(),
            })) as Product[];

            setProducts(dataArray);
            setLoading(false);

        return () => unsubscribe();
    })}, [category]); // Reruns useEffect when category changes
        
    if (loading) return <p>Loading...</p>;

    return (
        <ul className='list-unstyled d-flex flex-wrap'>
            {products.map((product, index) => (
            <li key={index} className='my-2 w-100'>
                <ProductCard product={product} showEditButtons={showEditButtons}/>
            </li>
            ))}
        </ul>
    );
};

export default Products;