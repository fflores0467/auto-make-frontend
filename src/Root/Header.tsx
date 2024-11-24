import { useSelector } from 'react-redux';
import type { RootState } from '../store';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';

export const Header = () => {
  const user = useSelector((state: RootState) => state.user);
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand><LinkContainer to="/"><Nav.Link>AutoMake</Nav.Link></LinkContainer></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/home">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/setup/schedule">
              <Nav.Link>Set Up</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/manage">
              <Nav.Link >Manage</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/notification">
              <Nav.Link >Notification</Nav.Link>
            </LinkContainer>
          </Nav>
          {/* Add User Info to the Right */}
          <Nav className="ms-auto">
            <Nav.Item >
              {user.id > 0 ? `Logged in as: ${user.username}` : 'Not logged in'}
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
