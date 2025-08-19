import { Container } from "react-bootstrap";
import PageLayout from "./PageLayout";
import CategoryDropdown from "./CategoryDropdown";

const HomePage: React.FC = () => {
    return (
        <PageLayout>
            <Container>
                <h1 className='mb-5'>Coins | The Online Department Store</h1>
                <CategoryDropdown />
            </Container>
        </PageLayout>
    )
}

export default HomePage;