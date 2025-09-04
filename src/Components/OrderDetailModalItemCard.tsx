import { Card, Col, Row } from "react-bootstrap";
import type { ProductQuantity } from "../Redux/cartSlice";

const OrderDetailModalItemCard: React.FC<ProductQuantity> = ({product, quantity}) => {

    return (
        <Card style={{justifySelf: "center"}} className="p-1 w-100">
            <Card.Body className="text-center p-1">
                <Row>
                    <Col sm={3} className="d-flex align-items-center justify-content-center">
                        <Card.Img className="object-fit-scale" src={product.image} alt={`Image of ${product.title}`}/>
                    </Col>
                    <Col sm={6}>
                        <div className='p-3 small'>
                            <Card.Text className="p-2 m-0 text-dark">{product.title}</Card.Text>
                            <Card.Text className="text-dark">${product.price.toFixed(2)} each</Card.Text>
                            </div>
                    </Col>
                    <Col sm={3} className="d-flex align-items-center justify-content-center">
                        <Card.Text className='m-0 mx-2 align-self-center'><small>Quantity:</small> {quantity}</Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default OrderDetailModalItemCard;