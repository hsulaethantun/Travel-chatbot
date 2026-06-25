import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLanguage } from "../context/LanguageContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import image1 from "../assets/image1.jpeg";
import image2 from "../assets/image2.jpeg";
import image3 from "../assets/image3.jpeg";
import image4 from "../assets/image4.jpeg";

const Aboutus = () => {
    const { t } = useLanguage();
    const teamMembers = [
        {
            name: "Mr. Ngwe Tun",
            role: t('team_leader'),
            img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
        },
        {
            name: "Ms. Chit Pann Ei",
            role: t('team_designer_backend'),
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
        },
        {
            name: "Ms. Yoon Shwe Yee",
            role: t('team_designer_frontend'),
            img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80"
        },
        {
            name: "Ms. Hsu Lae Than Htun",
            role: t('team_designer_frontend'),
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
        }
    ];

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
            <NavBar />
            <Container>
                <div className='text-center'>
                    <h1 className='display-4 fw-bold mb-4 text-center' style={{ paddingTop: '80px', color: '#2E3D5D' }}>{t('about_title')}</h1>
                    <p className='text-center mb-5'>
                        {t('about_subtitle')}
                    </p>
                    <p className='text-muted text-center mb-5'>
                        {t('about_description')}
                    </p>
                </div>
                <center><h3 className='text-center' style={{ paddingBottom: '20px', color: '#2E3D5D' }}>{t('team_title')}</h3></center>
                <Row className="pb-5 justify-content-center">
                    {teamMembers.map((member, index) => (
                        <Col key={index} md={6} className="mb-4 d-flex justify-content-center">
                            <Card className='text-center shadow-sm' style={{ width: '100%', maxWidth: '350px' }}>
                                <Card.Img variant="top" src={member.img} style={{ height: '250px', objectFit: 'cover' }} />
                                <Card.Body>
                                    <h5 className="fw-bold mb-1">{member.name}</h5>
                                    <p className="text-muted small mb-0">{member.role}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default Aboutus;