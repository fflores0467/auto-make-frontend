import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Create = () => {
    return (
        <Container fluid style={{paddingBottom: '1%', paddingTop: '1%'}}>
            <Form>
                <Row style={{paddingBottom: "1%"}}>
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label>Automation Name</Form.Label>
                            <Form.Control placeholder='Enter Automation Name'></Form.Control>
                        </Form.Group>
                    </Col>
                </Row>                
                <Row><Col><Button type="submit">Submit</Button></Col></Row>
            </Form>
        </Container>
    )
}