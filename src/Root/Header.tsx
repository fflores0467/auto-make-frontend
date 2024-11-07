import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';

export const Header = () => {
  const currentPage = useLocation().pathname;

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand><LinkContainer to="/"><Nav.Link>AutoMake</Nav.Link></LinkContainer></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/home">
              <Nav.Link className={currentPage.startsWith('/home') ? 'nav-link active' : 'nav-link'}>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/setup/schedule">
              <Nav.Link className={currentPage.startsWith('/setup') ? 'nav-link active' : 'nav-link'}>Set Up</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/manage">
              <Nav.Link className={currentPage.startsWith('/manage') ? 'nav-link active' : 'nav-link'}>Manage</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/notification">
              <Nav.Link className={currentPage.startsWith('/notification') ? 'nav-link active' : 'nav-link'}>Notification</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
