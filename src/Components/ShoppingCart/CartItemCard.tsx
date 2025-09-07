import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../Redux/store';
import { removeProduct, decrementProductQuantity, incrementProductQuantity, type ProductQuantity } from '../../Redux/cartSlice';
import { updateFirestoreShoppingCart } from "./UpdateFirestoreShoppingCart";

const CartItemCard: React.FC<ProductQuantity> = ({product, quantity}) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleDeleteProduct = () => {
        dispatch(removeProduct(product));
        updateFirestoreShoppingCart();
    }

    const handleDecrement = () => {
        dispatch(decrementProductQuantity(product))
        updateFirestoreShoppingCart();
    }

    const handleIncrement = () => {
        dispatch(incrementProductQuantity(product))
        updateFirestoreShoppingCart();
    }

    return (
        <Card style={{justifySelf: "center"}} className="p-1 w-100">
            <Card.Body className="text-center p-1">
                <Row>
                    <Col sm={4} className="d-flex align-items-center justify-content-center">
                        <Card.Img className="product-details-img-cart object-fit-scale" src={product.image} alt={`Image of ${product.title}`}/>
                    </Col>
                    <Col sm={8}>
                        <div className='p-3'>
                            <Card.Text className="product-text p-2 m-0 text-dark">{product.title}</Card.Text>
                            <Card.Text className="product-text text-dark"> ${product.price.toFixed(2)}</Card.Text>
                            <div className='d-flex justify-content-between flex-wrap'>
                                <div className='d-flex'>
                                    <Button className='btn-sm' variant="outline-dark" onClick={handleDecrement}>-</Button>
                                        <Card.Text className='m-0 mx-2 align-self-center'>{quantity}</Card.Text>
                                    <Button className='btn-sm' variant="outline-dark" onClick={handleIncrement}>+</Button>
                                </div>
                                <Button onClick={handleDeleteProduct} variant='danger'>Delete</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default CartItemCard;