import { Card, Col, Row } from "react-bootstrap";
import type { Order } from "./MyOrdersPage";
import OrderDetailModal from "./OrderDetailModal";

export interface OrderCardProps {
    order: Order
}

const OrderCard: React.FC<OrderCardProps> = ({order}) => {
    const orderDate = new Date(order.createdAt.seconds*1000 + order.createdAt.nanoseconds/1000000);

    return (
        <>
        <Card style={{justifySelf: "center"}} className="h-100 shadow-sm p-1 w-50 m-2">
            <Card.Body className="">
                <Row>
                    <Col>
                        <div className='p-3 d-flex justify-content-around align-items-center flex-wrap'>
                            <Card.Title className="p-2 m-0 text-dark">Order #{order.orderNumber}</Card.Title>
                            <div className='d-flex flex-column my-2'>
                                <Card.Text className=''><strong>Total Items: </strong>{order.totalItems}</Card.Text>
                                <Card.Text className=''><strong>Order Total: </strong>${order.totalPrice.toFixed(2)}</Card.Text>
                                <Card.Text className=''><strong>Order Date: </strong>{orderDate.toDateString()}</Card.Text>
                            </div>
                            <OrderDetailModal order={order} orderDate={orderDate}/>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        
        </>
    )
}

export default OrderCard;