import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Badge } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";
import "bootstrap/dist/css/bootstrap.min.css";

const TripWidget = () => {
    const { t } = useLanguage();
    const [fromCity, setFromCity] = useState('Bangkok');
    const [toCity, setToCity] = useState('Pattaya');
    const [accommodation, setAccommodation] = useState('Budget');
    const [transportation, setTransportation] = useState('Bus');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [budget, setBudget] = useState(0);
    const [priceLabel, setPriceLabel] = useState('');

    const cities = ['Bangkok', 'Pattaya', 'Chiang Mai', 'Chiang Rai', 'Phuket', 'Ayutthaya', 'Krabi', 'Koh Samui', 'Kanchanaburi', 'Hua Hin'];

    // Base costs between cities
    const baseTripCosts = {
        'Bangkok-Pattaya': 300,
        'Bangkok-Chiang Mai': 1000,
        'Bangkok-Phuket': 1200,
        'Bangkok-Ayutthaya': 200,
        'Bangkok-Krabi': 1300,
        'Bangkok-Koh Samui': 1400,
        'Bangkok-Kanchanaburi': 1500,
        'Bangkok-Hua Hin': 1600,
        'Bangkok-Chiang Rai': 1500,
        'Pattaya-Chiang Mai': 1300,
        'Pattaya-Phuket': 1400,
        'Pattaya-Ayutthaya': 500,
        'Pattaya-Chiang Rai': 1800,
        'Pattaya-Krabi': 1900,
        'Pattaya-Koh Samui': 2000,
        'Pattaya-Kanchanaburi': 2100,
        'Pattaya-Hua Hin': 2200,
        'Chiang Mai-Phuket': 2000,
        'Chiang Mai-Ayutthaya': 800,
        'Chiang Mai-Chiang Rai': 500,
        'Chiang Mai-Krabi': 1300,
        'Chiang Mai-Koh Samui': 1400,
        'Chiang Mai-Kanchanaburi': 1500,
        'Chiang Mai-Hua Hin': 1600,
        'Phuket-Ayutthaya': 1000,
        'Phuket-Krabi': 1900,
        'Phuket-Koh Samui': 2000,
        'Phuket-Kanchanaburi': 2100,
        'Phuket-Hua Hin': 2200,
        'Phuket-Chiang Rai': 1500,
        'Ayutthaya-Krabi': 1300,
        'Ayutthaya-Koh Samui': 1400,
        'Ayutthaya-Kanchanaburi': 1500,
        'Ayutthaya-Hua Hin': 1600,
        'Ayutthaya-Chiang Rai': 1500,
        'Krabi-Koh Samui': 1400,
        'Krabi-Kanchanaburi': 1500,
        'Krabi-Hua Hin': 1600,
        'Krabi-Chiang Rai': 1500,
        'Koh Samui-Kanchanaburi': 1500,
        'Koh Samui-Hua Hin': 1600,
        'Koh Samui-Chiang Rai': 1500,
        'Kanchanaburi-Hua Hin': 1600,
        'Kanchanaburi-Chiang Rai': 1500,
        'Hua Hin-Chiang Rai': 1500
    };

    const getBaseCost = (from, to) => {
        if (from === to) return 0;
        const key = [from, to].sort().join('-');
        return baseTripCosts[key] || 1000;
    };

    useEffect(() => {
        if (!startDate || !endDate) return;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();

        // Calculate duration in days
        const diffTime = Math.abs(end - start);
        const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        // Base logic
        let total = getBaseCost(fromCity, toCity);

        // Accommodation
        const accCost = accommodation === 'Luxury' ? 4500 : 800;
        total += accCost * duration;

        // Transportation
        const transExtra = transportation === 'Plane' ? 2000 : (transportation === 'Train' ? 500 : 0);
        total += transExtra;

        // Seasonality (High Season: Nov, Dec, Jan, Feb)
        const month = start.getMonth();
        const isHighSeason = [10, 11, 0, 1].includes(month);
        const seasonMultiplier = isHighSeason ? 1.5 : 1.0;

        // Urgency
        const daysToTrip = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
        let urgencyMultiplier = 1.0;
        if (daysToTrip <= 7) urgencyMultiplier = 1.6;
        else if (daysToTrip > 30) urgencyMultiplier = 0.8;
        else urgencyMultiplier = 1.1;

        // Final calculation
        const finalBudget = Math.round(total * seasonMultiplier * urgencyMultiplier);
        setBudget(finalBudget);

        // Set Label
        if (urgencyMultiplier >= 1.6 && isHighSeason) setPriceLabel('Very Expensive');
        else if (urgencyMultiplier >= 1.6 || isHighSeason) setPriceLabel('Expensive');
        else if (urgencyMultiplier <= 0.8 && !isHighSeason) setPriceLabel('Cheap');
        else if (urgencyMultiplier <= 0.8 && isHighSeason) setPriceLabel('Slightly Expensive');
        else setPriceLabel('Standard');

    }, [fromCity, toCity, accommodation, transportation, startDate, endDate]);

    const citiesWithoutAirports = ['Pattaya', 'Ayutthaya', 'Kanchanaburi'];
    const hasAirportConstraints = citiesWithoutAirports.includes(fromCity) || citiesWithoutAirports.includes(toCity);

    useEffect(() => {
        if (hasAirportConstraints && transportation === 'Plane') {
            setTransportation('Bus');
        }
    }, [fromCity, toCity, hasAirportConstraints, transportation]);

    // Set initial dates to today and tomorrow
    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(tomorrow.toISOString().split('T')[0]);
    }, []);

    return (
        <Container className="trip-planner-container">
            <Row>
                <Col>
                    <center><h4 className="widget-title fw-bold mb-3" style={{ color: 'white' }}>{t('trip_planner_title')}</h4></center>
                </Col>
            </Row>
            <Form className="trip-form">
                <Row className="g-2 mb-3">
                    <Col xs={6}>
                        <Form.Label className="small text-white-50">{t('from')}</Form.Label>
                        <Form.Select
                            size="sm"
                            value={fromCity}
                            onChange={(e) => setFromCity(e.target.value)}
                            className="luxury-input"
                        >
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </Form.Select>
                    </Col>
                    <Col xs={6}>
                        <Form.Label className="small text-white-50">{t('to')}</Form.Label>
                        <Form.Select
                            size="sm"
                            value={toCity}
                            onChange={(e) => setToCity(e.target.value)}
                            className="luxury-input"
                        >
                            {cities.filter(c => c !== fromCity).map(c => <option key={c} value={c}>{c}</option>)}
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="g-2 mb-3">
                    <Col xs={6}>
                        <Form.Label className="small text-white-50">{t('accommodation')}</Form.Label>
                        <Form.Select
                            size="sm"
                            value={accommodation}
                            onChange={(e) => setAccommodation(e.target.value)}
                        >
                            <option value="Budget">{t('budget_label')}</option>
                            <option value="Luxury">{t('luxury_label')}</option>
                        </Form.Select>
                    </Col>
                    <Col xs={6}>
                        <Form.Label className="small text-white-50">{t('transport')}</Form.Label>
                        <Form.Select
                            size="sm"
                            value={transportation}
                            onChange={(e) => setTransportation(e.target.value)}
                        >
                            <option value="Bus">{t('bus')}</option>
                            <option value="Train">{t('train')}</option>
                            <option value="Plane" disabled={hasAirportConstraints}>{t('plane')}</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="g-2 mb-3">
                    <Col xs={6}>
                        <Form.Label className="small text-white-50">{t('start_date')}</Form.Label>
                        <Form.Control
                            type="date"
                            size="sm"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </Col>
                    <Col xs={6}>
                        <Form.Label className="small text-white-50">{t('end_date')}</Form.Label>
                        <Form.Control
                            type="date"
                            size="sm"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Col>
                </Row>

                <Card className="result-card p-3 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small text-white-50">{t('estimated_budget')}</span>
                        <Badge bg={
                            priceLabel.includes('Expensive') ? 'danger' :
                                (priceLabel === 'Cheap' ? 'success' : 'warning')
                        } className="px-2">
                            {priceLabel}
                        </Badge>
                    </div>
                    <div className="budget-amount text-center">
                        <h2 className="fw-bold mb-0" style={{ color: '#fbbf24', fontSize: '1.8rem' }}>
                            {budget.toLocaleString()} <span style={{ fontSize: '0.9rem' }}>THB</span>
                        </h2>
                        <small className="text-white-50">{t('approx_cost')}</small>
                    </div>
                </Card>
            </Form>

            <style>{`
                .trip-planner-container {
                    padding: 0;
                }
                .luxury-input {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                    border-radius: 8px !important;
                }
                .luxury-input:focus {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    border-color: #fbbf24 !important;
                    box-shadow: 0 0 0 0.25rem rgba(251, 191, 36, 0.25) !important;
                }
                .result-card {
                    background: rgba(255, 255, 255, 0.07);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    backdrop-filter: blur(10px);
                }
                .form-control, .form-select {
                    background-color: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 8px;
                }
                .form-control:focus, .form-select:focus {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                .form-select option {
                    background-color: #1e293b;
                    color: white;
                }
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                }
            `}</style>
        </Container>
    );
};

export default TripWidget;