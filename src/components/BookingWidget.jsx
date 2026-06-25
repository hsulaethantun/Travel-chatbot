import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useLanguage } from "../context/LanguageContext";

const BookingWidget = ({ tour, onCancel, onConfirm }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        visitDate: '',
        peopleCount: 1,
        additionalNotes: ''
    });

    const [validated, setValidated] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            onConfirm(formData);
        }
        setValidated(true);
    };

    return (
        <Card className="border-0 shadow-sm p-3" style={{ borderRadius: '20px' }}>
            <Card.Body>
                <div className="mb-4">
                    <h4 className="fw-bold" style={{ color: '#2E3D5D' }}>{t('booking_title')}</h4>
                    <p className="text-muted small">{t('booking_subtitle').replace('explore ', `explore ${tour?.title} `)}</p>
                </div>

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustom01">
                            <Form.Label className="small fw-semibold">{t('booking_first_name')}</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="firstName"
                                placeholder={t('booking_first_name')}
                                value={formData.firstName}
                                onChange={handleChange}
                                style={{ borderRadius: '10px', border: '1px solid #494a4dff', color: '#212529', backgroundColor: '#ffffff' }}
                            />
                            <Form.Control.Feedback type="invalid">{t('booking_err_first')}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustom02">
                            <Form.Label className="small fw-semibold">{t('booking_last_name')}</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                name="lastName"
                                placeholder={t('booking_last_name')}
                                value={formData.lastName}
                                onChange={handleChange}
                                style={{ borderRadius: '10px', border: '1px solid #494a4dff', color: '#212529', backgroundColor: '#ffffff' }}
                            />
                            <Form.Control.Feedback type="invalid">{t('booking_err_last')}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustomEmail">
                            <Form.Label className="small fw-semibold">{t('booking_email')}</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="yourname@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                style={{ borderRadius: '10px', border: '1px solid #494a4dff', color: '#212529', backgroundColor: '#ffffff' }}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t('booking_err_email')}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustomPhone">
                            <Form.Label className="small fw-semibold">{t('booking_phone')}</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                placeholder={t('booking_phone')}
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                style={{ borderRadius: '10px', border: '1px solid #494a4dff', color: '#212529', backgroundColor: '#ffffff' }}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t('booking_err_phone')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustomDate">
                            <Form.Label className="small fw-semibold">{t('booking_date')}</Form.Label>
                            <Form.Control
                                type="date"
                                name="visitDate"
                                required
                                value={formData.visitDate}
                                onChange={handleChange}
                                style={{ borderRadius: '10px', border: '1px solid #494a4dff', color: '#212529', backgroundColor: '#ffffff' }}
                                min={new Date().toISOString().split('T')[0]}
                                onClick={(e) => e.target.showPicker?.()}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t('booking_err_date')}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustomPeople">
                            <Form.Label className="small fw-semibold">{t('booking_people')}</Form.Label>
                            <Form.Control
                                type="number"
                                name="peopleCount"
                                min="1"
                                required
                                value={formData.peopleCount}
                                onChange={handleChange}
                                style={{ borderRadius: '10px', border: '1px solid #494a4dff', color: '#212529', backgroundColor: '#ffffff' }}
                            />
                            <Form.Control.Feedback type="invalid">
                                {t('booking_err_people')}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-4" controlId="validationCustomNotes">
                        <Form.Label className="small fw-semibold">{t('booking_notes')}</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="additionalNotes"
                            rows={3}
                            placeholder={t('booking_notes_placeholder')}
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            style={{ borderRadius: '10px', border: '1px solid #494a4dff', color: '#212529', backgroundColor: '#ffffff' }}
                        />
                    </Form.Group>

                    <div className="d-flex gap-2 justify-content-end mt-4">
                        <Button
                            variant="light"
                            onClick={onCancel}
                            className="px-4"
                            style={{ borderRadius: '10px', color: '#6c757d' }}
                        >
                            {t('booking_back')}
                        </Button>
                        <Button
                            type="submit"
                            className="px-4"
                            style={{
                                backgroundColor: '#2E3D5D',
                                border: 'none',
                                borderRadius: '10px'
                            }}
                        >
                            {t('booking_btn')}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default BookingWidget;
