import { Header } from "./Header"
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

export const BackRoom = () => {
    return(
        <Container fluid>
            <Card>
                <Card.Header>
                    <Header></Header>
                </Card.Header>
                <Card.Body> 
                    Welcome....! :)
                </Card.Body>
            </Card>
        </Container>
    )
}