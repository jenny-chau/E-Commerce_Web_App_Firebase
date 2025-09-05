import {Container, Nav, Navbar} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import ShoppingCart from "./ShoppingCart/ShoppingCart";
import UserContext from "./UserContext";
import { useContext } from "react";
import LogoutButton from "./User/LogoutButton";

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const handleBrandClick = () => {
        navigate('/');
    };

    return (
        <Navbar expand="md" fixed="top" bg='light' variant='light'>
            <Container className='justify-content-between'>
                <Navbar.Brand onClick={handleBrandClick} className='fs-2'>Coins</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar"/>
                    <Navbar.Collapse id="navbar" className="justify-content-start">
                        <Nav className="p-1 fs-5 d-flex align-items-center">
                            <Nav.Link className="px-3" as={NavLink} to="/">Shop</Nav.Link>
                            {user && 
                                <>
                                    <Nav.Link className="px-3" as={NavLink} to="/myOrders">My Orders</Nav.Link>
                                    <Nav.Link className="px-3" as={NavLink} to="/profile">Profile</Nav.Link>
                                    <LogoutButton/>
                                </>
                            }
                        </Nav>
                    </Navbar.Collapse>
                {user &&
                    <>
                        <ShoppingCart/>
                    </> 
                }
                
            </Container>
        </Navbar>
    )
}

export default NavBar;