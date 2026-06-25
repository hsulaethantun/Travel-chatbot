import { useEffect, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { CurrencyRates, CurrencyCalculator } from '../components/CurrencyWidget';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import WeatherDashboard from '../components/WeatherDashboard';
import { useLanguage } from "../context/LanguageContext";
import image1 from "../assets/image1.jpeg";
import image2 from "../assets/image2.jpeg";
import image3 from "../assets/image3.jpeg";
import image4 from "../assets/image4.jpeg";
import image5 from "../assets/image5.jpeg";

const Slideshow = () => {
    const images = [
        image1,
        image2,
        image3,
        image4,
        image5
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "500px",
                margin: "40px 0",
                overflow: "hidden",
            }}
        >
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`slide ${index + 1}`}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: index === currentIndex ? 1 : 0,
                        transition: "opacity 1.5s ease-in-out",
                    }}
                />
            ))}
        </div>
    );
}

export default function Homepage() {
    const { t } = useLanguage();
    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Navbar */}
            <NavBar />
            {/* Main Content */}
            <div style={{ paddingTop: '80px', paddingBottom: '1px' }}>
                <Container className="text-center">
                    <Row className="justify-content-center">
                        <Col md={10}>
                            <h1 className="display-4 fw-bold mb-4 text-center" style={{ color: '#2E3D5D' }}>
                                {t('welcome_title')}
                            </h1>
                            <p className="lead text-muted text-center mb-5">
                                {t('welcome_subtitle')}
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div style={{ paddingTop: '1px', paddingBottom: '1px' }}>
                {/* Full Width Slideshow */}
                <Slideshow />
            </div>
            <Container fluid className="px-lg-5 mb-4">
                <Row className="g-4">
                    <Col lg={5}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{
                                border: '1px solid #2E3D5D',
                                borderRadius: '30px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#2E3D5D',
                                color: '#fff',
                                padding: '20px'
                            }}>
                                <CurrencyRates />
                            </div>
                            <div style={{
                                border: '1px solid #2E3D5D',
                                borderRadius: '30px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#2E3D5D',
                                color: '#fff',
                                padding: '20px'
                            }}>
                                <CurrencyCalculator />
                            </div>
                        </div>
                    </Col>
                    <Col lg={7}>
                        <div style={{
                            border: '1px solid #ddd',
                            borderRadius: '30px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#fff',
                            padding: '10px',
                            height: '100%'
                        }}>
                            <WeatherDashboard />
                        </div>
                    </Col>
                </Row>
            </Container>
            <h5 className="text-center text-muted" style={{ marginTop: '20px' }}>For more essential travel information in Thailand and other emmergency information, please click the button below.</h5>
            <div className="text-center mb-5">
                <Link to="/essential-guide">
                    <button
                        className="btn btn-lg fw-bold"
                        style={{
                            backgroundColor: '#2E3D5D',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '12px 30px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {t('essential_guide')}
                    </button>
                </Link>
            </div>
            <Footer />
        </div >
    );
}