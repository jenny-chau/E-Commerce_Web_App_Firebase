import {Container} from "react-bootstrap";
import NavBar from "./NavBar";

type PageLayoutProps = {
    children? : React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({children}) => {
    return (
        <Container className='my-5 mx-auto'>
            <NavBar/>
            {children}
        </Container>
    )
}

export default PageLayout;