import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Modal } from 'react-bootstrap';
import { FaClock, FaMapMarkerAlt, FaCheckCircle, FaCamera } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import TripWidget from '../components/TripWidget';
import BookingWidget from '../components/BookingWidget';
import { jsPDF } from 'jspdf';
import emailjs from '@emailjs/browser';
import { useLanguage } from "../context/LanguageContext";
import TourDashboard from '../components/TourDashboard';
import { supabase } from '../lib/supabaseClient';
import bangkok from "./assets/bangkok.jpg";

// TOUR PACKAGE CATALOG
const cityTourPackages = [
    {
        id: 1,
        title: "Bangkok City Tour",
        price: "5,500 THB",
        duration: "2 days",
        img: bangkok,
        tags: ["Culture", "Food"],
        description: "Discover the heart of Thailand through its historic temples and world-famous street food.",
        inclusions: ["Accommodation", "Meals", "Transportation", "English Guide"],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Bangkok",
                description: "Arrive in Bangkok and check into your hotel."
            },
            {
                day: 2,
                title: "City Tour",
                description: "Explore the city with our guided tour."
            }
        ]
    },
    {
        id: 2,
        title: "Chiang Mai City Tour",
        price: "4,900 THB",
        duration: "2 days",
        img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
        tags: ["Culture", "Food"],
        description: "Experience the serene beauty of the North with temple tours and mountain vistas.",
        inclusions: ["Accommodation", "Meals", "Transportation", "English Guide"],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Chiang Mai",
                description: "Arrival in Chiang Mai, hotel check-in, temple visit"
            },
            {
                day: 2,
                title: "City Tour",
                description: "Explore the city with our guided tour."
            }
        ]
    },
    {
        id: 3,
        title: "Pattaya City Tour",
        price: "4,000 THB",
        duration: "2 days",
        img: "https://images.unsplash.com/photo-1518107616985-bd48230d3b20?auto=format&fit=crop&w=800&q=80",
        tags: ["Island", "Beach"],
        description: "Sun, sand, and sea await in this vibrant coastal city escape.",
        inclusions: ["Accommodation", "Meals", "Transportation", "English Guide"],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Pattaya",
                description: "Arrival in Pattaya, hotel check-in, Pattaya Beach, Walking Street"
            },
            {
                day: 2,
                title: "Coral Island tour",
                description: "Coral Island tour, hotel check-out"
            }
        ]
    },
    {
        id: 4,
        title: "Ayutthaya City Tour",
        price: "3,000 THB",
        duration: "2 days",
        img: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80",
        tags: ["Culture", "History"],
        description: "Explore the ancient ruins and rich history of Siam's former capital.",
        inclusions: ["Accommodation", "Meals", "Transportation", "English Guide"],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Ayutthaya",
                description: "Arrive in Ayutthaya, hotel check-in, temple visits"
            },
            {
                day: 2,
                title: "City Tour",
                description: "Ayutthaya Historical Park, river cruise"
            }
        ]
    },
    {
        id: 5,
        title: "Chiang Rai City Tour",
        price: "4,000 THB",
        duration: "2 days",
        img: "https://images.unsplash.com/photo-1528181304800-2f140819ad52?auto=format&fit=crop&w=800&q=80",
        tags: ["Culture", "Food"],
        description: "A unique blend of art, culture, and nature in the far north.",
        inclusions: ["Accommodation", "Meals", "Transportation", "Guide"],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Chiang Rai",
                description: "Arrive in Chiang Rai, hotel check-in, Night Bazaar"
            },
            {
                day: 2,
                title: "City Tour",
                description: "White Temple, Blue Temple, Golden Triangle"
            }
        ]
    },
    {
        id: 6,
        title: "Phuket City Tour",
        price: "6,000 THB",
        duration: "2 days",
        img: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
        tags: ["Culture", "Beach"],
        description: "Indulge in island hopping and crystal-clear waters in the pearl of the Andaman.",
        inclusions: ["Accommodation", "Meals", "Transportation", "English Guide"],
        itinerary: [
            {
                day: 1,
                title: "Arrival in Phuket",
                description: "Arrive in Phuket, hotel check-in, Patong Beach"
            },
            {
                day: 2,
                title: "City Tour",
                description: "Phuket Old Town, Big Buddha"
            }
        ]
    }
];

