import { Form, Card, Container } from 'react-bootstrap';
import { useState } from 'react';
import { useLanguage } from "../context/LanguageContext";

const embassyData = [
    {
        name: "Argentina",
        address:
            "Vasu 01 Building, 16th floor, No. 1 Sukhumvit Soi 25, Khlong Toei, Wattana, Bangkok 10110",
        phone: "+66 2259 0401",
        email: "etail@mrecic.gov.ar, etail.cancilleria.gov.ar",
    },
    {
        name: "Australia",
        address:
            "181 Soi Arun McKinnon Wireless Road, Lumphini, Pathum Wan, Bangkok 10330",
        phone: "+66 2344 6300",
        extra: "Fax: +66 2344 6593 | Visa enquiries: +66 2118 7100",
    },
    {
        name: "Austria",
        address:
            "No. 14 Soi Nantha-Mozart, Sathorn Soi 1, Sathorn Tai Road, Thung Maha Mek Sub-district, Sathorn District, Bangkok 10120",
        phone: "+66 2105 6710",
    },
    {
        name: "Bahrain",
        address:
            "100/66-7 Sathorn Nakorn Tower, 31st Floor, North Sathorn Road, Silom Sub-district, Bang Rak District, Bangkok 10500",
        phone: "+66 2266 6565",
    },
    {
        name: "Bangladesh",
        address: "47/8 Ekamai Soi 30, Sukhumvit 63, Bangkok 10110",
        phone: "+66 2390 5107 to 8",
        email: "mission.bangkok@mofa.gov.bd",
        extra: "Fax: +66 2390 5106",
    },
    {
        name: "Belgium",
        address:
            "98 Sathorn Square, North Sathorn Road, Silom Sub-district, Bang Rak District, Bangkok 10500",
        phone: "+66 2108 1800",
    },
    {
        name: "Bhutan",
        address:
            "375/1, Pracha Uthit Soi 19, Sam Sen Nok Sub-district, Huai Khwang District, Bangkok 10320",
        phone: "+66 2274 4740",
    },
    {
        name: "Brazil",
        address:
            "1168/101 Lumpini Tower, Rama IV Road, 34 F, Tungmahamek, Sathorn, Bangkok 10120",
        phone: "+66 2679 8567",
    },
    {
        name: "Brunei",
        address:
            "12 Ekamai Soi 2, 63 Sukhumvit Road, Phrakhanong Nua District, Wattana, Bangkok 10110",
        phone: "+66 2714 7395 / 7396 / 7397 / 7398 / 7399",
        email: "bangkok.thailand@mfa.gov.bn",
        extra: "Fax: +66 2714 7383",
    },
    {
        name: "Cambodia",
        address:
            "518, 4 Pracha Uthit Road, Wang Thonglang Sub-district, Bangkok 10310",
        phone: "+66 2957 5851 / 5852",
        email: "camemb.tha@mfaic.gov.kh",
    },
    {
        name: "Canada",
        address:
            "6/2 Nang Linchi Soi 2, Nang Linchi Road, Thungmahamek, Sathon, Bangkok 10120",
        phone: "+66 2646 4300",
        email: "bngkk@international.gc.ca",
    },
    {
        name: "Chile",
        address:
            "193/67 Lake Ratchada Office Complex, Ratchadapisek Road, Khlong Toei Sub-district, Khlong Toei District, Bangkok 10110",
        phone: "+66 2261 1000"
    },
    {
        name: "China",
        address:
            "57 Ratchadaphisek Road, Bangkok 10400",
        phone: "+66 2245 0088",
        email: "chinaemb_th@mfa.gov.cn",
        extra: "Fax: +66 2246 8247",
    },
    {
        name: "Colombia",
        address:
            "Athenee Tower, 63 Wireless Road, Lumpini Sub-district, Pathum Wan District, Bangkok, 10330.",
        phone: "+66 2168 8715",
    },
    {
        name: "Czech Republic",
        address:
            "71/6 Soi Ruamrudee 2, Phloen Chit Road, Lumpini Sub-district, Pathum Wan District, Bangkok, 10330",
        phone: "+66 2250 9223"
    },
    {
        name: "Denmark",
        address:
            "10 Sathorn Soi 1 (Soi Attakarn Prasit), South Sathorn Road, Bangkok 10120. Tel: +66 2343 1100. ",
        phone: "+66 2213 1752",
    },
    {
        name: "Egypt",
        address:
            "Sukhumvit Soi 63, Bangkok.",
        phone: "+66 2 726 9831",
        email: "egy.emb.bkk@gmail.com",
    },
    {
        name: "Finland",
        address:
            "63 Athenee Tower, Wireless Road (Witthayu), Lumpini, Pathum Wan, Bangkok 10330",
        phone: "+66 2657 5100 / +66 2627 2100",
        email: "sanomat.ban@formin.fi",
    },
    {
        name: "Germany",
        address:
            "No. 9 South Sathorn Road, Thung Maha Mek, Sathon District, Bangkok 10120",
        phone: "+66 2287 9000"
    },
    {
        name: "Greece",
        address:
            "100/41 Sathorn Nakorn Tower, North Sathorn Road, Silom Sub-district, Bang Rak District, Bangkok 10500.",
        phone: "+66 2667 0090",
        email: "gremb.ban@mfa.gr"
    },
    {
        name: "France",
        address:
            "35 Charoen Krung Soi 36 (Brest Road), Bang Rak, Bangkok 10500",
        phone: "+66 2657 5100 / +66 2627 2100"
    },
    {
        name: "Hungary",
        address:
            "14th Floor, Park Ventures Ecoplex, 57 Wireless Road, Lumpini Sub-district, Pathum Wan District, Bangkok 10330.",
        phone: "+66 2118 9600",
        email: "mission.bgk@mfa.gov.hu",
        extra: "Fax: +66 2118 9601"
    },
    {
        name: "India",
        address:
            "46 Soi Prasarnmitr, Sukhumvit Soi 23, Bangkok 10110",
        phone: "+66 2580 3006",
        email: "indiaemb@indianembassy.in.th",
    },
    {
        name: "Indonesia",
        address:
            "600-602 Sukhumvit Road, Khlong Toei, Bangkok 10110",
        phone: "+66 2 5231 3540",
        email: "bangkok.kbri@kemlu.go.id",
    },
    {
        name: "Ireland",
        address:
            "208 Wireless Road, 12th Floor, Unit 1201, Lumphini, Pathum Wan, Bangkok 10330.",
        phone: "+66 2 011 7200",
    },
    {
        name: "Italy",
        address:
            "87 Wireless Road, All Seasons Place, CRC Tower, Bangkok, Thailand, Bangkok.",
        phone: "+66 2250 4970",
        email: "ambasciata.bangkok@esteri.it",
    },
    {
        name: "Japan",
        address:
            "177 Witthayu Road, Lumphini, Pathum Wan, Bangkok 10330",
        phone: "+66 2207 8500 / +66 2696 3000",
        email: "ryouji-soumu@bg.mofa.go.jp",
    },
    {
        name: "Laos",
        address:
            "Lao People’s Democratic Republic, 520, 502/1-3 Soi Sahakanaphum, Wang Thonglang, Wang Thonglang, Bangkok 10310.",
        phone: "+66 2539 6667"
    },
    {
        name: "Malaysia",
        address:
            "Kronos Sathorn Tower, Level 17, 46 North Sathorn Road, Silom, Bangkok",
        phone: "+66 2340 5720",
        email: "mwbangkok@kln.gov.my",
    },
    {
        name: "Maldives",
        address:
            "355 Suksawat Road Soi 36, Bangpakok, Rasburana, Bangkok 10140.",
        phone: "+66 2428 9292",
        email: "maldives_thailand@srithai.co.th",
        extra: "Fax: +66 2428 9293",
    },
    {
        name: "Myanmar",
        address:
            "132 North Sathorn Road Soi 71, Bangkok 10500.",
        phone: "+66 2333 7250",
        email: "myanmarembassybkk@gmail.com",
        extra: "Fax: +66 2234 6898",
    },
    {
        name: "Philippines",
        address:
            "760 Sukhumvit Road, corner of Soi 30/1 (Soi Philippines), Klongtoei, Bangkok.",
        phone: "+66 2259 0139",
        email: "bangkok.pe@dfa.gov.ph"
    },
    {
        name: "Portugal",
        address:
            "26 Bush Lane, Khwaeng Bang Rak, Bangkok 10500.",
        phone: "+66 2234 2123"
    },
    {
        name: "Russia",
        address:
            "78 SAP Road, Surawong, Bangrak, Bangkok.",
        phone: "+66 2234 9824",
        email: "rusembbangkok@gmail.com"
    },
    {
        name: "Singapore",
        address: "129 South Sathorn Road, Bangkok.",
        phone: "+66 2348 6700",
        email: "singemb_bkk@mfa.sg",
    },
    {
        name: "South Korea",
        address: "23 Thiam-Ruammit Road, Ratchadapisek, Huai-Khwang, Bangkok 10310.",
        phone: "+66 2481 6000",
        email: "koembth@mofa.go.kr"
    },
    {
        name: "Spain",
        address: "193/98-99 Lake Rajada Office Complex, 23 Ratchadapisek Road, Khlong Toei, Bangkok 10110.",
        phone: "+662 6618 2847"
    },
    {
        name: "Sweden",
        address: "140 Sukhumvit Road (between Sukhumvit Soi 4 and 6), Bangkok 10110.",
        phone: "+662263 7200",
        email: "ambassaden.bangkok@gov.se"
    },
    {
        name: "Switzerland",
        address: "35 North Wireless Road (Thanon Witthayu), Bangkok.",
        phone: "+66 2674 6900",
        email: "bangkok@eda.admin.ch"
    },
    {
        name: "Ukraine",
        address: "87/2 All Seasons Place, CRC Tower, 33rd Floor, Wireless Road, Lumpini, Patumwan, Bangkok.",
        phone: "+66 2685 3216",
        email: "emb_th@mfa.gov.ua"
    },
    {
        name: "United Arab Emirates",
        address: "29th Floor, CRC Tower, All Seasons Place, 87/2 Wireless Road, Pathum Wan District, Bangkok, 10330",
        phone: "+66 2402 4000"
    },
    {
        name: "United Kingdom",
        address:
            "AIA Sathorn Tower, 11/1 Sathorn Road, Sathorn, Bangkok",
        phone: "+66 2305 8333",
        email: "Info.Bangkok@fco.gov.uk",
    },
    {
        name: "United States",
        address: "95 Witthayu Road, Bangkok",
        phone: "+66 2205 4000",
    },
    {
        name: "Vietnam",
        address:
            "83/1 Wireless Road, Lumpini, Pathum Wan, Bangkok 10330",
        phone: "+66 2267 9602",
        email: "vnembtl@asianet.co.th",
        extra: "Fax: +66 2254 4630",
    },
];

