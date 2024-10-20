import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
    const currentPage = useLocation().pathname;

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link className={currentPage === '/setup/schedule' ? 'nav-link active' : 'nav-link'}> 
                            <Link to="/setup/schedule" style={{ textDecoration: 'none', color: 'inherit' }}>Build Scheduler</Link>
                        </Nav.Link>
                        <Nav.Link className={currentPage === '/setup/backroom' ? 'nav-link active' : 'nav-link'}> 
                            <Link to="/setup/backroom" style={{ textDecoration: 'none', color: 'inherit', cursor: 'default' }}>|</Link>
                        </Nav.Link>
                        <Nav.Link className={currentPage === '/setup/automation' ? 'nav-link active' : 'nav-link'}> 
                            <Link to="/setup/automation" style={{ textDecoration: 'none', color: 'inherit' }}>Configure Automation Settings</Link>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}