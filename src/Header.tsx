import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {

  const currentPage = useLocation().pathname;

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>AutoMake</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className={currentPage === '/home' ? 'nav-link active' : 'nav-link'}> 
              <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            </Nav.Link>
            <Nav.Link className={currentPage === '/setup' ? 'nav-link active' : 'nav-link'}> 
              <Link to="/setup" style={{ textDecoration: 'none', color: 'inherit' }}>Set Up</Link>
            </Nav.Link>
            <Nav.Link className={currentPage === '/manage' ? 'nav-link active' : 'nav-link'}> 
              <Link to="/manage" style={{ textDecoration: 'none', color: 'inherit' }}>Manage</Link>
            </Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}