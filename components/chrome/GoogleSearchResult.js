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
        'gallery-11.jpeg'
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

    // Exact Google color tokens
    const bg = darkMode ? '#202124' : '#ffffff';
    const textPrimary = darkMode ? '#e8eaed' : '#202124'; // main text like titles in dark mode is e8eaed
    const textSecondary = darkMode ? '#bdc1c6' : '#4d5156'; // descriptions
    const textMuted = darkMode ? '#9aa0a6' : '#70757a';
    const linkColor = darkMode ? '#8ab4f8' : '#1a0dab'; // Links (Titles)
    const urlColor = darkMode ? '#bdc1c6' : '#202124';
    const headerBg = darkMode ? '#202124' : '#ffffff';
    const headerBorder = darkMode ? '#3c4043' : '#ebebeb';
    
    // Search bar
    const inputBg = darkMode ? '#202124' : '#ffffff';
    const inputBorder = darkMode ? '#5f6368' : '#dfe1e5';
    const inputHoverShadow = darkMode ? '0 1px 6px 0 rgba(23,23,23,0.3)' : '0 1px 6px rgba(32,33,36,.28)';
    const inputHoverBorder = darkMode ? '#5f6368' : 'rgba(223,225,229,0)';
    
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
            description: 'P Praneeth Reddy is a Software Developer and DevOps Engineer at Simnovus, specializing in high-performance networking simulators, virtualization environment orchestration, CI/CD pipelines, and high-performance backends (GoLang, React, Linux). Explore his skills, education, and portfolio...',
            sitelinks: [
                { hash: '#edu_section', title: 'Education', desc: 'B.Tech in Computer Science & Engineering from Amrita Vishwa Vidyapeetham, Bangalore (2025) with an 8.01/10 CPI.' },
                { hash: '#skills_section', title: 'Technical Skills & Web Frameworks', desc: 'Proficient in Python, GoLang, Java, C/C++, SQL, Shell. React, Angular, Node.js, Flask, AWS, Docker, Jenkins.' },
                { hash: '#project_section', title: 'Projects', desc: 'Real-Time System Resource Monitor, secure client-server communication using SSL/Hybrid RSA-AES, vehicle routing logistics.' },
                { hash: '#pub_section', title: 'Research Publications & Patents', desc: 'QKD (IIT Indore, 2025), Spark Anomaly Detection, CloudShare, LoRa emergency systems, and Indian Patents.' }
            ]
        },
        {
            url: '/chrome/homepage.html#edu_section',
            displayUrl: 'https://en.wikipedia.org › wiki › Education',
            siteName: 'Wikipedia',
            favicon: 'https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org',
            title: 'Education - P Praneeth Reddy',
            description: 'B.Tech in Computer Science & Engineering from Amrita Vishwa Vidyapeetham, Bangalore (2025) with an 8.01/10 CPI. Narayana College (CBSE 12th, 91.0%) and New Baldwins (ICSE 10th, 91.6%). Courses include distributed systems, networking, and algorithms...'
        },
        {
            url: 'https://www.linkedin.com/in/connectwithpraneeth/',
            displayUrl: 'https://in.linkedin.com › connectwithpraneeth',
            siteName: 'LinkedIn',
            favicon: 'https://www.google.com/s2/favicons?sz=64&domain=linkedin.com',
            title: 'Praneeth Reddy - Software Developer - Simnovus',
            description: 'Bengaluru, Karnataka, India · Software Developer · Simnovus. Highly proficient in Python, GoLang, Java, C/C++, SQL, and Shell Scripting. Experienced in building responsive interfaces and automating cloud deployments...'
        },
        {
            url: 'https://github.com/PraneethReddy-github',
            displayUrl: 'https://github.com › PraneethReddy-github',
            siteName: 'GitHub',
            favicon: 'https://www.google.com/s2/favicons?sz=64&domain=github.com',
            title: 'PraneethReddy-github - Overview',
            description: 'Key projects include a Real-Time System Resource Monitoring Dashboard (2025), vehicle speed control and accident prevention using RF (2024), secure multi-client server communication with SSL/Hybrid RSA-AES, and Vehicle Routing logistics optimizations...'
        },
        {
            url: '/chrome/homepage.html#pub_section',
            displayUrl: 'https://en.wikipedia.org › wiki › Publications',
            siteName: 'Wikipedia',
            favicon: 'https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org',
            title: 'Research Publications & Patents - P Praneeth Reddy',
            description: 'Published research in QKD (IIT Indore, 2025), cloud-based network traffic anomaly detection (ICOCT, 2025), Passwordless CloudShare storage (ICOCT, 2025), LoRa emergency systems, and license plate recognition using YOLOv8. Indian Patents in automated Pothole Detection & Repair (2025)...'
        }
    ];

    const paaItems = [
        {
            q: "What is P Praneeth Reddy's specialization?",
            a: "P Praneeth Reddy specializes in Systems Engineering, cloud infrastructure, virtualization environment provisioning, CI/CD automated deployment workflows, and building high-performance backend systems utilizing GoLang, React, AWS, Docker, and shell automation scripts."
        },
        {
            q: "Where does P Praneeth Reddy currently work?",
            a: "Praneeth Reddy works as a Software Developer & DevOps Engineer at Simnovus in Bengaluru, India. He works on virtualization architecture, simulator orchestration backends, and DevOps infrastructure."
        },
        {
            q: "Has P Praneeth Reddy published any patents?",
            a: "Yes, Praneeth Reddy has published two Indian Patents: an automated road pothole detection and repair system (published in Jan 2025) and an IoT-based hospital pharmaceutical inventory management system (published in Mar 2024)."
        },
        {
            q: "What is P Praneeth Reddy's academic qualification?",
            a: "He is completing his B.Tech in Computer Science and Engineering from Amrita Vishwa Vidyapeetham, Bangalore (2021-2025) with a cumulative grade point average of 8.01/10."
        }
    ];

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'arial, sans-serif', backgroundColor: bg, color: textPrimary, overflow: 'hidden' }}>
            <style>{`
                .google-results-container {
                    display: flex;
                    width: 100%;
                    max-width: 1200px;
                    margin-left: 144px;
                    gap: 64px;
                    padding-top: 16px;
                    padding-bottom: 60px;
                }
                .google-left-col {
                    flex: 1 1 auto;
                    max-width: 652px;
                    min-width: 0;
                }
                .google-right-col {
                    flex: 0 0 368px;
                }
                .google-tabs {
                    padding-left: 168px;
                }
                .google-tabs::-webkit-scrollbar {
                    display: none;
                }
                @media (max-width: 1024px) {
                    .google-results-container {
                        margin-left: 24px;
                        gap: 32px;
                    }
                    .google-tabs {
                        padding-left: 24px;
                    }
                }
                @media (max-width: 800px) {
                    .google-results-container {
                        flex-direction: column;
                        margin-left: 16px;
                        margin-right: 16px;
                        gap: 32px;
                    }
                    .google-right-col {
                        flex: 1 1 auto;
                        width: 100%;
                        max-width: 100%;
                    }
                    .google-tabs {
                        padding-left: 16px;
                    }
                }
            `}</style>
            {/* ===== HEADER ===== */}
            <div style={{ flexShrink: 0, backgroundColor: headerBg, position: 'relative', zIndex: 10 }}>
                {/* Top row: logo + search + profile */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '24px 24px 0 24px', gap: '20px', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        {/* Google Logo */}
                        <div
                            onClick={() => onNavigate('https://www.google.com/webhp?igu=1', 'https://www.google.com', 'Google')}
                            style={{ cursor: 'pointer', fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.5px', userSelect: 'none', flexShrink: 0, marginTop: '-4px', marginRight: '34px' }}
                        >
                            {darkMode ? (
                                <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png" alt="Google" style={{ height: '30px' }} />
                            ) : (
                                <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google" style={{ height: '30px' }} />
                            )}
                        </div>

                        {/* Search Bar */}
                        <div 
                            className="group"
                            style={{
                                display: 'flex', alignItems: 'center', flex: '1 1 auto', maxWidth: '692px',
                                height: '44px', padding: '0 16px 0 14px', borderRadius: '24px',
                                border: `1px solid ${inputBorder}`, backgroundColor: inputBg,
                                transition: 'background-color 0.2s, box-shadow 0.2s, border-color 0.2s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = inputHoverShadow; e.currentTarget.style.borderColor = inputHoverBorder; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = inputBorder; }}
                        >
                            {/* Search Icon inside Input (sometimes shown, but typically absent on results page header if right has search icon. We'll omit it for results page, add it to right or keep left). Let's keep a small one on right. */}
                            <input
                                id="google-search-input"
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '16px', color: textPrimary, minWidth: 0, padding: '0 8px', fontFamily: 'arial, sans-serif' }}
                            />
                            
                            {/* Right icons in search bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {inputValue && (
                                    <>
                                        <svg onClick={handleClear} focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: iconColor, cursor: 'pointer' }}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                                        <div style={{ height: '24px', width: '1px', backgroundColor: dividerColor, margin: '0 4px' }}></div>
                                    </>
                                )}
                                {/* Mic */}
                                <svg focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '24px', height: '24px', cursor: 'pointer' }}>
                                    <path fill="#4285f4" d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"></path>
                                    <path fill="#34a853" d="m11 18.08h2v3.92h-2z"></path>
                                    <path fill="#fbbc04" d="m7.05 16.87c-1.27-1.33-2.05-2.8-2.05-4.67h2c0 1.45.56 2.42 1.47 3.38v.32l-1.15 1.18z"></path>
                                    <path fill="#ea4335" d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"></path>
                                </svg>
                                {/* Search Blue Icon */}
                                <svg onClick={handleSearchClick} focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: '#4285F4', cursor: 'pointer', marginLeft: '4px' }}><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Right side icons */}
                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <svg focusable="false" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: iconColor, cursor: 'pointer' }}><path d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46s-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22zm-3.23-2h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.46-.34-.9-.6-1.34-.78l-.53-.22-.38-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56a7.17 7.17 0 0 0-.06.78c0 .27.03.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.46.34.9.6 1.34.78l.53.22.37 2.55z"></path><circle cx="12" cy="12" r="3.5"></circle></svg>
                        <svg focusable="false" viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: iconColor, cursor: 'pointer' }}><path d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z"></path></svg>
                        <button style={{
                            background: darkMode ? '#8ab4f8' : '#1a73e8',
                            color: darkMode ? '#202124' : '#fff',
                            border: 'none',
                            borderRadius: '4px', // Modern google has pill or slight round, let's go with slightly more pill for signin
                            padding: '9px 23px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            letterSpacing: '0.25px',
                            transition: 'background-color 0.15s, opacity 0.15s',
                            marginLeft: '8px'
                        }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >Sign in</button>
                    </div>
                </div>

                {/* Tabs row */}
                <div className="google-tabs" style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingTop: '18px', fontSize: '14px', userSelect: 'none', borderBottom: `1px solid ${headerBorder}`, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    
                    {/* All */}
                    <div 
                        onClick={() => { setActiveTab('All'); setSelectedImage(null); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '12px', borderBottom: activeTab === 'All' ? `3px solid ${tabActiveColor}` : '3px solid transparent', color: activeTab === 'All' ? tabActiveColor : textSecondary, cursor: 'pointer', position: 'relative', top: '1px' }}
                        onMouseEnter={(e) => { if(activeTab !== 'All') e.currentTarget.style.color = textPrimary; }} 
                        onMouseLeave={(e) => { if(activeTab !== 'All') e.currentTarget.style.color = textSecondary; }}
                    >
                        <svg focusable="false" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor' }}><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                        <span style={{ fontWeight: 400 }}>All</span>
                    </div>

                    {/* Images */}
                    <div 
                        onClick={() => { setActiveTab('Images'); window.scrollTo(0, 0); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '12px', borderBottom: activeTab === 'Images' ? `3px solid ${tabActiveColor}` : '3px solid transparent', color: activeTab === 'Images' ? tabActiveColor : textSecondary, cursor: 'pointer', position: 'relative', top: '1px' }} 
                        onMouseEnter={(e) => { if(activeTab !== 'Images') e.currentTarget.style.color = textPrimary; }} 
                        onMouseLeave={(e) => { if(activeTab !== 'Images') e.currentTarget.style.color = textSecondary; }}
                    >
                        <svg focusable="false" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor' }}><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></svg>
                        <span>Images</span>
                    </div>

                    {/* Videos */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '12px', color: textSecondary, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = textPrimary} onMouseLeave={(e) => e.currentTarget.style.color = textSecondary}>
                        <svg focusable="false" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor' }}><path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
                        <span>Videos</span>
                    </div>

                    {/* News */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '12px', color: textSecondary, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = textPrimary} onMouseLeave={(e) => e.currentTarget.style.color = textSecondary}>
                        <svg focusable="false" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor' }}><path d="M21 3H3C1.9 3 1 3.9 1 5v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15h8v-2H8v2zm0-4h8V9H8v2zm-4 4h2v-6H4v6z"></path></svg>
                        <span>News</span>
                    </div>
                    
                    {/* Maps */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '12px', color: textSecondary, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = textPrimary} onMouseLeave={(e) => e.currentTarget.style.color = textSecondary}>
                        <svg focusable="false" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor' }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                        <span>Maps</span>
                    </div>

                    {/* More */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingBottom: '12px', color: textSecondary, cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.color = textPrimary} onMouseLeave={(e) => e.currentTarget.style.color = textSecondary}>
                        <svg focusable="false" viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'currentColor' }}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                        <span>More</span>
                    </div>

                    {/* Tools */}
                    <div style={{ marginLeft: 'auto', paddingRight: '24px', paddingBottom: '12px', color: textSecondary, cursor: 'pointer', fontWeight: 400 }} onMouseEnter={(e) => e.currentTarget.style.color = textPrimary} onMouseLeave={(e) => e.currentTarget.style.color = textSecondary}>
                        Tools
                    </div>
                </div>
            </div>

            {/* ===== BODY ===== */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <div style={{ display: 'flex', padding: activeTab === 'Images' ? '24px' : '0 24px', justifyContent: 'flex-start', flexWrap: activeTab === 'Images' ? 'wrap' : 'nowrap' }}>
                    
                    {activeTab === 'Images' ? (
                        <div style={{ display: 'flex', width: '100%', gap: '16px', position: 'relative' }}>
                            {/* Images Grid */}
                            <div style={{ flex: selectedImage ? '1 1 calc(100% - 416px)' : '1 1 100%', display: 'flex', flexWrap: 'wrap', gap: '16px', alignContent: 'flex-start', transition: 'flex 0.3s' }}>
                                {galleryImages.map((img, idx) => (
                                    <div key={idx} onClick={() => setSelectedImage(img)} style={{ height: '180px', flexGrow: 1, minWidth: '200px', cursor: 'pointer', backgroundColor: panelBg, borderRadius: '8px', overflow: 'hidden', border: `2px solid ${selectedImage === img ? tabActiveColor : 'transparent'}` }}>
                                        <img src={`/images/gallery/${img}`} alt="Gallery" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                            
                            {/* Side Panel */}
                            {selectedImage && (
                                <div style={{ flex: '0 0 400px', backgroundColor: panelBg, border: `1px solid ${panelBorder}`, borderRadius: '8px', padding: '16px', position: 'sticky', top: '16px', height: 'fit-content' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ fontSize: '14px', color: textSecondary }}>Images may be subject to copyright.</div>
                                        <svg onClick={() => setSelectedImage(null)} viewBox="0 0 24 24" style={{ width: '24px', height: '24px', fill: iconColor, cursor: 'pointer', padding: '4px', borderRadius: '50%', backgroundColor: sitelinkBg }}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                                    </div>
                                    <img src={`/images/gallery/${selectedImage}`} alt="Selected" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', backgroundColor: darkMode ? '#000' : '#f1f3f4', borderRadius: '8px' }} />
                                    <h2 style={{ fontSize: '18px', fontWeight: 500, margin: '16px 0 8px 0', color: textPrimary, wordBreak: 'break-word' }}>P Praneeth Reddy</h2>
                                    <div style={{ fontSize: '14px', color: textSecondary, marginBottom: '24px' }}>Praneeth's Gallery</div>
                                    <button 
                                        onClick={() => onNavigate('/chrome/homepage.html', 'https://en.wikipedia.org/wiki/P_Praneeth_Reddy', 'Praneeth Reddy - Wikipedia')}
                                        style={{ width: '100%', padding: '10px', backgroundColor: sitelinkBg, border: 'none', borderRadius: '24px', color: textPrimary, fontSize: '14px', fontWeight: 500, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#3c4043' : '#e8eaed'} 
                                        onMouseLeave={(e) => e.target.style.backgroundColor = sitelinkBg}
                                    >
                                        <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                                        Visit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Main Content Area: Left Results + Right Panel
                        <div className="google-results-container">
                        
                        {/* LEFT: Results */}
                        <div className="google-left-col">
                            {/* Result count */}
                            <div style={{ fontSize: '14px', color: textMuted, marginBottom: '24px', paddingTop: '6px' }}>
                                About 6,969,000 results (0.32 seconds)
                            </div>

                            {/* Result 1 (Main Profile) */}
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', gap: '12px' }}>
                                    <div style={{ width: '28px', height: '28px', backgroundColor: sitelinkBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${dividerColor}` }}>
                                        <img src={results[0].favicon} alt={results[0].siteName} style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ fontSize: '14px', color: textPrimary, lineHeight: '20px' }}>
                                            {results[0].siteName}
                                        </div>
                                        <div style={{ fontSize: '12px', color: urlColor, lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {results[0].displayUrl}
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', color: iconColor, cursor: 'pointer' }}>
                                        <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                    </div>
                                </div>

                                <div
                                    onClick={() => onNavigate(results[0].url, 'https://en.wikipedia.org/wiki/P_Praneeth_Reddy', results[0].title)}
                                    style={{ fontSize: '20px', lineHeight: '26px', color: linkColor, cursor: 'pointer', marginBottom: '4px', fontWeight: 400, display: 'inline-block' }}
                                    onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                    onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                >
                                    {results[0].title}
                                </div>
                                <div style={{ fontSize: '14px', lineHeight: '22px', color: textSecondary, wordBreak: 'break-word', marginTop: '4px' }}>
                                    {results[0].description}
                                </div>

                                {/* Sitelinks Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', marginTop: '16px', marginLeft: '24px' }}>
                                    {results[0].sitelinks.map((sl, j) => (
                                        <div key={j} style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div
                                                onClick={() => onNavigate(`${results[0].url}${sl.hash}`, `https://en.wikipedia.org/wiki/P_Praneeth_Reddy`, results[0].title)}
                                                style={{ fontSize: '16px', color: linkColor, cursor: 'pointer', marginBottom: '4px', fontWeight: 400, lineHeight: '24px' }}
                                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                            >
                                                {sl.title}
                                            </div>
                                            <div style={{ fontSize: '14px', lineHeight: '22px', color: textSecondary }}>{sl.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ===== INTERACTIVE PEOPLE ALSO ASK SECTION ===== */}
                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                                    <span style={{ fontSize: '22px', color: textPrimary, fontWeight: 400 }}>People also ask</span>
                                    <div style={{ marginLeft: 'auto', color: iconColor, cursor: 'pointer' }}>
                                        <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                    </div>
                                </div>
                                <div style={{ borderTop: `1px solid ${dividerColor}` }}>
                                    {paaItems.map((item, idx) => {
                                        const isOpen = openPaa[idx];
                                        return (
                                            <div key={idx} style={{ borderBottom: `1px solid ${dividerColor}` }}>
                                                <div
                                                    onClick={() => togglePaa(idx)}
                                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0 12px 0', cursor: 'pointer', userSelect: 'none' }}
                                                >
                                                    <span style={{ fontSize: '16px', color: textPrimary, lineHeight: '24px' }}>{item.q}</span>
                                                    <div style={{ 
                                                        width: '32px', height: '32px', borderRadius: '50%', 
                                                        backgroundColor: sitelinkBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                    }}>
                                                        <svg
                                                            style={{ width: '20px', height: '20px', fill: textPrimary, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {isOpen && (
                                                    <div style={{ padding: '0 0 16px 0', fontSize: '14px', lineHeight: '22px', color: textSecondary, animation: 'fadeIn 0.2s ease-in' }}>
                                                        {item.a}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Other Search Results */}
                            {results.slice(1).map((res, i) => (
                                <div key={i} style={{ marginBottom: '32px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', gap: '12px' }}>
                                        <div style={{ width: '28px', height: '28px', backgroundColor: sitelinkBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${dividerColor}` }}>
                                            <img src={res.favicon} alt={res.siteName} style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ fontSize: '14px', color: textPrimary, lineHeight: '20px' }}>
                                                {res.siteName}
                                            </div>
                                            <div style={{ fontSize: '12px', color: urlColor, lineHeight: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {res.displayUrl}
                                            </div>
                                        </div>
                                        <div style={{ marginLeft: 'auto', color: iconColor, cursor: 'pointer' }}>
                                            <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => {
                                            if (res.url.startsWith('http')) {
                                                window.open(res.url, '_blank');
                                            } else {
                                                onNavigate(res.url, `https://en.wikipedia.org/wiki/P_Praneeth_Reddy`, res.title);
                                            }
                                        }}
                                        style={{ fontSize: '20px', lineHeight: '26px', color: linkColor, cursor: 'pointer', marginBottom: '4px', fontWeight: 400, display: 'inline-block' }}
                                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                    >
                                        {res.title}
                                    </div>
                                    <div style={{ fontSize: '14px', lineHeight: '22px', color: textSecondary, wordBreak: 'break-word', marginTop: '4px' }}>
                                        {res.description}
                                    </div>
                                </div>
                            ))}

                            {/* Related Searches */}
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ fontSize: '22px', color: textPrimary, marginBottom: '16px', fontWeight: 400 }}>Related searches</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {[
                                        'Drop me a message on Gmail',
                                        'Reach out to me on LinkedIn',
                                        'Get in touch on Instagram',
                                        'Ping me on Twitter',
                                        'Check out my Github',
                                        'Rank on Leetcode',
                                        'View my HackerRank',
                                    ].map((s, i) => (
                                        <div key={i} style={{
                                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                                            borderRadius: '24px', backgroundColor: sitelinkBg, fontSize: '14px',
                                            color: textPrimary, cursor: 'pointer', fontWeight: 500,
                                            transition: 'background-color 0.2s'
                                        }} onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#3c4043' : '#e8eaed'} onMouseLeave={(e) => e.target.style.backgroundColor = sitelinkBg}>
                                            <svg style={{ width: '16px', height: '16px', fill: textPrimary, flexShrink: 0 }} viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pagination (Classic Goooogle) */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '40px 0 60px 0' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', userSelect: 'none' }}>
                                        {/* G */}
                                        <span style={{ fontSize: '40px', fontWeight: 'bold', color: '#4285f4', lineHeight: '1' }}>G</span>
                                        {/* o's */}
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                            <span key={n} style={{ fontSize: '40px', fontWeight: 'bold', color: n === 1 ? '#ea4335' : '#fbbc05', lineHeight: '1', margin: '0 -2px' }}>o</span>
                                        ))}
                                        {/* gle */}
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

                        {/* RIGHT: Knowledge Panel */}
                        <div className="google-right-col">
                            <div style={{ border: `1px solid ${panelBorder}`, borderRadius: '16px', overflow: 'hidden', backgroundColor: panelBg }}>
                                
                                {/* Images Grid */}
                                <div style={{ display: 'flex', height: '140px', gap: '2px', backgroundColor: panelBg, padding: '2px', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                                    <div style={{ flex: 1, height: '100%' }}>
                                        <img src="/images/gallery/wiki-profile.jpeg" alt="P Praneeth Reddy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px 0 0 0' }} onError={(e) => { e.target.src = 'https://www.google.com/s2/favicons?sz=128&domain=google.com'; }} />
                                    </div>
                                    <div style={{ flex: 1, height: '100%' }}>
                                        <img src="/images/gallery/gallery-1.jpeg" alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://www.google.com/s2/favicons?sz=64&domain=google.com'; }} />
                                    </div>
                                    <div 
                                        onClick={() => { setActiveTab('Images'); window.scrollTo(0, 0); }}
                                        style={{ flex: 1, height: '100%', backgroundColor: darkMode ? '#3c4043' : '#e8eaed', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '0 14px 0 0' }}
                                    >
                                        <span style={{ color: textPrimary, fontSize: '13px', fontWeight: 500, textAlign: 'center', padding: '0 4px' }}>More images</span>
                                    </div>
                                </div>

                                <div style={{ padding: '20px 16px' }}>
                                    {/* Name + subtitle + share */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                        <div>
                                            <h2 style={{ fontSize: '32px', color: textPrimary, fontWeight: 400, margin: '0 0 4px 0', lineHeight: '36px' }}>P Praneeth Reddy</h2>
                                            <div style={{ fontSize: '14px', color: textSecondary }}>Software Developer</div>
                                        </div>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: sitelinkBg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <svg style={{ width: '18px', height: '18px', fill: textPrimary }} viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"></path></svg>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div style={{ fontSize: '14px', lineHeight: '22px', color: textSecondary, margin: '16px 0', wordBreak: 'break-word' }}>
                                        Praneeth Reddy is a Software Developer and DevOps Engineer specializing in telecom simulation infrastructure, automation pipelines, and high-performance server engineering.
                                        <span style={{ marginLeft: '4px', color: textSecondary }}>
                                            <span style={{ cursor: 'pointer' }}>Wikipedia</span>
                                        </span>
                                    </div>

                                    {/* Quick Facts */}
                                    <div style={{ fontSize: '14px', lineHeight: '22px', borderTop: `1px solid ${dividerColor}`, paddingTop: '12px' }}>
                                        <div style={{ marginBottom: '8px' }}>
                                            <span style={{ color: textPrimary, fontWeight: 500 }}>Born: </span>
                                            <span style={{ color: textSecondary }}>June 7, 2003 (age 22 years), Bengaluru</span>
                                        </div>
                                        <div style={{ marginBottom: '8px' }}>
                                            <span style={{ color: textPrimary, fontWeight: 500 }}>Education: </span>
                                            <span
                                                onClick={() => onNavigate('/chrome/homepage.html#edu_section', 'https://en.wikipedia.org/wiki/P_Praneeth_Reddy', 'Praneeth Reddy - Wikipedia')}
                                                style={{ color: linkColor, cursor: 'pointer' }}
                                            >Amrita Vishwa Vidyapeetham</span>
                                        </div>
                                        <div style={{ marginBottom: '8px' }}>
                                            <span style={{ color: textPrimary, fontWeight: 500 }}>Employer: </span>
                                            <span style={{ color: textSecondary }}>Simnovus</span>
                                        </div>
                                    </div>

                                    {/* Profiles */}
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${dividerColor}` }}>
                                        <div style={{ fontSize: '18px', color: textPrimary, marginBottom: '12px' }}>Profiles</div>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <div onClick={() => window.open('https://github.com/PraneethReddy-github', '_blank')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                                                <img src="https://www.google.com/s2/favicons?sz=64&domain=github.com" alt="GitHub" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                                <span style={{ fontSize: '12px', color: textSecondary }}>GitHub</span>
                                            </div>
                                            <div onClick={() => window.open('https://www.linkedin.com/in/connectwithpraneeth/', '_blank')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                                                <img src="https://www.google.com/s2/favicons?sz=64&domain=linkedin.com" alt="LinkedIn" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                                <span style={{ fontSize: '12px', color: textSecondary }}>LinkedIn</span>
                                            </div>
                                            <div onClick={() => window.open('https://x.com/Praneeth_on_X', '_blank')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                                                <img src="https://www.google.com/s2/favicons?sz=64&domain=x.com" alt="Twitter" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                                <span style={{ fontSize: '12px', color: textSecondary }}>Twitter</span>
                                            </div>
                                            <div onClick={() => window.open('https://ieeexplore.ieee.org/author/677775936439100', '_blank')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                                                <img src="/images/logos/IEEE.png" alt="IEEE" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'contain', backgroundColor: '#fff', padding: '4px' }} />
                                                <span style={{ fontSize: '12px', color: textSecondary }}>IEEE</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buttons / Contact */}
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                                        <span
                                            onClick={() => onNavigate('/chrome/homepage.html', 'https://en.wikipedia.org/wiki/P_Praneeth_Reddy', 'Praneeth Reddy - Wikipedia')}
                                            style={{
                                                flex: 1, textAlign: 'center', padding: '8px 16px', borderRadius: '16px', fontSize: '14px', fontWeight: 500,
                                                cursor: 'pointer', backgroundColor: sitelinkBg, color: textPrimary,
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#3c4043' : '#e8eaed'} 
                                            onMouseLeave={(e) => e.target.style.backgroundColor = sitelinkBg}
                                        >
                                            View Wikipedia
                                        </span>
                                        <a
                                            href="mailto:connectwithpraneeth@gmail.com"
                                            style={{
                                                flex: 1, textAlign: 'center', padding: '8px 16px', borderRadius: '16px', fontSize: '14px', fontWeight: 500,
                                                cursor: 'pointer', backgroundColor: sitelinkBg, color: textPrimary, textDecoration: 'none',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? '#3c4043' : '#e8eaed'} 
                                            onMouseLeave={(e) => e.target.style.backgroundColor = sitelinkBg}
                                        >
                                            Contact Me
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ backgroundColor: sitelinkBg }}>
                    <div style={{ padding: '14px 24px', borderBottom: `1px solid ${dividerColor}`, color: textSecondary, fontSize: '15px' }}>
                        India
                    </div>
                    <div style={{ padding: '14px 24px', display: 'flex', gap: '28px', color: textSecondary, fontSize: '14px', flexWrap: 'wrap' }}>
                        <span style={{ cursor: 'pointer' }}>Help</span>
                        <span style={{ cursor: 'pointer' }}>Send feedback</span>
                        <span style={{ cursor: 'pointer' }}>Privacy</span>
                        <span style={{ cursor: 'pointer' }}>Terms</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
