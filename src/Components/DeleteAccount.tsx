import { Button } from "react-bootstrap";
import { auth, db } from "../firebaseConfig";
import { deleteUser, signOut } from "firebase/auth";
import {deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const DeleteAccount: React.FC = () => {
    const user = auth.currentUser;
    const navigate = useNavigate();
    
    const handleDelete = async () => {
        if (user) {
            try {
            await deleteDoc(doc(db, "users", user.uid))
            await deleteUser(user);
            await signOut(auth);
            navigate("/");
            } catch (err: any) {
                console.log(err.message);
            }
        } else {
            console.log("No user to delete");
        }
    }

    return (
        <>
            <Button variant='danger' onClick={handleDelete}>Delete Account</Button>
        </>
    )
}

export default DeleteAccount;