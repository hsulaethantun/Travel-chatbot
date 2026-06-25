import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="text-white" style={{ backgroundColor: '#2E3D5D', padding: '12px 0 0' }}>
            <Container>
                <Row className="align-items-start">
                    <Col md={2}>
                        <h6 className="fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>Site Map</h6>
                        <ul className="list-unstyled mb-0" style={{ fontSize: '0.85rem' }}>
                            <li><Link to="/" className="text-white text-decoration-none">Home</Link></li>
                            <li><Link to="/chat" className="text-white text-decoration-none">AI Chat</Link></li>
                            <li><Link to="/tour" className="text-white text-decoration-none">Tour</Link></li>
                            <li><Link to="/aboutus" className="text-white text-decoration-none">About Us</Link></li>
                        </ul>
                    </Col>
                    <Col md={7} className="py-1">
                        <center><h6 className="mb-1">What is Trip Aura?</h6></center>
                        <p className="mb-0" style={{ fontSize: '0.83rem' }}>From discovering famous attractions and hidden gems to checking weather updates, travel tips, and essential guides, our platform provides quick and reliable information to support your journey. Whether you are planning your first visit or returning to explore more, our smart assistant is here to make your travel planning simple, enjoyable, and unforgettable.</p>
                    </Col>
                    <Col md={3}>
                        <h6 className="fw-bold mb-2" style={{ color: 'var(--color-primary)' }}>Contact Information</h6>
                        <p className="mb-1" style={{ fontSize: '0.83rem' }}><FaEnvelope style={{ color: 'var(--color-primary)' }} /> <a href="mailto: tripaura.thailand@gmail.com"> tripaura.thailand@gmail.com</a> </p>
                        <p className="mb-1" style={{ fontSize: '0.83rem' }}><FaPhone style={{ color: 'var(--color-primary)' }} /> +66 123 456 789</p>
                        <p className="mb-0" style={{ fontSize: '0.83rem' }}><FaMapMarkerAlt style={{ color: 'var(--color-primary)' }} /> Bangkok, Thailand</p>
                    </Col>
                </Row>
                <hr className="my-2" style={{ borderColor: 'var(--color-border)' }} />
                <Row>
                    <Col md={12} className="text-center pb-2">
                        <p className="mb-0" style={{ fontSize: '0.8rem' }}>&copy; 2026 Trip Aura. All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};
export default Footer;
