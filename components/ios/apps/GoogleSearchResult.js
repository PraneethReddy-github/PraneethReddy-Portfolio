import React, { useState } from 'react';

export default function GoogleSearchResult({ query, onSearch, onNavigate, darkMode }) {
    const [inputValue, setInputValue] = useState(query || 'Praneeth Reddy');
    const [activeTab, setActiveTab] = useState('All');
    const [selectedImage, setSelectedImage] = useState(null);
    const [openPaa, setOpenPaa] = useState({
        0: false,
        1: false,
        2: false,
        3: false
    });

    const galleryImages = [
        'wiki-profile.jpeg',
        'gallery-1.jpeg',
        'gallery-2.jpeg',
        'gallery-3.jpeg',
        'gallery-4.jpeg',
        'gallery-5.jpeg',
        'gallery-6.jpeg',
        'gallery-7.jpeg',
        'gallery-8.jpeg',
        'gallery-9.jpeg',
        'gallery-10.jpeg',
        'gallery-11.jpeg',
        'gallery-12.jpeg',
        'gallery-13.jpeg',
        'gallery-14.jpeg',
        'gallery-15.jpeg',
        'gallery-16.jpeg',
        'gallery-17.jpeg',
        'gallery-18.jpeg',
        'gallery-19.jpeg',
        'gallery-20.jpeg',
        'gallery-21.jpeg',
        'gallery-22.jpeg',
        'gallery-23.jpeg',
        'gallery-24.jpeg',
        'gallery-25.jpeg',
        'gallery-26.jpeg',
        'gallery-27.jpeg',
        'gallery-28.jpeg',
        'gallery-29.jpeg',
        'gallery-30.jpeg',
        'gallery-31.jpeg',
        'gallery-32.jpeg',
        'gallery-33.jpeg',
        'gallery-34.jpeg',
        'gallery-35.jpeg',
        'gallery-36.jpeg',
        'gallery-37.jpeg',
        'gallery-38.jpeg',
        'gallery-39.jpeg'
    ];

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch(inputValue);
        }
    };

    const handleSearchClick = () => {
        onSearch(inputValue);
    };

    const handleClear = () => {
        setInputValue('');
        document.getElementById('google-search-input')?.focus();
    };

    const togglePaa = (index) => {
        setOpenPaa(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const bg = darkMode ? '#202124' : '#ffffff';
    const textPrimary = darkMode ? '#e8eaed' : '#202124';
    const textSecondary = darkMode ? '#bdc1c6' : '#4d5156';
    const textMuted = darkMode ? '#9aa0a6' : '#70757a';
    const linkColor = darkMode ? '#8ab4f8' : '#1a0dab';
    const urlColor = darkMode ? '#bdc1c6' : '#202124';
    const headerBg = darkMode ? '#202124' : '#ffffff';
    const headerBorder = darkMode ? '#3c4043' : '#ebebeb';

    const inputBg = darkMode ? '#303134' : '#ffffff';
    const inputBorder = darkMode ? '#5f6368' : '#dfe1e5';
    const inputShadow = darkMode ? 'none' : '0 2px 5px 1px rgba(64,60,67,.16)';

    const panelBg = darkMode ? '#202124' : '#ffffff';
    const panelBorder = darkMode ? '#3c4043' : '#dadce0';
    const dividerColor = darkMode ? '#3c4043' : '#ebebeb';
    const tabActiveColor = darkMode ? '#8ab4f8' : '#1a73e8';
    const sitelinkBg = darkMode ? '#303134' : '#f1f3f4';
    const iconColor = darkMode ? '#9aa0a6' : '#70757a';

    const results = [
        {
            url: '/chrome/homepage.html',
            displayUrl: 'https://en.wikipedia.org › wiki › P_Praneeth_Reddy',
            siteName: 'Wikipedia',
            favicon: 'https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org',
            title: 'P Praneeth Reddy - Wikipedia',
            description: 'P Praneeth Reddy is a Software Developer and DevOps Engineer at Simnovus, specializing in high-performance networking simulators...',
            sitelinks: [
                { hash: '#edu_section', title: 'Education', desc: 'B.Tech in Computer Science & Engineering...' },
                { hash: '#skills_section', title: 'Technical Skills', desc: 'Proficient in Python, GoLang, Java...' },
                { hash: '#project_section', title: 'Projects', desc: 'Real-Time System Resource Monitor...' },
                { hash: '#pub_section', title: 'Research Publications', desc: 'QKD (IIT Indore, 2025), Spark Anomaly...' }
            ]
        },
        {
            url: '/chrome/homepage.html#edu_section',
            displayUrl: 'https://en.wikipedia.org › wiki › Education',
            siteName: 'Wikipedia',
            favicon: 'https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org',
            title: 'Education - P Praneeth Reddy',
            description: 'B.Tech in Computer Science & Engineering from Amrita Vishwa Vidyapeetham, Bangalore (2025) with an 8.01/10 CPI...'
        },
        {
            url: 'https://www.linkedin.com/in/connectwithpraneeth/',
            displayUrl: 'https://in.linkedin.com › connectwithpraneeth',
            siteName: 'LinkedIn',
            favicon: 'https://www.google.com/s2/favicons?sz=64&domain=linkedin.com',
            title: 'Praneeth Reddy - Software Developer - Simnovus',
            description: 'Bengaluru, Karnataka, India · Software Developer · Simnovus. Highly proficient in Python, GoLang, Java, C/C++, SQL, and Shell Scripting...'
        },
        {
            url: 'https://github.com/PraneethReddy-github',
            displayUrl: 'https://github.com › PraneethReddy-github',
            siteName: 'GitHub',
            favicon: 'https://www.google.com/s2/favicons?sz=64&domain=github.com',
            title: 'PraneethReddy-github - Overview',
            description: 'Key projects include a Real-Time System Resource Monitoring Dashboard (2025), vehicle speed control and accident prevention using RF (2024)...'
        },
        {
            url: '/chrome/homepage.html#pub_section',
            displayUrl: 'https://en.wikipedia.org › wiki › Publications',
            siteName: 'Wikipedia',
            favicon: 'https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org',
            title: 'Research Publications & Patents - P Praneeth Reddy',
            description: 'Published research in QKD (IIT Indore, 2025), cloud-based network traffic anomaly detection (ICOCT, 2025), Passwordless CloudShare storage...'
        }
    ];

    const paaItems = [
        { q: "What is P Praneeth Reddy's specialization?", a: "P Praneeth Reddy is a full-stack developer with experience in building web applications and automation scripts. He specializes in cloud infrastructure, virtualization environment orchestration, CI/CD automated deployment workflows..." },
        { q: "Where does P Praneeth Reddy currently work?", a: "Praneeth Reddy works as a Software Developer & DevOps Engineer at Simnovus in Bengaluru, India." },
        { q: "Has P Praneeth Reddy published any patents?", a: "Yes, Praneeth Reddy has published two Indian Patents: an automated road pothole detection and repair system (published in Jan 2025) and an IoT-based hospital pharmaceutical inventory management system (published in Mar 2024)." },
        { q: "What is P Praneeth Reddy's academic qualification?", a: "He is completing his B.Tech in Computer Science and Engineering from Amrita Vishwa Vidyapeetham, Bangalore (2021-2025) with a cumulative grade point average of 8.01/10." }
    ];

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Roboto, arial, sans-serif', backgroundColor: bg, color: textPrimary, overflowY: 'auto', overflowX: 'hidden' }}>
            <div style={{ flexShrink: 0, backgroundColor: headerBg, position: 'sticky', top: 0, zIndex: 10, borderBottom: `1px solid ${headerBorder}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
                    <div style={{ padding: '8px', marginLeft: '-8px', cursor: 'pointer' }}>
                        <svg focusable="false" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: iconColor }}>
                            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                        </svg>
                    </div>

                    <div
                        onClick={() => onNavigate('https://www.google.com/webhp?igu=1', 'https://www.google.com', 'Google')}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {darkMode ? (
                            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png" alt="Google" style={{ height: '24px' }} />
                        ) : (
                            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" style={{ height: '24px' }} />
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/images/logos/pfp.jpg" alt="Profile" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://www.google.com/s2/favicons?sz=64&domain=google.com'; }} />
                    </div>
                </div>

                <div style={{ padding: '0 16px 12px 16px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        height: '44px', padding: '0 12px 0 16px', borderRadius: '24px',
                        border: `1px solid ${inputBorder}`, backgroundColor: inputBg,
                        boxShadow: inputShadow
                    }}>
                        <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: iconColor, marginRight: '12px' }}><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                        
                        <input
                            id="google-search-input"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '16px', color: textPrimary, minWidth: 0, padding: 0 }}
                        />

                        {inputValue && (
                            <div onClick={handleClear} style={{ padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: iconColor }}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                            </div>
                        )}
                        <div style={{ padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
                            <svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
                                <path fill="#4285f4" d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path>
                                <path fill="#34a853" d="m11 18.08h2v3.92h-2z"></path>
                                <path fill="#fbbc04" d="m7.05 16.87c-1.27-1.33-2.05-2.8-2.05-4.67h2c0 1.45.56 2.42 1.47 3.38v.32l-1.15 1.18z"></path>
                                <path fill="#ea4335" d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '0 16px', gap: '24px', fontSize: '14px', scrollbarWidth: 'none' }}>
                    <style>{`
                        .google-tabs::-webkit-scrollbar { display: none; }
                    `}</style>
                    {['All', 'Images', /* 'Videos', */ 'News', 'Maps'].map(tab => (
                        <div
                            key={tab}
                            onClick={() => { setActiveTab(tab); setSelectedImage(null); window.scrollTo(0, 0); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '10px', whiteSpace: 'nowrap',
                                borderBottom: activeTab === tab ? `3px solid ${tabActiveColor}` : '3px solid transparent',
                                color: activeTab === tab ? tabActiveColor : textSecondary,
                                fontWeight: activeTab === tab ? 500 : 400,
                                cursor: 'pointer'
                            }}
                        >
                            <span>{tab}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1 }}>
                {activeTab === 'Images' ? (
                    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedImage ? (
                            <div style={{ backgroundColor: panelBg, borderRadius: '12px', overflow: 'hidden', border: `1px solid ${panelBorder}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${panelBorder}` }}>
                                    <div style={{ fontSize: '14px', color: textSecondary }}>Images may be subject to copyright.</div>
                                    <svg onClick={() => setSelectedImage(null)} viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: iconColor, cursor: 'pointer' }}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                                </div>
                                <img src={`/images/gallery/${selectedImage}`} alt="Selected" onDoubleClick={() => onNavigate(`/chrome/image_viewer.html?img=${selectedImage}`, `/images/gallery/${selectedImage}`, 'Gallery Viewer', true)} style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', backgroundColor: darkMode ? '#000' : '#f1f3f4', cursor: 'pointer' }} />
                                <div style={{ padding: '16px' }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: 500, margin: '0 0 8px 0', color: textPrimary }}>P Praneeth Reddy</h2>
                                    <div style={{ fontSize: '14px', color: textSecondary, marginBottom: '16px' }}>Praneeth's Gallery</div>
                                    <button
                                        onClick={() => onNavigate('/chrome/homepage.html', 'https://en.wikipedia.org/wiki/P_Praneeth_Reddy', 'Praneeth Reddy - Wikipedia')}
                                        style={{ width: '100%', padding: '10px', backgroundColor: sitelinkBg, border: 'none', borderRadius: '24px', color: textPrimary, fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                    >
                                        Visit Profile
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {galleryImages.map((img, idx) => (
                                    <div key={idx} onClick={() => setSelectedImage(img)} onDoubleClick={() => onNavigate(`/chrome/image_viewer.html?img=${img}`, `/images/gallery/${img}`, 'Gallery Viewer', true)} style={{ aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', backgroundColor: panelBg }}>
                                        <img src={`/images/gallery/thumbnails/${img}`} alt="Gallery" loading="lazy" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : /* activeTab === 'Videos' ? (
                    <div style={{ padding: '12px 16px 32px' }}>
                        <div style={{ fontSize: '13px', color: textMuted, marginBottom: '14px' }}>Video results for P Praneeth Reddy</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {[
                                { title: 'EPIC Club Videography & Production Reel - Amrita Vishwa Vidyapeetham', uploader: 'P Praneeth Reddy • Lead Videographer', views: '12.4K views', date: '1 year ago', duration: '04:15', desc: 'Highlight reel of campus events, technical presentations, and video production directed by Praneeth Reddy.' },
                                { title: 'Autonomous Road Pothole Detection & Repair System Demonstration', uploader: 'Praneeth Reddy Innovation Labs', views: '8.9K views', date: '6 months ago', duration: '03:42', desc: 'Real-time computer vision camera feed, GPS tracking, and automated filler dispensing mechanism demonstration.' },
                                { title: '4G/5G Network Test Scenario Orchestrator Walkthrough', uploader: 'Simnovus Telecom Systems', views: '5.1K views', date: '3 months ago', duration: '08:20', desc: 'Overview of enterprise 4G/5G protocol testing, UE simulation, and DevOps CI/CD integration.' },
                                { title: 'CloudShare: Passwordless File Storage Framework Architecture', uploader: 'IEEE Conference Series', views: '3.7K views', date: '2 months ago', duration: '06:10', desc: 'IEEE research paper presentation on passwordless cloud storage using Shamir Secret Sharing & AES encryption.' },
                            ].map((vid, idx) => (
                                <div key={idx} style={{ borderBottom: `1px solid ${dividerColor}`, paddingBottom: '16px' }}>
                                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', background: darkMode ? 'linear-gradient(135deg,#1e293b,#0f172a)' : 'linear-gradient(135deg,#dbe4f0,#f1f3f4)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${dividerColor}`, marginBottom: '10px' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <svg style={{ width: '26px', height: '26px', fill: '#fff', marginLeft: '3px' }} viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                        <span style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>{vid.duration}</span>
                                    </div>
                                    <h3 style={{ fontSize: '16px', color: linkColor, fontWeight: 500, margin: '0 0 4px 0', lineHeight: 1.35 }}>{vid.title}</h3>
                                    <div style={{ fontSize: '12px', color: textMuted, marginBottom: '6px' }}>{vid.uploader} • {vid.views} • {vid.date}</div>
                                    <p style={{ fontSize: '13px', color: textSecondary, margin: 0, lineHeight: 1.5 }}>{vid.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : */ activeTab === 'News' ? (
                    <div style={{ padding: '12px 16px 32px' }}>
                        <div style={{ fontSize: '13px', color: textMuted, marginBottom: '14px' }}>Top stories for P Praneeth Reddy</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {[
                                { source: 'Indian Patent Office • Tech & Innovation Digest', time: '2025', title: 'Indian Patent Office Grants Patent for Autonomous Road Pothole Detection & Repair System', snippet: 'P Praneeth Reddy and research team awarded Indian Patent for real-time computer vision camera feed, GPS hazard logging, and automated filler dispensing mechanisms designed to perform autonomous road repairs.', link: '/chrome/homepage.html#pub_section' },
                                { source: 'IEEE Xplore Research Publications', time: '2025', title: 'IEEE Xplore Publishes Breakthrough Paper on Quantum Key Distribution & Passwordless CloudShare', snippet: 'Full-stack engineer P Praneeth Reddy publishes 7 research papers spanning Multi-Client Quantum Key Distribution (QKD), passwordless cloud file storage with Shamir Secret Sharing, and network traffic anomaly detection.', link: '/chrome/homepage.html#pub_section' },
                                { source: 'Telecom & DevOps Engineering Press', time: '2025', title: 'Simnovus Automation Team Engineers Next-Gen 4G/5G Test Orchestrator', snippet: 'Software developer Praneeth Reddy architects scalable distributed orchestrators automating test scenarios across multi-UE 4G/5G simulation platforms using Docker, systemd Quadlets, and AI test agents.', link: '/chrome/homepage.html' },
                                { source: 'Healthcare & IoT Innovations Journal', time: '2024', title: 'IoT Pharmaceutical Inventory Management Framework Granted Indian Patent', snippet: 'Smart RFID & ESP32 hospital pharmacy inventory system created by Praneeth Reddy earns Indian Patent recognition for automating stock tracking, preventing medication stockouts, and monitoring expiration dates.', link: '/chrome/homepage.html#pub_section' },
                            ].map((news, idx) => (
                                <div key={idx} style={{ borderBottom: `1px solid ${dividerColor}`, paddingBottom: '16px' }}>
                                    <div style={{ fontSize: '12px', color: textMuted, marginBottom: '4px' }}>{news.source} • {news.time}</div>
                                    <h3 style={{ fontSize: '16px', color: linkColor, fontWeight: 500, margin: '0 0 6px 0', lineHeight: 1.35 }}>{news.title}</h3>
                                    <p style={{ fontSize: '13px', color: textSecondary, margin: 0, lineHeight: 1.5 }}>{news.snippet}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : activeTab === 'Maps' ? (
                    <div style={{ padding: '12px 16px 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ backgroundColor: panelBg, padding: '14px 16px', borderRadius: '14px', border: `1px solid ${panelBorder}` }}>
                            <h2 style={{ fontSize: '17px', fontWeight: 600, color: textPrimary, margin: '0 0 3px 0' }}>Bangalore (Bengaluru), Karnataka</h2>
                            <div style={{ fontSize: '12px', color: textSecondary, marginBottom: '10px' }}>Silicon Valley of India • 12.9716° N, 77.5946° E</div>
                            <a href="https://maps.google.com/?q=Bangalore,Karnataka,India" target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '7px 14px', backgroundColor: tabActiveColor, color: '#fff', borderRadius: '20px', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
                                Open in Google Maps ↗
                            </a>
                        </div>
                        <div style={{ width: '100%', height: '380px', borderRadius: '14px', overflow: 'hidden', border: `1px solid ${panelBorder}` }}>
                            <iframe title="Bangalore Map" src="https://maps.google.com/maps?q=Bangalore,Karnataka,India&t=&z=12&ie=UTF8&iwloc=&output=embed" style={{ width: '100%', height: '100%', border: 'none' }} loading="lazy" />
                        </div>
                    </div>
                ) : (
                    <div style={{ backgroundColor: darkMode ? '#171717' : '#f2f2f2', paddingBottom: '32px' }}>
                        
                        <div style={{ backgroundColor: bg, padding: '16px', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', height: '180px', gap: '4px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
                                <div style={{ flex: 2 }}>
                                    <img src="/images/gallery/wiki-profile.jpeg" alt="P Praneeth Reddy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://www.google.com/s2/favicons?sz=128&domain=google.com'; }} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <img src="/images/gallery/gallery-1.jpeg" alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://www.google.com/s2/favicons?sz=64&domain=google.com'; }} />
                                    </div>
                                    <div
                                        onClick={() => { setActiveTab('Images'); window.scrollTo(0, 0); }}
                                        style={{ flex: 1, backgroundColor: darkMode ? '#3c4043' : '#e8eaed', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '4px' }}
                                    >
                                        <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: textPrimary }}><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" /></svg>
                                        <span style={{ color: textPrimary, fontSize: '13px', fontWeight: 500 }}>More images</span>
                                    </div>
                                </div>
                            </div>

                            <h2 style={{ fontSize: '32px', color: textPrimary, fontWeight: 400, margin: '0 0 4px 0', lineHeight: '36px' }}>P Praneeth Reddy</h2>
                            <div style={{ fontSize: '14px', color: textSecondary, marginBottom: '16px' }}>Software Developer</div>

                            <div style={{ fontSize: '14px', lineHeight: '22px', color: textPrimary, marginBottom: '16px' }}>
                                Praneeth Reddy is a Software Developer and DevOps Engineer. He specializes in cloud infrastructure, virtualization environment orchestration, CI/CD automated deployment workflows, and building high-performance backend systems utilizing GoLang, React, AWS, Docker, and shell automation scripts.
                                <span style={{ color: textSecondary, marginLeft: '4px' }}>Wikipedia</span>
                            </div>

                            <div style={{ fontSize: '14px', lineHeight: '22px' }}>
                                <div style={{ marginBottom: '8px' }}>
                                    <span style={{ color: textPrimary, fontWeight: 500 }}>Born: </span>
                                    <span style={{ color: textSecondary }}>June 7, 2003 (age 23 years), Bengaluru</span>
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <span style={{ color: textPrimary, fontWeight: 500 }}>Education: </span>
                                    <span onClick={() => onNavigate('/chrome/homepage.html#edu_section', 'https://en.wikipedia.org/wiki/P_Praneeth_Reddy', 'Praneeth Reddy - Wikipedia')} style={{ color: linkColor, cursor: 'pointer' }}>Amrita Vishwa Vidyapeetham</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                                <div onClick={() => window.open('https://github.com/PraneethReddy-github', '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '24px', border: `1px solid ${panelBorder}`, whiteSpace: 'nowrap' }}>
                                    <img src="https://www.google.com/s2/favicons?sz=64&domain=github.com" alt="GitHub" style={{ width: '16px', height: '16px' }} />
                                    <span style={{ fontSize: '14px' }}>GitHub</span>
                                </div>
                                <div onClick={() => window.open('https://www.linkedin.com/in/connectwithpraneeth/', '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '24px', border: `1px solid ${panelBorder}`, whiteSpace: 'nowrap' }}>
                                    <img src="https://www.google.com/s2/favicons?sz=64&domain=linkedin.com" alt="LinkedIn" style={{ width: '16px', height: '16px' }} />
                                    <span style={{ fontSize: '14px' }}>LinkedIn</span>
                                </div>
                                <div onClick={() => window.open('https://ieeexplore.ieee.org/author/677775936439100', '_blank')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '24px', border: `1px solid ${panelBorder}`, whiteSpace: 'nowrap' }}>
                                    <img src="/images/logos/IEEE.png" alt="IEEE" style={{ width: '16px', height: '16px', objectFit: 'contain', backgroundColor: '#fff', borderRadius: '50%' }} />
                                    <span style={{ fontSize: '14px' }}>IEEE</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: bg, paddingTop: '8px', paddingBottom: '16px' }}>
                            <div style={{ padding: '16px', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '12px' }}>
                                    <div style={{ width: '28px', height: '28px', backgroundColor: sitelinkBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${dividerColor}` }}>
                                        <img src={results[0].favicon} alt={results[0].siteName} style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ fontSize: '14px', color: textPrimary }}>{results[0].siteName}</div>
                                        <div style={{ fontSize: '12px', color: urlColor, maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{results[0].displayUrl}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', color: iconColor }}>
                                        <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                    </div>
                                </div>

                                <div onClick={() => onNavigate(results[0].url, 'https://en.wikipedia.org/wiki/P_Praneeth_Reddy', results[0].title)} style={{ fontSize: '20px', lineHeight: '26px', color: linkColor, marginBottom: '8px', fontWeight: 400 }}>
                                    {results[0].title}
                                </div>
                                <div style={{ fontSize: '14px', lineHeight: '22px', color: textSecondary }}>
                                    {results[0].description}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                                    {results[0].sitelinks.map((sl, j) => (
                                        <div key={j}>
                                            <div onClick={() => onNavigate(`${results[0].url}${sl.hash}`, `https://en.wikipedia.org/wiki/P_Praneeth_Reddy`, results[0].title)} style={{ fontSize: '16px', color: linkColor, marginBottom: '4px' }}>{sl.title}</div>
                                            <div style={{ fontSize: '14px', color: textSecondary, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{sl.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: bg, marginTop: '8px', padding: '16px 0' }}>
                            <div style={{ fontSize: '20px', color: textPrimary, marginBottom: '12px', padding: '0 16px' }}>People also ask</div>
                            {paaItems.map((item, idx) => (
                                <div key={idx} style={{ borderTop: `1px solid ${dividerColor}` }}>
                                    <div onClick={() => togglePaa(idx)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', cursor: 'pointer' }}>
                                        <span style={{ fontSize: '16px', color: textPrimary }}>{item.q}</span>
                                        <svg style={{ width: '20px', height: '20px', fill: iconColor, transform: openPaa[idx] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" /></svg>
                                    </div>
                                    {openPaa[idx] && (
                                        <div style={{ padding: '0 16px 16px 16px', fontSize: '14px', lineHeight: '22px', color: textSecondary }}>{item.a}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ backgroundColor: bg, marginTop: '8px', paddingTop: '16px', paddingBottom: '32px' }}>
                            {results.slice(1).map((res, i) => (
                                <div key={i} style={{ padding: '16px', borderBottom: i !== results.length - 2 ? `1px solid ${dividerColor}` : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '12px' }}>
                                        <div style={{ width: '28px', height: '28px', backgroundColor: sitelinkBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${dividerColor}` }}>
                                            <img src={res.favicon} alt={res.siteName} style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ fontSize: '14px', color: textPrimary }}>{res.siteName}</div>
                                            <div style={{ fontSize: '12px', color: urlColor, maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.displayUrl}</div>
                                        </div>
                                        <div style={{ marginLeft: 'auto', color: iconColor }}>
                                            <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                        </div>
                                    </div>
                                    <div onClick={() => res.url.startsWith('http') ? window.open(res.url, '_blank') : onNavigate(res.url, 'https://en.wikipedia.org/wiki/P_Praneeth_Reddy', res.title)} style={{ fontSize: '20px', lineHeight: '26px', color: linkColor, marginBottom: '8px', fontWeight: 400 }}>
                                        {res.title}
                                    </div>
                                    <div style={{ fontSize: '14px', lineHeight: '22px', color: textSecondary }}>
                                        {res.description}
                                    </div>
                                </div>
                            ))}

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '32px 0 40px 0', overflowX: 'auto', paddingBottom: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transform: 'scale(0.8)', transformOrigin: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', userSelect: 'none' }}>
                                        <span style={{ fontSize: '40px', fontWeight: 'bold', color: '#4285f4', lineHeight: '1' }}>G</span>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                            <span key={n} style={{ fontSize: '40px', fontWeight: 'bold', color: n === 1 ? '#ea4335' : '#fbbc05', lineHeight: '1', margin: '0 -2px' }}>o</span>
                                        ))}
                                        <span style={{ fontSize: '40px', fontWeight: 'bold', color: '#4285f4', lineHeight: '1' }}>g</span>
                                        <span style={{ fontSize: '40px', fontWeight: 'bold', color: '#34a853', lineHeight: '1' }}>l</span>
                                        <span style={{ fontSize: '40px', fontWeight: 'bold', color: '#ea4335', lineHeight: '1' }}>e</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '8px', paddingLeft: '32px', paddingRight: '48px', boxSizing: 'border-box' }}>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                            <span key={n} style={{ fontSize: '14px', color: n === 1 ? textPrimary : linkColor, cursor: 'pointer' }}>{n}</span>
                                        ))}
                                        <span style={{ fontSize: '14px', color: linkColor, cursor: 'pointer', marginLeft: '16px' }}>Next</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: sitelinkBg }}>
                            <div style={{ padding: '14px 24px', borderBottom: `1px solid ${dividerColor}`, color: textSecondary, fontSize: '15px' }}>
                                India
                            </div>
                            <div style={{ padding: '14px 24px', display: 'flex', gap: '28px', color: textSecondary, fontSize: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <span style={{ cursor: 'pointer' }}>Help</span>
                                <span style={{ cursor: 'pointer' }}>Send feedback</span>
                                <span style={{ cursor: 'pointer' }}>Privacy</span>
                                <span style={{ cursor: 'pointer' }}>Terms</span>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
