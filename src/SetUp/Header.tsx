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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/setup/schedule">
              <Nav.Link className={currentPage === '/setup/schedule' ? 'nav-link active' : 'nav-link'}>
                Build Scheduler
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/setup/backroom">
              <Nav.Link className={currentPage === '/setup/backroom' ? 'nav-link active' : 'nav-link'}>
                |
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/setup/automation">
              <Nav.Link className={currentPage === '/setup/automation' ? 'nav-link active' : 'nav-link'}>
                Configure Automation Settings
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}