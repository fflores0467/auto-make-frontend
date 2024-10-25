import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export const Header = () => {
    return(
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container fluid>
                <Nav className="me-auto">
                    <Nav.Link className='nav-link active'>
                        Manage Automation Schedules
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}