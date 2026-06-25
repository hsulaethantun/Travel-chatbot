import { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { useLanguage } from "../context/LanguageContext";

export const VisaChecker = () => {
    const { t } = useLanguage();
    const [nationality, setNationality] = useState("");
    const [days, setDays] = useState(60);
    const [result, setResult] = useState(null);

    const visaFreeCountries = [
        "Andorra", "Australia", "Austria", "Belgium", "Bahrain", "Brazil", "Brunei", "Canada",
        "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
        "Hungary", "Iceland", "Indonesia", "Ireland", "Israel", "Italy", "Japan", "Kuwait",
        "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malaysia", "Maldives",
        "Mauritius", "Monaco", "Netherlands", "New Zealand", "Norway", "Oman", "Philippines",
        "Poland", "Portugal", "Qatar", "San Marino", "Singapore", "Slovakia", "Slovenia",
        "Spain", "South Africa", "South Korea", "Sweden", "Switzerland", "Turkey", "Ukraine",
        "United Arab Emirates", "United Kingdom", "UK", "United States", "USA", "America", "Peru", "Hong Kong",
        "Vietnam", "Saudi Arabia", "Bhutan", "Bulgaria", "Cyprus", "Fiji", "Georgia", "India",
        "Kazakhstan", "Malta", "Mexico", "Papua New Guinea", "Romania", "Uzbekistan", "Taiwan",
        "China", "Laos", "Macau", "Mongolia", "Russia", "Cambodia", "Albania", "Colombia",
        "Croatia", "Cuba", "Dominica", "Dominican Republic", "Ecuador", "Guatemala", "Jamaica",
        "Jordan", "Kosovo", "Morocco", "Panama", "Sri Lanka", "Trinidad and Tobago", "Tonga", "Uruguay"
    ];

    const checkVisa = () => {
        const trimmedNationality = nationality.trim();
        if (!trimmedNationality) {
            setResult({ type: "warning", message: t('visa_enter_country') });
            return;
        }

        const isVisaFree = visaFreeCountries.some(
            (country) => country.toLowerCase() === trimmedNationality.toLowerCase()
        );

        if (isVisaFree) {
            if (parseInt(days) <= 60) {
                setResult({
                    type: "success",
                    message: t('visa_success_60')
                });
            } else {
                setResult({
                    type: "danger",
                    message: t('visa_required_60')
                });
            }
        } else {
            if (parseInt(days) <= 14) {
                setResult({
                    type: "info",
                    message: t('visa_voa_14')
                });
            } else {
                setResult({
                    type: "danger",
                    message: t('visa_required_14')
                });
            }
        }
    };

    return (
        <Card className="shadow border-0" style={{ backgroundColor: '#2E3D5D', color: '#fff', borderRadius: '20px' }}>
            <Card.Body className="p-4">
                <h4 className="fw-bold mb-4 text-center">{t('visa_checker_title')}</h4>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>{t('visa_nationality')}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={t('visa_placeholder')}
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>{t('visa_duration')}</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                        />
                    </Form.Group>

                    <Button
                        variant="light"
                        className="w-100 fw-bold py-2 mb-3"
                        onClick={checkVisa}
                        style={{ borderRadius: '10px', color: '#2E3D5D' }}
                    >
                        {t('visa_check_btn')}
                    </Button>
                </Form>

                {result && (
                    <div className={`mt-3 p-3 rounded text-center bg-${result.type}`} style={{ opacity: 0.9 }}>
                        {result.message}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export const MandatoryDocuments = () => {
    const { t } = useLanguage();
    return (
        <Card className="shadow border-0" style={{ backgroundColor: '#2E3D5D', color: '#fff', borderRadius: '20px' }}>
            <Card.Body className="p-4">
                <h4 className="fw-bold mb-4 text-center">{t('mandatory_docs_title')}</h4>
                <ListGroup variant="flush" style={{ paddingBottom: '20px' }}>
                    <ListGroup.Item style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {t('doc_passport')}
                    </ListGroup.Item>
                    <ListGroup.Item style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {t('doc_visa')}
                    </ListGroup.Item>
                    <ListGroup.Item style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {t('doc_tm6')}
                        <a href="https://tdac.immigration.go.th/arrival-card/#/home" target="_blank" rel="noopener noreferrer"> {t('doc_tm6_link')}</a>
                    </ListGroup.Item>
                    <ListGroup.Item style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {t('doc_hotel')}
                    </ListGroup.Item>
                    <ListGroup.Item style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                        {t('doc_funds')}
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
};