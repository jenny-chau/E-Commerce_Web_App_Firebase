import { signOut } from "firebase/auth";
import { Button } from "react-bootstrap";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";


const LogoutButton: React.FC = () => {
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
        await signOut(auth);
        navigate("/");
        } catch (err: any) {
        console.error("Logout error:", err.message);
        }
    };

    return (<Button className="btn-danger m-3" onClick={handleLogout}>Logout</Button>);
}

export default LogoutButton;