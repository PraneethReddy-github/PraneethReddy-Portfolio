import React, { useState, useEffect } from 'react';

export default function WikipediaProfile({ onNavigate, darkMode }) {
    const [activeSection, setActiveSection] = useState('top_anchor');

    const scrollToSection = (id) => {
        const container = document.getElementById('wiki-scroll-container');
        if (!container) return;
        if (id === 'top_anchor') { container.scrollTo({ top: 0, behavior: 'smooth' }); return; }
        const el = document.getElementById(id);
        if (el) {
            const offset = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
            container.scrollTo({ top: offset - 60, behavior: 'smooth' });
        }
    };

    // Wikipedia exact colors (Vector 2022)
    const c = {
        bg: darkMode ? '#101418' : '#ffffff',
        headerBg: darkMode ? '#202122' : '#ffffff',
        contentBg: darkMode ? '#101418' : '#ffffff',
        text: darkMode ? '#e8eaed' : '#202122',
        textMuted: darkMode ? '#9aa0a6' : '#54595d',
        link: darkMode ? '#8ab4f8' : '#3366cc',
        border: darkMode ? '#30363d' : '#a2a9b1',
        borderLight: darkMode ? '#30363d' : '#eaecf0',
        searchBg: darkMode ? '#101418' : '#f8f9fa',
        searchBorder: darkMode ? '#30363d' : '#a2a9b1',
        infoboxBg: darkMode ? '#161b22' : '#f8f9fa',
        infoboxHeader: darkMode ? '#2d333b' : '#eaecf0',
        tabActive: darkMode ? '#e8eaed' : '#202122',
        tabActiveBorder: darkMode ? '#e8eaed' : '#202122',
        tocActiveText: darkMode ? '#e8eaed' : '#202122',
        tocText: darkMode ? '#8ab4f8' : '#3366cc',
        wikitableHeader: darkMode ? '#161b22' : '#eaecf0',
    };

    const toc = [
        ['top_anchor', '(Top)'], ['about_sec', '1 About Me'], ['exp_sec', '2 Work Experience'],
        ['edu_sec', '3 Education'], ['skills_sec', '4 Technical Skills'], ['proj_sec', '5 Projects'],
        ['pub_sec', '6 Publications & Patents'], ['cer_sec', '7 Certifications'], ['extra_sec', '8 Extra-Curriculars']
    ];

    const Link = ({ children, href }) => {
        const handleClick = () => {
            if (href) window.open(href, '_blank');
        };
        return (
            <span
                onClick={handleClick}
                style={{ color: c.link, cursor: 'pointer', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >{children}</span>
        );
    };

    const SectionHeader = ({ id, title }) => (
        <h2 id={id} style={{ fontSize: '1.5em', fontFamily: "'Linux Libertine', Georgia, serif", fontWeight: 'normal', borderBottom: `1px solid ${c.borderLight}`, paddingBottom: '0.25em', margin: '1em 0 0.25em 0', color: c.text, lineHeight: '1.3' }}>
            {title}
            <span style={{ fontSize: 'small', fontWeight: 'normal', marginLeft: '1em', color: c.textMuted, fontFamily: 'sans-serif' }}>
                [<Link>edit</Link>]
            </span>
        </h2>
    );

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', backgroundColor: c.bg, color: c.text, overflow: 'hidden', fontSize: '0.875em', lineHeight: '1.6' }}>
            <style>{`
                .wiki-container {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                    max-width: 1400px;
                    margin: 0 auto;
                    width: 100%;
                }
                .wiki-toc {
                    width: 250px;
                    flex-shrink: 0;
                    padding: 32px 24px;
                    overflow-y: auto;
                    display: block;
                }
                .wiki-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 32px 48px 64px 24px;
                    scroll-behavior: smooth;
                }
                .wiki-infobox {
                    float: right;
                    width: 280px;
                    margin: 0 0 1em 1em;
                    border: 1px solid ${c.border};
                    background-color: ${c.infoboxBg};
                    font-size: 88%;
                    line-height: 1.5;
                    clear: right;
                }
                .wiki-table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1em 0;
                    border: 1px solid ${c.border};
                }
                .wiki-table th, .wiki-table td {
                    border: 1px solid ${c.border};
                    padding: 0.2em 0.4em;
                }
                .wiki-table th {
                    background-color: ${c.wikitableHeader};
                    text-align: left;
                }
                .wiki-toc-item {
                    padding: 4px 0;
                    font-size: 14px;
                    cursor: pointer;
                    color: ${c.link};
                    line-height: 1.4;
                }
                .wiki-toc-item:hover {
                    text-decoration: underline;
                }
                @media (max-width: 1024px) {
                    .wiki-toc {
                        display: none;
                    }
                    .wiki-content {
                        padding: 24px;
                    }
                }
                @media (max-width: 768px) {
                    .wiki-infobox {
                        float: none;
                        width: 100%;
                        margin: 1em 0;
                    }
                }
            `}</style>

            {/* Wikipedia Header (Vector 2022) */}
            <div style={{ flexShrink: 0, backgroundColor: c.headerBg, borderBottom: `1px solid ${c.borderLight}`, height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 100 }}>
                {/* Left: Hamburger + Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <svg viewBox="0 0 20 20" style={{ width: '20px', height: '20px', fill: c.text, cursor: 'pointer' }}><path d="M1 3v2h18V3H1zm0 8h18V9H1v2zm0 6h18v-2H1v2z" /></svg>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <img src="/chrome/images/wikipedia.png" alt="Wikipedia" style={{ width: '28px', height: '28px' }} />
                        <div>
                            <div style={{ fontSize: '18px', fontFamily: "'Linux Libertine', Georgia, serif", color: c.text, lineHeight: '1' }}>WIKIPEDIA</div>
                            <div style={{ fontSize: '10px', color: c.textMuted, fontFamily: 'sans-serif', marginTop: '2px', letterSpacing: '0.2px' }}>The Free Encyclopedia</div>
                        </div>
                    </div>
                </div>

                {/* Center: Search */}
                <div style={{ flex: '0 1 500px', margin: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: c.searchBg, border: `1px solid ${c.searchBorder}`, borderRadius: '2px', padding: '0 8px', height: '32px' }}>
                        <svg viewBox="0 0 20 20" style={{ width: '18px', height: '18px', fill: c.textMuted, marginRight: '8px' }}><path d="M12.2 13.6a7 7 0 111.4-1.4l5.4 5.4-1.4 1.4-5.4-5.4zM13 8a5 5 0 10-10 0 5 5 0 0010 0z" /></svg>
                        <input placeholder="Search Wikipedia" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: c.text, width: '100%', padding: '0' }} />
                        <span style={{ fontSize: '12px', color: c.textMuted, border: `1px solid ${c.border}`, borderRadius: '2px', padding: '1px 4px', background: darkMode ? '#222' : '#fff' }}>Search</span>
                    </div>
                </div>

                {/* Right: Tools */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: c.text }}>
                    <span style={{ cursor: 'pointer' }}>Donate</span>
                    <span style={{ cursor: 'pointer', fontWeight: 'bold' }}>Create account</span>
                    <span style={{ cursor: 'pointer' }}>Log in</span>
                    <svg viewBox="0 0 20 20" style={{ width: '20px', height: '20px', fill: c.text, cursor: 'pointer' }}><path d="M4 10a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
            </div>

            <div className="wiki-container">
                {/* Sticky Sidebar TOC */}
                <nav className="wiki-toc">
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: c.text, marginBottom: '8px' }}>Contents</div>
                    <div style={{ borderTop: `1px solid ${c.borderLight}`, paddingTop: '8px' }}>
                        {toc.map(([id, label]) => (
                            <div key={id} className="wiki-toc-item" onClick={() => scrollToSection(id)}>
                                {label}
                            </div>
                        ))}
                    </div>
                </nav>

                {/* Main Content */}
                <div id="wiki-scroll-container" className="wiki-content">
                    <div style={{ maxWidth: '960px', margin: '0 auto' }}>

                        {/* Article heading */}
                        <h1 style={{ fontSize: '2.5em', fontFamily: "'Linux Libertine', Georgia, serif", fontWeight: 'normal', margin: '0 0 0.2em 0', color: c.text, lineHeight: '1.2' }}>P Praneeth Reddy</h1>

                        {/* Toolbar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${c.borderLight}`, marginBottom: '16px', alignItems: 'flex-end', userSelect: 'none' }}>
                            <div style={{ display: 'flex' }}>
                                <div style={{ padding: '8px 12px', borderBottom: `2px solid ${c.tabActiveBorder}`, color: c.tabActive, cursor: 'pointer' }}>Article</div>
                                <div style={{ padding: '8px 12px', color: c.link, cursor: 'pointer' }}>Talk</div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={{ padding: '8px 12px', borderBottom: `2px solid transparent`, color: c.text, cursor: 'pointer' }}>Read</div>
                                <div style={{ padding: '8px 12px', color: c.link, cursor: 'pointer' }}>Edit</div>
                                <div style={{ padding: '8px 12px', color: c.link, cursor: 'pointer' }}>View history</div>
                                <div style={{ padding: '8px 12px', color: c.link, cursor: 'pointer' }}>Tools ▾</div>
                            </div>
                        </div>

                        <div style={{ fontSize: '0.85em', color: c.textMuted, marginBottom: '1em', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontStyle: 'italic' }}>From Wikipedia, the free encyclopedia</span>
                            <span><Link>Coordinates</Link>: 12°97′N 77°59′E</span>
                        </div>

                        {/* Body: Content + Infobox */}
                        <div>
                            {/* Infobox */}
                            <table className="wiki-infobox">
                                <thead>
                                    <tr><th colSpan={2} style={{ backgroundColor: c.infoboxHeader, padding: '0.4em', textAlign: 'center', fontSize: '1.25em', color: c.text }}>P Praneeth Reddy</th></tr>
                                    <tr><td colSpan={2} style={{ textAlign: 'center', padding: '0.4em', fontWeight: 'bold' }}>Software Developer & DevOps Engineer</td></tr>
                                    <tr>
                                        <td colSpan={2} style={{ padding: '0.8em', textAlign: 'center', borderBottom: `1px solid ${c.border}` }}>
                                            <img src="/images/gallery/wiki-profile.jpeg" alt="Praneeth" style={{ width: '220px', height: '220px', objectFit: 'cover', border: `1px solid ${c.borderLight}`, display: 'block', margin: '0 auto' }} onError={(e) => { e.target.src = 'https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org'; }} />
                                            <div style={{ fontSize: '0.9em', marginTop: '4px' }}>Praneeth Reddy in 2024</div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['Born', 'June 7, 2003 (age 22)\nBengaluru, India'],
                                        ['Nationality', 'Indian'],
                                        ['Education', <><Link>Amrita Vishwa Vidyapeetham</Link><br />(B.Tech CSE)</>],
                                        ['Occupation', 'Software Developer &\nDevOps Engineer'],
                                        ['Employer', <Link>Simnovus</Link>],
                                        ['Languages', 'English, Telugu, Kannada, Hindi, Tamil, German'],
                                        ['Programming', 'C++, Python, Java, Go, SQL, JavaScript'],
                                    ].map(([label, val], i) => (
                                        <tr key={i}>
                                            <th style={{ textAlign: 'left', padding: '0.4em', fontWeight: 'bold', width: '35%', verticalAlign: 'top', borderTop: `1px solid ${c.borderLight}` }}>{label}</th>
                                            <td style={{ padding: '0.4em', whiteSpace: 'pre-line', borderTop: `1px solid ${c.borderLight}` }}>{val}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Intro text */}
                            <p style={{ margin: '0.5em 0' }}>
                                <b>P Praneeth Reddy</b> (born June 7, 2003) is an Indian <Link>software developer</Link> and <Link>DevOps engineer</Link> specializing in telecommunications simulation platforms, virtualization automation infrastructure, distributed systems orchestration, and Cloud/DevOps pipeline workflows. He is currently working as a Software Developer & DevOps Engineer at <Link>Simnovus</Link>.
                            </p>
                            <p style={{ margin: '0.5em 0' }}>
                                Praneeth Reddy has published several research papers on <Link>cloud security</Link> anomalies, <Link>polarization-encoded QKD</Link> eavesdropping detection, and passwordless encrypted storage architectures. He holds Indian patents in the fields of automated road repairs and hospital inventories.
                            </p>

                            {/* About Me */}
                            <SectionHeader id="about_sec" title="About Me" />
                            <p style={{ margin: '0.5em 0' }}>Praneeth Reddy speaks <Link>English, Hindi, Kannada, Telugu, Tamil</Link>, and a bit of <Link>German</Link>. His mother tongue is Telugu, and he has always enjoyed the rich linguistic diversity around him.</p>
                            <p style={{ margin: '0.5em 0' }}>He has had the opportunity to travel to many places, each journey adding to his experiences and understanding of different <Link>cultures</Link>. His love for exploration extends to his professional life as well — working on a variety of projects focusing on <Link>IoT-based innovations and software engineering</Link>.</p>

                            {/* Work Experience */}
                            <SectionHeader id="exp_sec" title="Work Experience" />
                            <p style={{ margin: '0.5em 0' }}><b>Software Developer & DevOps Engineer</b> at <Link>Simnovus</Link> (Feb 2025 – Present)</p>
                            <ul style={{ margin: '0.3em 0 0.5em 2em' }}>
                                <li>Orchestrating virtualization environment architectures and provisioning automated simulation nodes using <Link>GoLang</Link> and shell automation.</li>
                                <li>Developing robust backend services and REST APIs, and automating deployments using Docker containerization and AWS infrastructure.</li>
                            </ul>

                            <p style={{ margin: '0.5em 0' }}><b>Machine Learning Intern</b> at <Link>Infosys Springboard</Link> (Oct 2024 – Dec 2024)</p>
                            <ul style={{ margin: '0.3em 0 0.5em 2em' }}>
                                <li>Built advanced machine learning models for anomaly detection and network traffic classification.</li>
                                <li>Honed skills in data preparation, exploratory data analysis, and model pipeline engineering.</li>
                            </ul>

                            {/* Education */}
                            <SectionHeader id="edu_sec" title="Education" />
                            <p style={{ margin: '0.5em 0' }}>Praneeth's educational journey began at <b>New Baldwin International School, Bangalore</b>, where he completed his <b>10th grade</b> securing <b>91.6%</b>. For <b>11th and 12th grades</b>, he attended <b>Narayana E Techno School, Bangalore</b> securing <b>91.0%</b>. He is currently pursuing a <Link>B.Tech in Computer Science Engineering</Link> at <b>Amrita Vishwa Vidyapeetham</b> with an <b>8.01 CPI</b>.</p>

                            <table className="wiki-table">
                                <thead>
                                    <tr>
                                        <th>Degree</th>
                                        <th>Specialization</th>
                                        <th>Institute</th>
                                        <th>Year</th>
                                        <th>CPI/%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['B.Tech', 'Computer Science and Engineering', 'Amrita Vishwa Vidyapeetham', '2025', '8.01/10'],
                                        ['12th-CBSE', 'Physics, Chemistry & Mathematics', 'Narayana E Techno College', '2021', '91.0%'],
                                        ['10th-ICSE', '–', 'New Baldwin International School', '2019', '91.6%']
                                    ].map((row, i) => (
                                        <tr key={i}>
                                            <td>{row[0]}</td>
                                            <td>{row[1]}</td>
                                            <td><Link>{row[2]}</Link></td>
                                            <td>{row[3]}</td>
                                            <td>{row[4]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Skills */}
                            <SectionHeader id="skills_sec" title="Technical Skills" />
                            <ul style={{ margin: '0.3em 0 0.5em 2em' }}>
                                <li><b>Languages:</b> GoLang, Python, C/C++, Java, SQL, Shell Scripting, JavaScript.</li>
                                <li><b>Frameworks & Libraries:</b> React.js, Angular, Node.js, Flask, Streamlit, Pandas, NumPy, Keras.</li>
                                <li><b>Cloud & DevOps:</b> Amazon Web Services (AWS), Docker, Jenkins CI/CD, Git, Linux Systems.</li>
                                <li><b>Security & Hardware:</b> SSL/TLS, Cryptographic Algorithms, Quantum Key Distribution, Arduino IoT.</li>
                            </ul>

                            {/* Projects */}
                            <SectionHeader id="proj_sec" title="Projects" />
                            <ul style={{ margin: '0.3em 0 0.5em 2em' }}>
                                <li><Link>Real-Time System Resource Monitoring Dashboard</Link> — Designed a real-time tracking interface for virtualization resources using GoLang and React socket interfaces.</li>
                                <li><Link>Secure Client-Server Communication</Link> — Programmed encrypted terminal sockets in C++ utilizing hybrid RSA-AES and SSL handshake structures.</li>
                                <li><Link>Road Safety and Accident Prevention Using RF</Link> — Assembled an IoT road safety module that actively controls motor speed based on RF zone warnings.</li>
                                <li><Link>Genetic Algorithm for Vehicle Routing</Link> — Optimized logistics routing using evolutionary computation approaches.</li>
                            </ul>

                            {/* Publications */}
                            <SectionHeader id="pub_sec" title="Publications & Patents" />
                            <h3 style={{ fontSize: '1.2em', fontFamily: 'sans-serif', fontWeight: 'bold', margin: '1em 0 0.5em 0', color: c.text }}>Patents</h3>
                            <ol style={{ margin: '0.3em 0 0.5em 2em' }}>
                                <li style={{ marginBottom: '1em' }}>
                                    <Link>Pothole Detection and Repair System and Method Thereof</Link> — <i>Indian Patent (2025)</i>
                                    <p style={{ margin: '0.2em 0 0 0', fontSize: '0.9em', color: c.textMuted }}>Developed an automated road maintenance system capable of detecting potholes using image acquisition and processing. Integrated computer vision, geolocation tracking, and automated filler dispensing mechanisms to perform real-time repairs.</p>
                                </li>
                                <li style={{ marginBottom: '1em' }}>
                                    <Link>IoT-Enabled Pharmaceutical Inventory Management System for Hospital Pharmacies</Link> — <i>Indian Patent (2024)</i>
                                    <p style={{ margin: '0.2em 0 0 0', fontSize: '0.9em', color: c.textMuted }}>Designed an IoT-based smart inventory system to automate pharmaceutical stock management. Implemented barcode scanning, real-time inventory tracking, automated restocking alerts, and expiry monitoring using ESP32, PHP, MySQL, and web-based dashboards.</p>
                                </li>
                            </ol>
                            <h3 style={{ fontSize: '1.2em', fontFamily: 'sans-serif', fontWeight: 'bold', margin: '1em 0 0.5em 0', color: c.text }}>IEEE Publications</h3>
                            <ul style={{ margin: '0.3em 0 0.5em 2em' }}>
                                <li style={{ marginBottom: '1em' }}>
                                    <Link>Multi-Client Server Based Quantum Key Distribution</Link> — <i>16th ICCCNT, IIT Indore (Jul 2025)</i>
                                    <p style={{ margin: '0.2em 0 0 0', fontSize: '0.9em', color: c.textMuted }}>Designed a quantum-secure communication framework for distributed systems using Quantum Key Distribution (QKD) to enable scalable and secure key exchange between multiple clients and servers.</p>
                                </li>
                                <li style={{ marginBottom: '1em' }}>
                                    <Link href="https://ieeexplore.ieee.org/document/11118829">Cloud-Based Real-Time Anomaly Detection in Network Traffic</Link> — <i>ICOCT, Bengaluru (Jun 2025)</i>
                                    <p style={{ margin: '0.2em 0 0 0', fontSize: '0.9em', color: c.textMuted }}>Implemented a machine learning-based anomaly detection system for network traffic monitoring using cloud infrastructure. Built real-time analytics pipelines for detecting suspicious activities in distributed network environments.</p>
                                </li>
                                <li style={{ marginBottom: '1em' }}>
                                    <Link href="https://ieeexplore.ieee.org/document/11118777/">CloudShare: Passwordless Cloud-Based File Storage & Sharing Framework</Link> — <i>ICOCT, Bengaluru (Jun 2025)</i>
                                    <p style={{ margin: '0.2em 0 0 0', fontSize: '0.9em', color: c.textMuted }}>Developed a secure cloud storage framework eliminating traditional password authentication using asymmetric cryptography and challenge-response protocols. Integrated secure file sharing with AES encryption.</p>
                                </li>
                                <li style={{ marginBottom: '1em' }}>
                                    <Link href="https://ieeexplore.ieee.org/document/10760890/">Development of a Robust Emergency Communication System Utilizing LoRa and GPS with Multi-Hop Routing</Link> — <i>ICSSAS (Oct 2024)</i>
                                    <p style={{ margin: '0.2em 0 0 0', fontSize: '0.9em', color: c.textMuted }}>Proposed a long-range emergency communication system using LoRa modules and GPS-based location tracking. Implemented a multi-hop mesh routing architecture for transmitting distress signals in disaster scenarios.</p>
                                </li>
                                <li style={{ marginBottom: '1em' }}>
                                    <Link href="https://ieeexplore.ieee.org/document/10725878/">License Plate Detection and Recognition Using YOLOv8 and OCR</Link> — <i>15th ICCCNT, IIT Mandi (Jun 2024)</i>
                                    <p style={{ margin: '0.2em 0 0 0', fontSize: '0.9em', color: c.textMuted }}>Developed a computer vision based automatic license plate recognition system using YOLOv8 object detection and evaluated multiple OCR engines including EasyOCR, PaddleOCR, and Tesseract for character extraction.</p>
                                </li>
                                <li style={{ marginBottom: '1em' }}>
                                    <Link href="https://ieeexplore.ieee.org/document/10724212/">Improvising Energy Efficiency of Heterogeneous Servers using AWS Services and Machine Learning Approaches</Link> — <i>IEEE ICCCNT (Jun 2024)</i>
                                    <p style={{ margin: '0.2em 0 0 0', fontSize: '0.9em', color: c.textMuted }}>Proposed a machine learning-based approach to optimize energy consumption in cloud infrastructure. Implemented regression models and deployed containerized workloads using AWS EC2 and Docker.</p>
                                </li>
                                <li style={{ marginBottom: '1em' }}>
                                    <Link href="https://ieeexplore.ieee.org/document/10690031/">Crop Damage Prediction using Machine Learning Approaches</Link> — <i>RAICS (Dec 2023)</i>
                                    <p style={{ margin: '0.2em 0 0 0', fontSize: '0.9em', color: c.textMuted }}>Developed a machine learning model for agricultural crop damage prediction using classification algorithms such as Gradient Boosting and Neural Networks to improve accuracy in crop health analysis.</p>
                                </li>
                            </ul>

                            {/* Certifications */}
                            <SectionHeader id="cer_sec" title="Certifications" />
                            <div style={{ columnCount: 2, columnGap: '2em' }}>
                                <ul style={{ margin: '0.3em 0 0.5em 2em' }}>
                                    <li>AWS Academy Graduate – Cloud Architecting</li>
                                    <li>AWS Academy Graduate – Cloud Security Foundations</li>
                                    <li>AWS Academy Graduate – Cloud Foundations</li>
                                    <li>Data Manipulation with NumPy and Pandas</li>
                                    <li>Deep Learning with Keras & TensorFlow</li>
                                    <li>Applied Gen AI and NLP Certificate</li>
                                </ul>
                            </div>

                            {/* Extra-Curriculars */}
                            <SectionHeader id="extra_sec" title="Extra-Curriculars" />
                            <ul style={{ margin: '0.3em 0 0.5em 2em' }}>
                                <li><b>Participated in Live in Labs</b> (Jan 2024) — Solved real-world problems in a village setting.</li>
                                <li><b>Office Bearer of The Epic Club</b> (Jan 2023 – Jan 2024) — Managed videography club activities.</li>
                                <li><b>Volunteered in Ayudh</b> (Jan 2022) — Assisted at Asia's largest hospital in Faridabad.</li>
                                <li><b>Earned a Black Belt in Karate</b> (Jan 2020) — Specialized in Shitō-ryū karate.</li>
                            </ul>

                            {/* External Links */}
                            <SectionHeader id="ext_sec" title="External links" />
                            <ul style={{ margin: '0.3em 0 0.5em 2em' }}>
                                <li>
                                    <span onClick={() => window.open('https://ieeexplore.ieee.org/author/677775936439100', '_blank')} style={{ color: c.link, cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>P Praneeth Reddy's publications</span> on IEEE Xplore
                                </li>
                                <li>
                                    <span onClick={() => window.open('https://github.com/PraneethReddy-github', '_blank')} style={{ color: c.link, cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>P Praneeth Reddy</span> on GitHub
                                </li>
                                <li>
                                    <span onClick={() => window.open('https://www.linkedin.com/in/connectwithpraneeth/', '_blank')} style={{ color: c.link, cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>P Praneeth Reddy</span> on LinkedIn
                                </li>
                            </ul>
                        </div>

                        {/* Footer */}
                        <div style={{ borderTop: `1px solid ${c.borderLight}`, marginTop: '3em', padding: '1em 0 3em 0', fontSize: '0.9em', color: c.textMuted }}>
                            <p style={{ margin: '0 0 0.5em 0' }}>This page was last edited on 27 May 2026. Text is available under the <Link>Creative Commons Attribution-ShareAlike License</Link>; additional terms may apply.</p>
                            <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap' }}>
                                <Link>Privacy policy</Link>
                                <Link>About Wikipedia</Link>
                                <Link>Disclaimers</Link>
                                <Link>Contact Wikipedia</Link>
                                <Link>Code of Conduct</Link>
                                <Link>Developers</Link>
                                <Link>Statistics</Link>
                                <Link>Cookie statement</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
