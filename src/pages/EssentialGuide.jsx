import { VisaChecker, MandatoryDocuments } from '../components/TravelGuide';
import EmergencyWidget from '../components/EmergencyWidget';
import EmbassyWidget from '../components/EmbassyWidget';
import { useLanguage } from "../context/LanguageContext";
import { Container, Row, Col } from 'react-bootstrap';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PhrasesWidget from '../components/PhrasesWidget';

const EssentialGuide = () => {
    const { t } = useLanguage();
    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <NavBar />
            <h3 className="fw-bold text-center" style={{ color: '#2E3D5D', paddingTop: '80px', paddingBottom: '20px' }}>{t('essentials_title')}</h3>

            <Container fluid className="px-lg-5 mb-5">
                <Row className="g-4">
                    <Col lg={6}>
                        <VisaChecker />
                    </Col>
                    <Col lg={6}>
                        <MandatoryDocuments />
                    </Col>
                </Row>
                <Row className="g-4 mt-2">
                    <Col lg={6}>
                        <EmergencyWidget />
                    </Col>
                    <Col lg={6}>
                        <EmbassyWidget />
                    </Col>
                </Row>
                <Row className="g-4 mt-2">
                    <Col lg={12}>
                        <PhrasesWidget />
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default EssentialGuide;