const tourPackages = [
    {
        id: 1,
        title: "Bangkok Temple & Food Discovery",
        price: "1,200 THB",
        duration: "6 Hours",
        img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
        tags: ["Culture", "Food"],
        description: "Explore the Grand Palace and hidden street food gems.",
        inclusions: ["English Guide", "All Entrance Fees", "Street Food Tasting", "Tuk-Tuk Ride"],
        itinerary: [
            { time: "08:00 AM", activity: "Pickup from Hotel" },
            { time: "09:30 AM", activity: "Grand Palace & Emerald Buddha" },
            { time: "11:30 AM", activity: "Tuk-Tuk ride to Chinatown" },
            { time: "12:30 PM", activity: "Michelin Guide Street Food Lunch" }
        ]
    },
    {
        id: 2,
        title: "Ayutthaya Historical Park Day Trip",
        price: "1,800 THB",
        duration: "8 Hours",
        img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
        tags: ["History", "Culture"],
        description: "Step back in time at the ancient capital of Siam.",
        inclusions: ["Private Car", "English Guide", "Entrance Fees", "Lunch at Riverside Restaurant"],
        itinerary: [
            { time: "08:00 AM", activity: "Pickup from Bangkok Hotel" },
            { time: "10:00 AM", activity: "Wat Mahathat (Buddha Head in Tree)" },
            { time: "11:30 AM", activity: "Wat Phra Si Sanphet" },
            { time: "01:00 PM", activity: "Lunch" },
            { time: "02:30 PM", activity: "Wat Chaiwatthanaram" }
        ]
    },
    {
        id: 3,
        title: "Damnoen Saduak Floating Market",
        price: "900 THB",
        duration: "5 Hours",
        img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
        tags: ["Market", "Local Life"],
        description: "Experience the vibrant chaos of Thailand's famous floating market.",
        inclusions: ["Longtail Boat Ride", "Guide", "Hotel Pickup"],
        itinerary: [
            { time: "07:00 AM", activity: "Pickup from Hotel" },
            { time: "08:30 AM", activity: "Arrive at Floating Market" },
            { time: "09:00 AM", activity: "Boat tour through canals" },
            { time: "11:00 AM", activity: "Return to Bangkok" }
        ]
    },
    {
        id: 4,
        title: "Pattaya Beach & Sanctuary of Truth",
        price: "1,500 THB",
        duration: "7 Hours",
        img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
        tags: ["Beach", "Art"],
        description: "Relax on the beach and marvel at the stunning wooden architecture.",
        inclusions: ["Private Car", "Entrance Fee", "Lunch"],
        itinerary: [
            { time: "08:00 AM", activity: "Pickup from Bangkok" },
            { time: "10:00 AM", activity: "Sanctuary of Truth" },
            { time: "12:30 PM", activity: "Lunch" },
            { time: "02:00 PM", activity: "Pattaya Beach" },
            { time: "04:00 PM", activity: "Return to Bangkok" }
        ]
    },
    {
        id: 5,
        title: "Chiang Mai Doi Suthep Temple",
        price: "1,000 THB",
        duration: "4 Hours",
        img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
        tags: ["Mountain", "Spiritual"],
        description: "Visit one of Northern Thailand's most sacred temples.",
        inclusions: ["Private Car", "Guide", "Entrance Fee"],
        itinerary: [
            { time: "08:00 AM", activity: "Pickup from Chiang Mai Hotel" },
            { time: "09:00 AM", activity: "Doi Suthep Temple" },
            { time: "11:00 AM", activity: "Return to Hotel" }
        ]
    },
    {
        id: 6,
        title: "Phuket Island Hopping (Phi Phi Islands)",
        price: "2,500 THB",
        duration: "8 Hours",
        img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
        tags: ["Island", "Snorkeling"],
        description: "Explore the stunning beaches of Phi Phi Islands.",
        inclusions: ["Speedboat", "Lunch", "Snorkeling Gear", "Guide"],
        itinerary: [
            { time: "08:00 AM", activity: "Pickup from Phuket Hotel" },
            { time: "09:00 AM", activity: "Speedboat to Phi Phi Islands" },
            { time: "10:00 AM", activity: "Maya Bay, Pileh Lagoon" },
            { time: "12:30 PM", activity: "Lunch on Beach" },
            { time: "03:00 PM", activity: "Return to Phuket" }
        ]
    }
]

