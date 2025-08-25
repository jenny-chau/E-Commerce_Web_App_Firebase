import PageLayout from "./PageLayout";
import CategoryDropdown from "./CategoryDropdown";
import Login from "./Login";
import { useContext } from "react";
import UserContext from "./UserContext";

const HomePage: React.FC = () => {
    const {user} = useContext(UserContext);
    
    return (
        <PageLayout>
            <h1 className='mb-5'>Coins | The Online Department Store</h1>
            {user ? <CategoryDropdown /> : <Login />}
        </PageLayout>
    )
}

export default HomePage;