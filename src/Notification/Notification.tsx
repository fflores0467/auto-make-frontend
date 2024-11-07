import { Header } from '../components/BasicHeader'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Notification = () => {
    return (
        <Container fluid className='pt-3'>
            <Card border={'dark'}>
                <Card.Header>
                    <Header title={"Notification Connections"} />
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col>Welcome!</Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}