import { useSelector } from 'react-redux'
import type { RootState } from '../store'

import { Header } from "./Header"
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

export const Automation = () => {

    const scheduleName = useSelector((state: RootState) => state.schedule.name); 

    return(
        <Container fluid>
            <Card>
                <Card.Header>
                    <Header></Header>
                </Card.Header>
                <Card.Body> 
                    {!scheduleName ? 
                        <h5>Please Return to "Build Scheduler" Page</h5> : <h5>Scheduler: {scheduleName}</h5> 
                    }
                </Card.Body>
            </Card>
        </Container>
    )
}