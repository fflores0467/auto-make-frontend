import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import { Create } from './Create';

export const SetUp = () => {
    return (
        <Container fluid>
            <Row className="justify-content-md-center">
                <Col><h1 style={{textAlign: "center"}}>Welcome to the Set Up Page!</h1></Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col>
                    <Card>
                    <Card.Header>Set Up Automation</Card.Header>
                        <Create></Create>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}