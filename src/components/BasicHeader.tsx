import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import React from 'react';

export const Header: React.FC<{title: string}> = ({ title }) => {
    return(
        <Navbar expand="lg">
            <Container fluid>
                <Nav className="me-auto">
                    <Nav.Link className="nav-link active">{title}</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}