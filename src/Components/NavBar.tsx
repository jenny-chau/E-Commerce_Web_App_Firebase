import {Container, Navbar} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ShoppingCart from "./ShoppingCart";

const NavBar: React.FC = () => {
    const navigate = useNavigate();

    const handleBrandClick = () => {
        navigate('/');
    };

    return (
        <Navbar expand="lg" fixed="top" bg='light' variant='light'>
            <Container>
                <Navbar.Brand onClick={handleBrandClick}>Coins</Navbar.Brand>
                <ShoppingCart/>
            </Container>
        </Navbar>
    )
}

export default NavBar;