const Tour = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedTour, setSelectedTour] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleShowDetails = (tour) => {
        setSelectedTour(tour);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setShowBookingForm(false);
    };

    const handleBookNow = () => {
        setShowBookingForm(true);
    };

    const generatePDF = (bookingData) => {
        const doc = new jsPDF();

        // Header
        doc.setFillColor(46, 61, 93);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('Booking Confirmation', 105, 25, { align: 'center' });

        // Content
        doc.setTextColor(46, 61, 93);
        doc.setFontSize(16);
        doc.text('Tour Details', 20, 55);

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Tour: ${selectedTour.title}`, 20, 65);
        doc.text(`Price: ${selectedTour.price}`, 20, 72);
        doc.text(`Duration: ${selectedTour.duration}`, 20, 79);

        doc.setFontSize(16);
        doc.setTextColor(46, 61, 93);
        doc.text('Customer Information', 20, 95);

        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Name: ${bookingData.firstName} ${bookingData.lastName}`, 20, 105);
        doc.text(`Email: ${bookingData.email}`, 20, 112);
        doc.text(`Phone: ${bookingData.phone}`, 20, 119);
        doc.text(`Date of Visit: ${bookingData.visitDate}`, 20, 126);
        doc.text(`Number of People: ${bookingData.peopleCount}`, 20, 133);

        if (bookingData.additionalNotes) {
            doc.setFontSize(16);
            doc.setTextColor(46, 61, 93);
            doc.text('Additional Notes', 20, 150);
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(bookingData.additionalNotes, 20, 160, { maxWidth: 170 });
        }

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text('Thank you for booking with TripAura Thailand!', 105, 280, { align: 'center' });

        return doc.output('datauristring');
    };

    const handleConfirmBooking = async (bookingData) => {
        setIsSending(true);
        try {
            const pdfDataUri = generatePDF(bookingData);

            // Store in Supabase - Move this BEFORE the early return for EmailJS
            const { error: supabaseError } = await supabase
                .from('bookings')
                .insert([{
                    first_name: bookingData.firstName,
                    last_name: bookingData.lastName,
                    email: bookingData.email,
                    phone: bookingData.phone,
                    visit_date: bookingData.visitDate,
                    people_count: parseInt(bookingData.peopleCount),
                    tour_title: selectedTour.title,
                    additional_notes: bookingData.additionalNotes || '',
                    created_at: new Date().toISOString()
                }]);

            if (supabaseError) {
                console.error('Error saving to Supabase:', supabaseError);
            }

            // NOTE: You need to replace these placeholders with your actual EmailJS credentials
            // from your EmailJS dashboard: https://dashboard.emailjs.com/
            const SERVICE_ID = 'YOUR_SERVICE_ID';
            const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
            const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

            if (SERVICE_ID === 'YOUR_SERVICE_ID') {
                console.warn('EmailJS credentials not set. Simulating success...');
                setTimeout(() => {
                    alert('Booking successful for ' + bookingData.firstName + '! (Simulated Email & PDF sent)');
                    handleClose();
                    setIsSending(false);
                }, 1500);
                return;
            }

            const templateParams = {
                to_email: bookingData.email,
                to_name: `${bookingData.firstName} ${bookingData.lastName}`,
                tour_title: selectedTour.title,
                content: pdfDataUri // This should be mapped to an attachment in your EmailJS template
            };

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

            alert('Booking successful for ' + bookingData.firstName + '! A confirmation PDF has been sent to your email.');
            handleClose();
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Booking saved, but we had trouble sending the email. Our team will contact you soon.');
            handleClose();
        } finally {
            setIsSending(false);
        }
    };

    const handleCancelBooking = () => {
        setShowBookingForm(false);
    };

    const handleTourSelect = (tourLabel) => {
        // Find the tour package in either list by title
        const allPackages = [...cityTourPackages, ...tourPackages];
        const foundTour = allPackages.find(pkg =>
            pkg.title.toLowerCase().includes(tourLabel.toLowerCase()) ||
            tourLabel.toLowerCase().includes(pkg.title.toLowerCase())
        );

        if (foundTour) {
            handleShowDetails(foundTour);
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <NavBar />
            <div style={{ paddingTop: '100px', paddingBottom: '50px' }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={10}>
                            <h1 className="display-4 fw-bold mb-4 text-center" style={{ color: '#2E3D5D' }}>
                                {t('tour_title')}
                            </h1>
                            <p className="lead text-muted text-center mb-5">
                                {t('tour_subtitle')}
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={10} lg={6} className="mb-4">
                            <Card style={{
                                backgroundColor: '#2E3D5D',
                                borderRadius: '30px',
                                border: 'none',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                padding: '20px'
                            }}>
                                <TripWidget />
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={10} lg={12} className="mb-4">
                            <TourDashboard onTourSelect={handleTourSelect} />
                        </Col>
                    </Row>
                    <h3 className="fw-bold text-center" style={{ color: '#2E3D5D' }}>
                        {t('tour_city_packages')}
                    </h3>
                    <Row className="g-4">
                        {cityTourPackages.map((pkg) => (
                            <Col key={pkg.id} md={6} lg={4}>
                                <Card className="h-100 border-0 shadow-sm hover-shadow transition" onClick={() => handleShowDetails(pkg)} style={{ cursor: 'pointer' }}>
                                    <div className="overflow-hidden rounded-top position-relative">
                                        <Card.Img
                                            variant="top"
                                            src={pkg.img}
                                            style={{ height: '240px', objectFit: 'cover' }}
                                            className="card-img-hover"
                                        />
                                    </div>
                                    <Card.Body className="d-flex flex-column">
                                        <div className="mb-2">
                                            {pkg.tags.map(tag => (
                                                <Badge key={tag} bg="light" text="primary" className="me-1 border">
                                                    {t(`tour_tag_${tag.toLowerCase()}`)}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Card.Title className="fw-bold fs-5" style={{ color: 'var(--color-text)' }}>{pkg.title}</Card.Title>
                                        <div className="d-flex align-items-center small mb-3" style={{ color: 'var(--color-text-muted)' }}>
                                            <FaClock className="me-1" /> {pkg.duration}
                                            <span className="mx-2">•</span>
                                            <FaMapMarkerAlt className="me-1" /> Thailand
                                        </div>
                                        <div className="mt-auto d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="small d-block" style={{ color: 'var(--color-text-muted)' }}>{t('tour_from')}</span>
                                                <span className="fw-bold fs-5" style={{ color: 'var(--color-primary)' }}>{pkg.price}</span>
                                            </div>
                                            <Button variant="outline-primary" size="sm" className="px-3" style={{ borderRadius: 'var(--radius-sm)' }}>{t('tour_view_details')}</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <h3 className="fw-bold text-center" style={{ color: '#2E3D5D' }}>
                        {t('tour_other_packages')}
                    </h3>
                    <Row className="g-4" style={{ paddingTop: '20px' }}>
                        {tourPackages.map((pkg) => (
                            <Col key={pkg.id} md={6} lg={4}>
                                <Card className="h-100 border-0 shadow-sm hover-shadow transition" onClick={() => handleShowDetails(pkg)} style={{ cursor: 'pointer' }}>
                                    <div className="overflow-hidden rounded-top position-relative">
                                        <Card.Img
                                            variant="top"
                                            src={pkg.img}
                                            style={{ height: '240px', objectFit: 'cover' }}
                                            className="card-img-hover"
                                        />
                                    </div>
                                    <Card.Body className="d-flex flex-column">
                                        <div className="mb-2">
                                            {pkg.tags.map(tag => (
                                                <Badge key={tag} bg="light" text="primary" className="me-1 border">
                                                    {t(`tour_tag_${tag.toLowerCase()}`)}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Card.Title className="fw-bold fs-5" style={{ color: 'var(--color-text)' }}>{pkg.title}</Card.Title>
                                        <div className="d-flex align-items-center small mb-3" style={{ color: 'var(--color-text-muted)' }}>
                                            <FaClock className="me-1" /> {pkg.duration}
                                            <span className="mx-2">•</span>
                                            <FaMapMarkerAlt className="me-1" /> Thailand
                                        </div>
                                        <div className="mt-auto d-flex justify-content-between align-items-center">
                                            <div>
                                                <span className="small d-block" style={{ color: 'var(--color-text-muted)' }}>{t('tour_from')}</span>
                                                <span className="fw-bold fs-5" style={{ color: 'var(--color-primary)' }}>{pkg.price}</span>
                                            </div>
                                            <Button variant="outline-primary" size="sm" className="px-3" style={{ borderRadius: 'var(--radius-sm)' }}>{t('tour_view_details')}</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    {/* --- TOUR DETAILS MODAL --- */}
                    <Modal show={showModal} onHide={handleClose} size="lg" centered>
                        {selectedTour && (
                            <>
                                <Modal.Header closeButton className="border-0 pb-0">
                                    <Modal.Title className="fw-bold" style={{ color: 'var(--color-text)' }}>{selectedTour.title}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="px-4 position-relative">
                                    {isSending && (
                                        <div
                                            className="position-absolute w-100 h-100 top-0 start-0 d-flex flex-column align-items-center justify-content-center"
                                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 10, borderRadius: 'var(--bs-modal-border-radius)' }}
                                        >
                                            <div className="spinner-border text-primary mb-3" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="fw-bold" style={{ color: '#2E3D5D' }}>{t('tour_processing')}</p>
                                        </div>
                                    )}
                                    {showBookingForm ? (
                                        <BookingWidget
                                            tour={selectedTour}
                                            onCancel={handleCancelBooking}
                                            onConfirm={handleConfirmBooking}
                                        />
                                    ) : (
                                        <>
                                            <img
                                                src={selectedTour.img}
                                                className="w-100 rounded-4 mb-4 object-fit-cover shadow-sm"
                                                style={{ height: '300px' }}
                                                alt={selectedTour.title}
                                            />

                                            <Row>
                                                {/* Left: Itinerary Timeline */}
                                                <Col md={7}>
                                                    <h5 className="fw-bold mb-4 d-flex align-items-center" style={{ color: 'var(--color-text)' }}><FaCamera className="me-2" style={{ color: 'var(--color-primary)' }} />{t('tour_highlights')}</h5>
                                                    <div className="border-start border-2 ps-4 ms-2 mb-4 position-relative" style={{ borderColor: 'var(--color-border)' }}>
                                                        {selectedTour.itinerary.map((item, index) => (
                                                            <div key={index} className="mb-4 position-relative">
                                                                <span
                                                                    className="position-absolute border border-2 rounded-circle"
                                                                    style={{ width: '16px', height: '16px', left: '-33px', top: '4px', backgroundColor: 'var(--color-white)', borderColor: 'var(--color-primary)' }}
                                                                ></span>
                                                                <strong className="d-block" style={{ color: 'var(--color-text)' }}>
                                                                    {item.time || `${t('tour_day')} ${item.day}`}
                                                                </strong>
                                                                <span style={{ color: 'var(--color-text-muted)' }}>
                                                                    {item.activity || (item.title ? `${item.title}: ${item.description}` : item.description)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Col>

                                                {/* Right: Pricing & Inclusions Box */}
                                                <Col md={5}>
                                                    <div className="p-4 rounded-4 h-100 border" style={{ backgroundColor: 'var(--color-background)' }}>
                                                        <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: 'var(--color-text)' }}><FaCheckCircle className="me-2 text-success" />{t('tour_includes')}</h6>
                                                        <ul className="list-unstyled mb-4">
                                                            {selectedTour.inclusions.map((inc, i) => {
                                                                const incKey = inc.toLowerCase().includes('acc') ? 'acc' :
                                                                    inc.toLowerCase().includes('meal') ? 'meals' :
                                                                        inc.toLowerCase().includes('trans') ? 'trans' : 'guide';
                                                                return (
                                                                    <li key={i} className="mb-2 small d-flex align-items-center" style={{ color: 'var(--color-text-muted)' }}>
                                                                        <FaCheckCircle className="me-2 text-success" size={12} />
                                                                        {inc}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>

                                                        <hr className="my-4" />

                                                        <div className="text-center">
                                                            <p className="small mb-1" style={{ color: 'var(--color-text-muted)' }}>Total Price per Person</p>
                                                            <h2 className="fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>{selectedTour.price}</h2>
                                                            <Button
                                                                variant="primary"
                                                                size="lg"
                                                                onClick={handleBookNow}
                                                                className="w-100 shadow"
                                                                style={{ borderRadius: '10px', backgroundColor: '#2E3D5D', borderColor: '#2E3D5D' }}
                                                            >
                                                                {t('tour_book_now')}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                </Modal.Body>
                            </>
                        )}
                    </Modal>
                </Container>
            </div>
            <Footer />
        </div >
    );
};

export default Tour;
