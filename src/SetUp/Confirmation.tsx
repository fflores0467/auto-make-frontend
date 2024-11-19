import { Header } from "./Header"
import { Footer } from './Footer';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

export const Confirmation = () => {
    return (
        <Container fluid className='pt-3'>
            <Card border={'dark'}>
                <Card.Header>
                    <Header></Header>
                </Card.Header>
                <Card.Body className="text-center mb-2">
                    Your Automation Schedule Has Been Submitted!
                </Card.Body>
                <Card.Footer>
                    <Footer />
                </Card.Footer>
            </Card>
        </Container>
    )
}