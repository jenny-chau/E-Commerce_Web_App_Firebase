import { Button, Card, Col, Row } from "react-bootstrap";
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
            <Card.Body className="">
                <Row>
                    <Col md={4} className="d-flex align-items-center justify-content-center">
                        <Card.Img className="product-details-img object-fit-scale" src={product.image} alt={`Image of ${product.title}`}/>
                    </Col>
                    <Col md={8}>
                        <div className='p-3'>
                            <Card.Title className="p-2 m-0 text-dark product-text">{product.title}</Card.Title>
                            <Card.Text className='product-text'><strong>Category: </strong>{product.category}</Card.Text>
                            <Card.Text className="product-text"><strong>Rating:</strong> {product.rating.rate}/5 ({product.rating.count})</Card.Text>
                            <Card.Text className="product-description-text">{product.description}</Card.Text>
                            <Card.Text className="fs-4"> ${product.price.toFixed(2)}</Card.Text>
                            <Button onClick={handleAddProduct}>Add to Cart</Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default ProductCard;