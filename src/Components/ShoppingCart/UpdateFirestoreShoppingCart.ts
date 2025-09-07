import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

export const updateFirestoreShoppingCart = async () => {
    try {
        const user = auth.currentUser;
        const cartData = sessionStorage.getItem('shoppingCart');
        
        if (user) {
            // update shopping cart in Firestore
            const ref = doc(db, "shoppingCart", user.uid);
            
            if (cartData != null) {
                await updateDoc(ref, {cart: cartData});
            }
        }
    } catch (err: any) {
        console.error("Logout error:", err);
    }
    return;
};