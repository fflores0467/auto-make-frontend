import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';

export const Header = () => {
  return (
    <Navbar>
      <Container fluid>
        {/* Wrapper div to control alignment */}
        <div className="d-flex justify-content-center justify-content-md-start w-100">
          <Nav>
            {/* Build Scheduler */}
            <LinkContainer to="/setup/schedule" style={{ pointerEvents: 'none' }}>
              <Nav.Link>
                <span className="d-none d-md-inline">Build Scheduler</span> {/* Full text on md and up */}
                <span className="d-inline d-md-none">Build</span> {/* Short text on small screens */}
              </Nav.Link>
            </LinkContainer>

            {/* Separator */}
            <LinkContainer to="/setup/backroom">
              <Nav.Link style={{ opacity: 0.5 }}>
                {">>"}
              </Nav.Link>
            </LinkContainer>

            {/* Configure Automation Settings */}
            <LinkContainer to="/setup/automation" style={{ pointerEvents: 'none' }}>
              <Nav.Link>
                <span className="d-none d-md-inline">Configure Automation Settings</span> {/* Full text on md and up */}
                <span className="d-inline d-md-none">Configure</span> {/* Short text on small screens */}
              </Nav.Link>
            </LinkContainer>

            {/* Separator */}
            <LinkContainer to="/setup/review">
              <Nav.Link style={{ opacity: 0.5 }}>
                {">>"}
              </Nav.Link>
            </LinkContainer>

            {/* Review Automation Schedule */}
            <LinkContainer to="/setup/review" style={{ pointerEvents: 'none' }}>
              <Nav.Link>
                <span className="d-none d-md-inline">Review Automation Schedule</span> {/* Full text on md and up */}
                <span className="d-inline d-md-none">Review</span> {/* Short text on small screens */}
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
