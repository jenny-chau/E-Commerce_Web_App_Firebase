import PageLayout from "../PageLayout";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import type { ProductQuantity } from "../../Redux/cartSlice";
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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        if (user){
            const ordersRef = query(collection(db, "orders"), where("uid", "==", user.uid));
        
            // setup listener to get the orders from firestore as they are made
            const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
                const dataArray = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                })) as Order[];

                if (dataArray.length === 0) {setError("No orders found")}
                else {setError("")};
                
                setOrders(dataArray);
                setLoading(false);
            
                return () => unsubscribe();
            })
        } else {
            setError("No user found");
        }
    }, [user])

    return (
        <PageLayout>
            <h1 className='mb-5'>My Orders</h1>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {orders.sort((a,b)=>b.orderNumber-a.orderNumber).map((order, index) => // sort orders in descending order
            <div key={index}>
                <OrderCard order={order}/>
            </div>
            )}
        </PageLayout>
    )
}

export default MyOrdersPage;