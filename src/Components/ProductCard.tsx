import { Button, Card } from "react-bootstrap";
import type { Product } from "./Products";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../Redux/store';
import { addProduct } from '../Redux/cartSlice';

const ProductCard: React.FC<Product> = (product) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleAddProduct = () => {
        dispatch(addProduct(product));
    }

    return (
        <Card style={{justifySelf: "center"}} className="h-100 shadow-sm p-1 w-100">
            <Card.Body className="product-card-body d-flex flex-wrap h-100 justify-content-between align-items-center text-center">
                <Card.Img style={{height: "15rem"}} className="product-details-img object-fit-scale" src={product.image} alt={`Image of ${product.title}`}/>
                <div className='product-details-text p-3'>
                    <Card.Title className="p-2 m-0 text-dark fs-4">{product.title}</Card.Title>
                    <Card.Text className='p-1'><small><strong>Category: </strong>{product.category}</small> </Card.Text>
                    <Card.Text className="text-dark fs-6"><strong>Rating:</strong> {product.rating.rate}/5 ({product.rating.count})</Card.Text>
                    <Card.Text className="text-dark fs-6">{product.description}</Card.Text>
                    <Card.Text className="text-dark fs-3"> ${product.price.toFixed(2)}</Card.Text>
                    <Button onClick={handleAddProduct}>Add to Cart</Button>
                </div>
            </Card.Body>
        </Card>
    )
}

export default ProductCard;