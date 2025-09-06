import { signOut } from "firebase/auth";
import { Button } from "react-bootstrap";
import { auth, db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../Redux/store";
import { clearCart } from "../../Redux/cartSlice";

const LogoutButton: React.FC = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const dispatch = useDispatch<AppDispatch>();


    const handleLogout = async () => {
        try {
            if (user) {
                // update shopping cart in Firestore
                const ref = doc(db, "shoppingCart", user.uid);
                await updateDoc(ref, {cart: sessionStorage.getItem('shoppingCart')})

                // Clear cart state in Redux and in session storage
                dispatch(clearCart());
                sessionStorage.clear();

                // sign out and redirect to sign in page
                await signOut(auth);
                navigate("/");
            }
        } catch (err: any) {
        console.error("Logout error:", err);
        }
    };

    return (<Button className="btn-danger m-3" onClick={handleLogout}>Logout</Button>);
}

export default LogoutButton;