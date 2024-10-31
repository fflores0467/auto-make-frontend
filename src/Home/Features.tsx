import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import setupImage from '../assets/images/setup.jpg';
import manageImage from '../assets/images/manage.jpg';

export const Features = () => {
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <Carousel>
            <Carousel.Item onClick={() => handleNavigation('/setup')} style={{ cursor: 'pointer' }}>
                <Image
                    className="d-block w-100"
                    src={setupImage}
                    alt="Setup page slide"
                />
                <Carousel.Caption>
                    <h3 style={{color: '#FFFFFF'}}>Setup Page</h3>
                    <p style={{color: '#CCCCCC'}}>Configure and customize your settings with ease.</p>
                </Carousel.Caption>
            </Carousel.Item>
            
            <Carousel.Item onClick={() => handleNavigation('/manage')} style={{ cursor: 'pointer' }}>
                <Image
                    className="d-block w-100"
                    src={manageImage}
                    alt="Manage page slide"
                />
                <Carousel.Caption>
                    <h3 style={{color: '#000000'}}>Manage Page</h3>
                    <p style={{color: '#333333'}}>Organize and control your resources efficiently.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
};
