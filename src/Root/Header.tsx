import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';

export const Header = () => {
  const currentPage = useLocation().pathname;

  return (
    <Navbar style={{ paddingBottom: "1%" }} expand="lg" className="bg-body-tertiary">
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
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
