import { useState } from "react";
import { Card, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLanguage } from "../context/LanguageContext";

export default function EmergencyWidget() {
    const { t } = useLanguage();
    return (
        <Card>
            <Card.Header style={{ backgroundColor: '#bf1212ff', color: '#fff' }}>
                <Card.Title className="fw-bold text-center">{t('emergency_contacts_title')}</Card.Title>
            </Card.Header>
            <Card.Body>
                <Row style={{ paddingBottom: '20px' }}>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title className="fw-bold text-center" style={{ color: "#2E3D5D" }}>{t('police_emergencies_title')}</Card.Title>
                            </Card.Header>
                            <Card.Body className="fw-bold text-center">
                                <a href="tel:191" style={{ textDecoration: 'none' }}>191</a>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title className="fw-bold text-center" style={{ color: "#2E3D5D" }}>{t('tourist_police_title')}</Card.Title>
                            </Card.Header>
                            <Card.Body className="fw-bold text-center">
                                <a href="tel:1155" style={{ textDecoration: 'none' }}>1155</a>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title className="fw-bold text-center" style={{ color: "#2E3D5D" }}>{t('highway_police_title')}</Card.Title>
                            </Card.Header>
                            <Card.Body className="fw-bold text-center">
                                <a href="tel:1193" style={{ textDecoration: 'none' }}>1193</a>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title className="fw-bold text-center" style={{ color: "#2E3D5D" }}>Ambulance</Card.Title>
                            </Card.Header>
                            <Card.Body className="fw-bold text-center">
                                <a href="tel:1669" style={{ textDecoration: 'none' }}>1669</a>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}