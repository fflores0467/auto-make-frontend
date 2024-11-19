import { Header } from "./Header"
import { Footer } from './Footer';
import { Summary } from './Summary'

import React, { useState } from 'react';

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

export const Review = () => {
    // Summary Modal
    const [modalShow, setModalShow] = useState(false);

    return (
        <Container fluid className='pt-3'>
            <Card border={'dark'}>
                <Card.Header>
                    <Header></Header>
                </Card.Header>
                <Card.Body className="text-center mb-2">
                    <Button variant="primary" onClick={() => setModalShow(true)}>
                        Checkout
                    </Button>
                    <Summary
                        show={modalShow}
                        setModalShow={setModalShow}
                    />
                </Card.Body>
                <Card.Footer>
                    <Footer />
                </Card.Footer>
            </Card>
        </Container>
    )
}