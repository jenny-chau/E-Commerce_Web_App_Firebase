import ProductCard from './ProductCard';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

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
    alertCallback: (message: string) => void;
}

const Products:React.FC<ProductProps> = ({category, showEditButtons, alertCallback}) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // state to determine whether to display the "No product found" message
    const [noProducts, setNoProducts] = useState<boolean>(true);

    useEffect(() => {
        setNoProducts(true);

        // determine firestore product reference based on whether a specific category is selected
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
                docID: doc.id,
                ...doc.data(),
            })) as Product[];

            // hide the "No Products Found" message
            if (dataArray.length != 0) {
                setNoProducts(false);
            }
            setProducts(dataArray);
            setLoading(false);
        });
        
        return () => unsubscribe();
    }, [category]); // Reruns useEffect when category changes
        
    if (loading) return <p>Loading...</p>;
    if (noProducts) return <p>No Products Found</p>;

    return (
        <ul className='list-unstyled d-flex flex-wrap'>
            {products.map((product) => (
            <li key={product.docID} className='my-2 w-100'>
                <ProductCard product={product} showEditButtons={showEditButtons} alertCallback={alertCallback}/>
            </li>
            ))}
        </ul>
    );
};

export default Products;