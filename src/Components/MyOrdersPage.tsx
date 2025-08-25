import PageLayout from "./PageLayout";
import { useEffect, useState } from "react";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import type { ProductQuantity } from "../Redux/cartSlice";
import OrderCard from "./OrderCard";


export interface Order {
    uid: string,
    totalPrice: number,
    totalItems: number,
    items: ProductQuantity[],
    createdAt: Timestamp,
    orderID: string,
    orderNumber: number
}

const MyOrdersPage: React.FC = () => {
    const user = auth.currentUser;
    const [orders, setOrders] = useState<Order[]>([]);
    
    useEffect(() => {
        setOrders([]);
        const fetchData = async () => {
            if (user){
                const q = query(collection(db, "orders"), where("uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const nextOrder: Order = {
                        ...doc.data(),
                        orderID: doc.id
                    }
                    setOrders(prev => [...prev, nextOrder]);
                });
            }
        };
        fetchData();
    }, [])


    return (
        <PageLayout>
            <h1 className='mb-5'>My Orders</h1>
            {orders.sort((a,b)=>b.orderNumber-a.orderNumber).map((order, index) => 
            <div key={index}>
                <OrderCard order={order}/>
            </div>
            )}
        </PageLayout>
    )
}

export default MyOrdersPage;