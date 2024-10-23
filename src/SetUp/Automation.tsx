import { useSelector } from 'react-redux'
import type { RootState } from '../store'

import { Header } from "./Header"
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

export const Automation = () => {

    const automation_id = useSelector((state: RootState) => state.schedule.automation_id); 

    return(
        <Container fluid>
            <Card>
                <Card.Header>
                    <Header></Header>
                </Card.Header>
                <Card.Body> 
                    {!automation_id ? 
                        <h5>Please Return to "Build Scheduler" and Selection an Automation</h5> : <h5>Scheduler: {automation_id}</h5> 
                    }
                </Card.Body>
            </Card>
        </Container>
    )
}