import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';

export const Header = () => {
  const currentPage = useLocation().pathname;

  return (
    <Navbar>
      <Container fluid>
        {/* Wrapper div to control alignment */}
        <div className="d-flex justify-content-center justify-content-md-start w-100">
          <Nav>
            {/* Build Scheduler */}
            <Nav.Link
              className={currentPage === '/setup/schedule' ? 'nav-link active' : 'nav-link'}
              style={{ pointerEvents: 'none', cursor: 'default' }}
            >
              <span className="d-none d-md-inline">Build Scheduler</span> {/* Full text on md and up */}
              <span className="d-inline d-md-none">Build</span> {/* Short text on small screens */}
            </Nav.Link>

            {/* Separator */}
            <LinkContainer to="/setup/backroom" style={{ cursor: 'default', opacity: 0.5 }}>
              <Nav.Link className={currentPage === '/setup/backrooms' ? 'nav-link active' : 'nav-link'}>
                {">>"}
              </Nav.Link>
            </LinkContainer>

            {/* Configure Automation Settings */}
            <Nav.Link
              className={currentPage === '/setup/automation' ? 'nav-link active' : 'nav-link'}
              style={{ pointerEvents: 'none', cursor: 'default' }}
            >
              <span className="d-none d-md-inline">Configure Automation Settings</span> {/* Full text on md and up */}
              <span className="d-inline d-md-none">Configure</span> {/* Short text on small screens */}
            </Nav.Link>

            {/* Separator */}
            <LinkContainer to="/setup/backroom" style={{ cursor: 'default', opacity: 0.5 }}>
              <Nav.Link className={currentPage === '/setup/backrooms' ? 'nav-link active' : 'nav-link'}>
                {">>"}
              </Nav.Link>
            </LinkContainer>

            {/* Review Automation Schedule */}
            <Nav.Link
              className={currentPage === '/setup/review' ? 'nav-link active' : 'nav-link'}
              style={{ pointerEvents: 'none', cursor: 'default' }}
            >
              <span className="d-none d-md-inline">Review Automation Schedule</span> {/* Full text on md and up */}
              <span className="d-inline d-md-none">Review</span> {/* Short text on small screens */}
            </Nav.Link>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
