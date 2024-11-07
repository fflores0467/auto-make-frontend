import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

export const Loading: React.FC<{Header: React.ReactNode}> = ({ Header }) => {
    return (
        <Container fluid className='pt-3'>
            <Card border={'dark'}>
                <Card.Header>{Header}</Card.Header>
                <Card.Body>
                    <Row className="justify-content-md-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}