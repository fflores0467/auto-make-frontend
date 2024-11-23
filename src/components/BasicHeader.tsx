import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import React from 'react';

export const Header: React.FC<{ title: string }> = ({ title }) => {
    return (
        <Navbar expand="lg">
            <Container fluid>
                <LinkContainer to="/manage">
                    <Nav.Link>{title}</Nav.Link>
                </LinkContainer>
            </Container>
        </Navbar>
    )
}