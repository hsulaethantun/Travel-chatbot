import { Container, Card, Form, Button } from 'react-bootstrap';
import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const phrases = [
    { key: 'hello', english: 'Hello', thai: 'สวัสดี', phonetic: 'Sawasdee' },
    { key: 'thank_you', english: 'Thank you', thai: 'ขอบคุณ', phonetic: 'Khob khun' },
    { key: 'how_much', english: 'How much?', thai: 'เท่าไหร่', phonetic: 'Tao rai?' },
    { key: 'delicious', english: 'Delicious', thai: 'อร่อย', phonetic: 'Aroi' },
    { key: 'where_is', english: 'Where is...?', thai: 'อยู่ที่ไหน', phonetic: 'Yu tee nai?' },
    { key: 'help', english: 'Help', thai: 'ช่วยด้วย', phonetic: 'Chuay duay' },
    { key: 'goodbye', english: 'Goodbye', thai: 'ลาก่อน', phonetic: 'La gon' },
    { key: 'yes', english: 'Yes', thai: 'ใช่', phonetic: 'Chai' },
    { key: 'no', english: 'No', thai: 'ไม่', phonetic: 'Mai' },
    { key: 'sorry', english: 'Sorry', thai: 'ขอโทษ', phonetic: 'Khor thot' },
    { key: 'excuse_me', english: 'Excuse me', thai: 'ขอโทษครับ/ค่ะ', phonetic: 'Khor thot krab/ka' },
    { key: 'please', english: 'Please', thai: 'กรุณา', phonetic: 'Karuna' },
    { key: 'water', english: 'Water', thai: 'น้ำ', phonetic: 'Nam' },
    { key: 'bathroom', english: 'Bathroom', thai: 'ห้องน้ำ', phonetic: 'Hong nam' },
    { key: 'dont_understand', english: 'I don\'t understand', thai: 'ไม่เข้าใจ', phonetic: 'Mai kao jai' },
    { key: 'can_help', english: 'Can you help me?', thai: 'ช่วยได้ไหม', phonetic: 'Chuay dai mai?' },
    { key: 'expensive', english: 'Too expensive', thai: 'แพงเกินไป', phonetic: 'Paeng gern pai' },
    { key: 'very_good', english: 'Very good', thai: 'ดีมาก', phonetic: 'Dee mak' },
    { key: 'beautiful', english: 'Beautiful', thai: 'สวย', phonetic: 'Suay' },
    { key: 'lost', english: 'I\'m lost', thai: 'ฉันหลงทาง', phonetic: 'Chan long tang' },
    { key: 'call_police', english: 'Call police', thai: 'เรียกตำรวจ', phonetic: 'Riak tam ruat' },
    { key: 'hospital', english: 'Hospital', thai: 'โรงพยาบาล', phonetic: 'Rong paya ban' },
    { key: 'taxi', english: 'Taxi', thai: 'แท็กซี่', phonetic: 'Taxi' },
    { key: 'airport', english: 'Airport', thai: 'สนามบิน', phonetic: 'Sanam bin' },
    { key: 'hotel', english: 'Hotel', thai: 'โรงแรม', phonetic: 'Rong raem' }
];

const PhrasesWidget = () => {
    const { t } = useLanguage();
    const [selected, setSelected] = useState(null);
    const [playing, setPlaying] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value;
        setSelected(value ? phrases.find(p => p.key === value) : null);
        setPlaying(false);
        window.speechSynthesis?.cancel();
    };

    const speak = () => {
        if (!selected || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(selected.thai);
        const voices = window.speechSynthesis.getVoices();
        const thaiVoice = voices.find(v => v.lang === 'th-TH' || v.lang.startsWith('th'));
        if (thaiVoice) utter.voice = thaiVoice;
        utter.lang = 'th-TH';
        utter.rate = 0.85;

        setPlaying(true);
        utter.onend = () => setPlaying(false);
        utter.onerror = () => setPlaying(false);

        window.speechSynthesis.speak(utter);
    };

    return (
        <Container className="mt-4 mb-4">
            <h3 className="fw-bold text-center mb-4" style={{ color: '#2E3D5D' }}>
                🇹🇭 {t('phrases_title')}
            </h3>

            <Form.Select
                onChange={handleChange}
                className="mb-4"
                defaultValue=""
                style={{ border: '1px solid #494a4dff', color: '#2E3D5D' }}
            >
                <option value="">{t('phrases_select')}</option>
                {phrases.map((p) => (
                    <option key={p.key} value={p.key}>
                        {p.english}
                    </option>
                ))}
            </Form.Select>

            {selected && (
                <Card className="shadow text-center" style={{ border: '2px solid #2E3D5D' }}>
                    <Card.Body className="py-4">
                        <div style={{ fontSize: '3rem', fontWeight: 700, color: '#2E3D5D', lineHeight: 1.2 }}>
                            {selected.thai}
                        </div>
                        <div style={{ fontSize: '1rem', color: '#888', fontStyle: 'italic', marginTop: '6px' }}>
                            {selected.phonetic}
                        </div>
                        <div className="fw-semibold mt-2" style={{ fontSize: '1.1rem', color: '#333' }}>
                            {selected.english}
                        </div>
                        <Button
                            className="mt-3"
                            disabled={playing}
                            onClick={speak}
                            style={{
                                backgroundColor: playing ? '#6c757d' : '#2E3D5D',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '6px 24px',
                                fontSize: '0.9rem',
                                transition: 'background-color 0.2s',
                            }}
                        >
                            {playing ? `🔊 ${t('phrases_playing')}` : `▶ ${t('phrases_playing').includes('ing') ? t('phrases_play') : t('phrases_play')}`}
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default PhrasesWidget;
