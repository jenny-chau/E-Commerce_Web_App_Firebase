import { Button, Card } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../Redux/store';
import { removeProduct, decrementProductQuantity, incrementProductQuantity, type ProductQuantity } from '../Redux/cartSlice';

const CartItemCard: React.FC<ProductQuantity> = ({product, quantity}) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleDeleteProduct = () => {
        dispatch(removeProduct(product));
    }

    const handleDecrement = () => {
        dispatch(decrementProductQuantity(product))
    }

    const handleIncrement = () => {
        dispatch(incrementProductQuantity(product))
    }

    return (
        <Card style={{justifySelf: "center"}} className="p-1 w-100">
            <Card.Body className="product-card-body d-flex flex-wrap h-100 justify-content-between align-items-center text-center p-1">
                <Card.Img style={{height: "5rem"}} className="product-details-img object-fit-scale" src={product.image} alt={`Image of ${product.title}`}/>
                <div className='product-details-text p-3'>
                    <Card.Text className="p-2 m-0 text-dark">{product.title}</Card.Text>
                    <Card.Text className="text-dark"> ${product.price.toFixed(2)}</Card.Text>
                    <div className='d-flex justify-content-between'>
                        <div className='d-flex'>
                            <Button className='btn-sm' variant="outline-dark" onClick={handleDecrement}>-</Button>
                                <Card.Text className='m-0 mx-2 align-self-center'>{quantity}</Card.Text>
                            <Button className='btn-sm' variant="outline-dark" onClick={handleIncrement}>+</Button>
                        </div>
                        <Button onClick={handleDeleteProduct} variant='danger'>Delete</Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default CartItemCard;