const EmbassyWidget = () => {
    const { t } = useLanguage();
    const [selected, setSelected] = useState(null);

    const handleChange = (e) => {
        const value = e.target.value;

        if (!value) {
            setSelected(null);
            return;
        }

        const embassy = embassyData.find(
            (item) => item.name === value
        );

        setSelected(embassy || null);
    };

    return (
        <Container className="mt-4">
            <h3 className="mb-3 fw-bold text-center" style={{ color: "#2E3D5D" }}>{t('embassy_finder_title')}</h3>

            <Form.Select onChange={handleChange} className="mb-4">
                <option value="">{t('embassy_select')}</option>
                {embassyData.map((embassy, index) => (
                    <option key={index} value={embassy.name}>
                        {embassy.name}
                    </option>
                ))}
            </Form.Select>

            {selected && (
                <Card className="shadow">
                    <Card.Body>
                        <Card.Title>{selected?.name} Embassy</Card.Title>

                        <p>
                            <strong>{t('embassy_address')}:</strong>{" "}
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected?.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {selected?.address}
                            </a>
                        </p>

                        {selected?.phone && (
                            <p>
                                <strong>{t('embassy_phone')}:</strong>{" "}
                                <a href={`tel:${selected.phone}`}>
                                    {selected.phone}
                                </a>
                            </p>
                        )}

                        {selected?.email && (
                            <p>
                                <strong>{t('embassy_email')}:</strong>{" "}
                                <a href={`mailto:${selected.email}`}>
                                    {selected.email}
                                </a>
                            </p>
                        )}

                        {selected?.extra && (
                            <p><strong>{t('embassy_other')}:</strong> {selected.extra}</p>
                        )}
                    </Card.Body>
                </Card>
            )}

            {selected && (
                <div className="mt-3 rounded overflow-hidden shadow">
                    <iframe
                        title={`${selected.name} Embassy Map`}
                        width="100%"
                        height="350"
                        style={{ border: 0, display: "block" }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(selected.address)}&output=embed`}
                    />
                </div>
            )}
        </Container>
    );
};
export default EmbassyWidget;