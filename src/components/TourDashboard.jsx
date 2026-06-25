import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Card, Row, Col, Container, Badge } from 'react-bootstrap';
import { supabase } from '../lib/supabaseClient';
import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from "../context/LanguageContext";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const TourDashboard = ({ onTourSelect }) => {
    const { t } = useLanguage();
    const barChartRef = React.useRef(null);
    const donutChartRef = React.useRef(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();

        // Optional: Real-time subscription
        const subscription = supabase
            .channel('bookings_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, payload => {
                setBookings(prev => [payload.new, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setBookings(data);
        }
        setLoading(false);
    };

    // Helper to map long tour titles from DB to shorter chart labels
    const normalizeTitle = (title) => {
        if (!title) return "Unknown";
        const t = title.toLowerCase();
        if (t.includes("bangkok city")) return "Bangkok City Tour";
        if (t.includes("chiang mai city")) return "Chiang Mai City Tour";
        if (t.includes("pattaya city")) return "Pattaya City Tour";
        if (t.includes("ayutthaya city")) return "Ayutthaya City Tour";
        if (t.includes("chiang rai city")) return "Chiang Rai City Tour";
        if (t.includes("phuket city")) return "Phuket City Tour";
        if (t.includes("bangkok temple")) return "Bangkok Temple";
        if (t.includes("ayutthaya historical")) return "Ayutthaya Historical";
        if (t.includes("floating market")) return "Floating Market";
        if (t.includes("pattaya beach")) return "Pattaya Beach";
        if (t.includes("doi suthep")) return "Chiang Mai Doi Suthep";
        if (t.includes("phuket island")) return "Phuket Island";
        return title; // Fallback
    };

    // Helper to generate a consistent but dynamic and distinct color palette for the donut chart
    const generateDonutColors = (count) => {
        const baseColors = [
            '#2E3D5D',
            '#4A5D7E',
            '#FF6B6B',
            '#021d74ff',
            '#FFE66D',
            '#1A535C',
            '#fa3707ff',
            '#AA4465',
            '#860884',
            '#00AD7C',
            '#ee9999ff',
            '#008080'
        ];

        if (count <= baseColors.length) return baseColors.slice(0, count);

        // If even more colors are needed, generate using HSL with rotating hues for maximum distinction
        return Array.from({ length: count }, (_, i) => {
            if (i < baseColors.length) return baseColors[i];
            const hue = (i * 137) % 360; // Use golden angle for hue distribution
            const saturation = 50 + (i % 3) * 10;
            const lightness = 40 + (i % 2) * 10;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        });
    };

    // Calculate Data Dynamically (Merging Mock + Live)
    const tourData = useMemo(() => {
        // Initial Mock Data Maps
        const counts = {
            "Bangkok City Tour": 34,
            "Chiang Mai City Tour": 20,
            "Pattaya City Tour": 35,
            "Ayutthaya City Tour": 32,
            "Chiang Rai City Tour": 28,
            "Phuket City Tour": 15,
            "Bangkok Temple": 42,
            "Ayutthaya Historical": 38,
            "Floating Market": 25,
            "Pattaya Beach": 25,
            "Chiang Mai Doi Suthep": 30,
            "Phuket Island": 18
        };

        const repeats = {
            "Bangkok City Tour": 0,
            "Chiang Mai City Tour": 10,
            "Pattaya City Tour": 0,
            "Ayutthaya City Tour": 7,
            "Chiang Rai City Tour": 0,
            "Phuket City Tour": 0,
            "Bangkok Temple": 4,
            "Ayutthaya Historical": 3,
            "Floating Market": 2,
            "Pattaya Beach": 0,
            "Chiang Mai Doi Suthep": 0,
            "Phuket Island": 8
        };

        const userTours = {}; // Tracking per user: { email: { tourTitle: frequency } }

        // Add Live Supabase Data
        bookings.forEach(b => {
            const normalizedTitle = normalizeTitle(b.tour_title);
            const people = Number(b.people_count) || 0;

            // 1. Dynamic Bar Chart Logic: Ensure every new title is added to labels
            counts[normalizedTitle] = (counts[normalizedTitle] || 0) + people;

            // 2. Dynamic Loyalty Logic: Track how many times THIS user booked THIS tour
            if (!userTours[b.email]) userTours[b.email] = {};
            userTours[b.email][normalizedTitle] = (userTours[b.email][normalizedTitle] || 0) + 1;
        });

        // 3. Process the tracked user data to find repeat bookings (2+ times)
        Object.keys(userTours).forEach(email => {
            Object.keys(userTours[email]).forEach(title => {
                const frequency = userTours[email][title];
                if (frequency >= 2) {
                    // This tour now qualifies for a slice in the loyalty donut
                    // It counts as one repeat customer for this tour title
                    repeats[title] = (repeats[title] || 0) + 1;
                }
            });
        });

        // Generate Labels and Counts for Bar Chart
        const labels = Object.keys(counts);
        const barCounts = labels.map(l => counts[l]);

        // Generate Labels, Counts, and DYNAMIC Colors for Donut Chart
        // Filter out zero-value items so the legend stays clean
        const repeatLabels = Object.keys(repeats).filter(l => repeats[l] > 0);
        const repeatCounts = repeatLabels.map(l => repeats[l]);
        const repeatColors = generateDonutColors(repeatLabels.length);

        // Stats (Mock Baseline + Live)
        const totalTravelers = Object.values(counts).reduce((sum, val) => sum + val, 0);
        const totalBookings = 80 + bookings.length;
        const avgGroupSize = totalBookings > 0 ? Math.round(totalTravelers / totalBookings) : 0;
        const peakTour = labels.length > 0 ? labels.reduce((a, b) => counts[a] > counts[b] ? a : b) : 'None';

        return {
            barData: {
                labels,
                datasets: [{
                    label: t('dash_total_people'),
                    data: barCounts,
                    backgroundColor: 'rgba(46, 61, 93, 0.8)',
                    borderColor: '#2E3D5D',
                    borderWidth: 1,
                    borderRadius: 1,
                }]
            },
            donutData: {
                labels: repeatLabels,
                datasets: [{
                    label: t('dash_loyalty_desc'),
                    data: repeatCounts,
                    backgroundColor: repeatColors,
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            stats: [
                { label: 'dash_stat_travelers', value: totalTravelers, color: '#4A5D7E' },
                { label: 'dash_stat_avg_group', value: avgGroupSize, color: '#4A5D7E' },
                { label: 'dash_stat_peak', value: peakTour, color: '#4A5D7E' }
            ],
            rawLabels: labels,
            rawRepeatLabels: repeatLabels
        };
    }, [bookings]);

    const handleChartClick = (event, chartRef, labels) => {
        const { current: chart } = chartRef;
        if (!chart) return;

        const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
        if (elements.length > 0) {
            const index = elements[0].index;
            onTourSelect?.(labels[index]);
        }
    };

    const barOptions = {
        responsive: true,
        onClick: (e) => handleChartClick(e, barChartRef, tourData.rawLabels),
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#2E3D5D',
                    font: { weight: 'bold' }
                }
            },
            title: {
                display: false
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (e) => handleChartClick(e, donutChartRef, tourData.rawRepeatLabels),
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    boxWidth: 10,
                    font: { size: 11 }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return ` ${context.label}: ${context.raw} ${t('dash_repeat_users')}`;
                    }
                }
            }
        },
        cutout: '70%'
    };

    return (
        <Container py={5}>
            <div className="mb-5 text-center">
                <h2 className="fw-bold mb-4" style={{ color: '#2E3D5D' }}>{t('dash_title')}</h2>
                <p className="text-muted mb-4">{t('dash_subtitle')}</p>
            </div>

            <Row className="g-4">
                {/* Bar Chart Section */}
                <Col lg={7}>
                    <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '25px' }}>
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4" style={{ color: '#2E3D5D' }}>{t('dash_bookings_chart')}</h5>
                            <div style={{ height: '350px' }}>
                                {loading ? (
                                    <div className="d-flex h-100 align-items-center justify-content-center">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </div>
                                ) : (
                                    <Bar ref={barChartRef} data={tourData.barData} options={barOptions} />
                                )}
                            </div>
                            <p className="mt-4 text-center small text-muted">
                                {t('dash_bookings_desc')}
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Donut Chart Section */}
                <Col lg={5}>
                    <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '25px' }}>
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold" style={{ color: '#2E3D5D' }}>{t('dash_loyalty_analysis')}</h5>
                                <Badge rounded-pill bg="light" text="dark" className="px-3 mt-n1 border">{t('dash_repeat_bookings_badge')}</Badge>
                            </div>
                            <div style={{ height: '300px', padding: '10px' }}>
                                {loading ? (
                                    <div className="d-flex h-100 align-items-center justify-content-center">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </div>
                                ) : (
                                    <Doughnut ref={donutChartRef} data={tourData.donutData} options={donutOptions} />
                                )}
                            </div>
                            <div className="mt-4 text-center small text-muted">
                                {t('dash_loyalty_desc')}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Performance Stats Overlay */}
            <Row className="mt-4 g-3 justify-content-center">
                {!loading && tourData.stats.map((stat, i) => (
                    <Col key={i} sm={6} md={3}>
                        <Card className="border-0 shadow-sm text-center p-3" style={{ borderRadius: '15px' }}>
                            <div className="small text-muted mb-1">{t(stat.label)}</div>
                            <div className="h4 fw-bold mb-0" style={{ color: stat.color }}>{stat.value}</div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default TourDashboard;
