import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import OrderDetailModalItemCard from "./OrderDetailModalItemCard";
import type { Order } from "./MyOrdersPage";

interface OrderDetailModalProps {
    order: Order,
    orderDate: Date
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({order, orderDate}) => {
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const handleShow = () => setShowDetailModal(true);
    const handleClose = () => setShowDetailModal(false);

    
    return(
        <>
            <Button className='my-2' onClick={handleShow}>Details</Button>
            <Modal show={showDetailModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Order #{order.orderNumber}</Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex flex-column'>
                    <p><strong>Order Items:</strong></p>
                    {order.items.map((productQuantity, index) => (
                        <OrderDetailModalItemCard key={index} {...productQuantity} />
                    ))}
                    <p className='align-self-end mt-3'><strong>Item Count:</strong> {order.totalItems}</p>
                    <p className='align-self-end'><strong>Order Total:</strong> ${order.totalPrice.toFixed(2)}</p>
                    <p className='align-self-end'><strong>Order Date:</strong> {orderDate.toDateString()} {orderDate.toLocaleTimeString()}</p>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default OrderDetailModal;