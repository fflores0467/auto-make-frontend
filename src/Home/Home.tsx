import { Features } from './Features';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../assets/css/home.css';

const words = ['Welcome...', 'To...', 'AutoMake'];

export const Home = () => {
    const [intro, setIntro] = useState('');
    const [fade, setFade] = useState(true);

    useEffect(() => {
        words.forEach((word, index) => {
            setTimeout(() => {
                setIntro(word);
                setFade(index !== words.length - 1); // Sets fade only if it's not the last word
            }, index * 2000); // Adjusts display timing for each word
        });
    }, []);

    return (
        <Container fluid className='pt-3'>
            <Card border={'dark'}>
                <Card.Body>
                    <Row className="justify-content-md-center">
                        <Col className={`text-center ${fade ? 'fade-animation' : 'fade-in'}`} as="h1">
                            {intro}
                        </Col>
                    </Row>
                    {!fade && (
                        <Row className="justify-content-md-center fade-in">
                            <Col md={8}>
                                <Features />
                            </Col>
                        </Row>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};
