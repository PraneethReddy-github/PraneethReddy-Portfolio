import React, { useState } from 'react';

/*
 * Native iOS-styled portfolio views.
 * Content is copied from the desktop component (components/apps/praneeth.js)
 * so the finished desktop side stays untouched. Styling here follows iOS
 * conventions: grouped inset cards, large titles, SF typography, system blue.
 */

const ACCENT = '#007AFF';

/* ---------- shared building blocks ---------- */

function Page({ children }) {
    return (
        <div className="min-h-full w-full bg-[#f2f2f7] ios-font pb-12 animate-ios-rise">
            {children}
        </div>
    );
}

function LargeTitle({ children, sub }) {
    return (
        <div className="px-5 pt-4 pb-3">
            <h1 className="text-[30px] font-bold text-black tracking-[-0.5px]">{children}</h1>
            {sub && <p className="text-[15px] text-black/45 mt-0.5">{sub}</p>}
        </div>
    );
}

function GroupLabel({ children }) {
    return (
        <div className="px-7 pt-5 pb-1.5">
            <span className="text-[13px] font-semibold uppercase tracking-wide text-black/40">{children}</span>
        </div>
    );
}

function Card({ children, className = '' }) {
    return (
        <div className={`mx-4 bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden ${className}`}>
            {children}
        </div>
    );
}

function Pill({ children, color = ACCENT, soft = true }) {
    return (
        <span
            className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
            style={
                soft
                    ? { color, background: `${color}1a` }
                    : { color: '#fff', background: color }
            }
        >
            {children}
        </span>
    );
}

/* ---------- About ---------- */

function About() {
    const rows = [
        { label: 'Location', value: 'Bangalore, India', href: null,
          icon: 'M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z', color: '#34c759' },
        { label: 'Email', value: 'connectwithpraneeth@gmail.com', href: 'mailto:connectwithpraneeth@gmail.com',
          icon: 'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z', color: '#007aff' },
        { label: 'Phone', value: '+91 8639564054', href: 'tel:+918639564054',
          icon: 'M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1l-2.2 2.2Z', color: '#30c75a' },
    ];

    return (
        <Page>
            <div className="flex flex-col items-center pt-8 pb-6 px-6">
                <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg ring-1 ring-black/5">
                    <img src="/images/logos/pfp.jpg" alt="Praneeth" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-[26px] font-bold text-black mt-4 tracking-[-0.5px]">P Praneeth Reddy</h1>
                <div className="flex items-center gap-2 mt-2">
                    <Pill color={ACCENT} soft={false}>Software Developer</Pill>
                    <Pill color="#8e8e93">@ Simnovus</Pill>
                </div>
            </div>

            <GroupLabel>About</GroupLabel>
            <Card>
                <p className="text-[15px] leading-relaxed text-black/75 p-4">
                    Software Developer & Systems Engineer building high-performance desktop applications,
                    autonomous AI agents, developer platforms, and cloud infrastructure. Creator of Ternix,
                    Bloom 🌸, DevFlow 🤖, Morphix, and Resume Screener AI. Passionate about system efficiency
                    and local AI.
                </p>
            </Card>

            <GroupLabel>Contact</GroupLabel>
            <Card>
                {rows.map((r, i) => {
                    const Inner = (
                        <div className="flex items-center px-4 py-3">
                            <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0 mr-3" style={{ background: r.color }}>
                                <svg className="w-[18px] h-[18px] fill-white" viewBox="0 0 24 24"><path d={r.icon} /></svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-[12px] text-black/40">{r.label}</div>
                                <div className="text-[15px] font-medium text-black truncate" style={r.href ? { color: ACCENT } : {}}>{r.value}</div>
                            </div>
                        </div>
                    );
                    const divider = i < rows.length - 1 ? <div className="h-px bg-black/[0.07] ml-[60px]" /> : null;
                    return r.href ? (
                        <a key={i} href={r.href} className="block active:bg-black/[0.03]">{Inner}{divider}</a>
                    ) : (
                        <div key={i}>{Inner}{divider}</div>
                    );
                })}
            </Card>
        </Page>
    );
}

/* ---------- Education ---------- */

function Education() {
    const data = [
        { degree: 'B.Tech in Computer Science & Engineering', institution: 'Amrita Vishwa Vidyapeetham, Bengaluru Campus', duration: '2021 – 2025', score: 'CPI 8.01 / 10', details: 'Focused on core computing systems, network security, software engineering, and IoT integration. Active member and Office Bearer of the videography club (EPIC Club).' },
        { degree: 'Class 12 — PCM (CBSE)', institution: 'Narayana Junior College', duration: '2019 – 2021', score: '91.0%', details: 'Mathematics, Physics, Chemistry and English. Developed strong analytical and problem-solving skills.' },
        { degree: 'Class 10 (ICSE)', institution: 'New Baldwins High School', duration: '2019', score: '91.6%', details: 'Secondary school certificate with distinction under the ICSE board.' },
    ];
    return (
        <Page>
            <LargeTitle sub="Academic background">Education</LargeTitle>
            <div className="space-y-4 pt-1">
                {data.map((edu, i) => (
                    <Card key={i}>
                        <div className="p-4">
                            <div className="flex justify-between items-start gap-2 mb-1.5">
                                <h3 className="text-[16px] font-semibold text-black leading-snug">{edu.degree}</h3>
                                <span className="flex-shrink-0"><Pill>{edu.duration}</Pill></span>
                            </div>
                            <p className="text-[13px] font-medium text-black/55 mb-2">{edu.institution}</p>
                            <p className="text-[14px] leading-relaxed text-black/70 mb-3">{edu.details}</p>
                            <Pill color="#34c759">{edu.score}</Pill>
                        </div>
                    </Card>
                ))}
            </div>
        </Page>
    );
}

/* ---------- Skills ---------- */

function Skills() {
    const groups = [
        { title: 'Programming Languages', skills: ['Python', 'Go', 'Java', 'C', 'C++', 'TypeScript', 'JavaScript', 'Shell', 'SQL', 'Rust', 'PHP'] },
        { title: 'AI Systems & Autonomous Agents', skills: ['Gemini API/CLI', 'MCP Protocol', 'Local Whisper AI', 'LangChain', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Computer Vision'] },
        { title: 'Desktop & Media Tech', skills: ['Electron 33', 'xterm.js', 'fluent-ffmpeg', 'pdf-lib / pdf.js', 'skia canvas', 'wavesurfer.js', 'SQLite', 'IndexedDB'] },
        { title: 'Web & Frameworks', skills: ['React', 'Next.js', 'Vite', 'Express', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Flask', 'Node.js', 'REST API'] },
        { title: 'Cloud & DevOps', skills: ['AWS', 'Docker', 'Podman', 'Jenkins', 'CI/CD', 'Virtualization', 'Linux'] },
        { title: 'Networking & Security', skills: ['TCP/IP', 'SSL/TLS', 'RSA-AES', 'Network Simulation', 'Distributed Systems', 'Wireshark'] },
        { title: 'Tools & Soft Skills', skills: ['Git', 'Jupyter', 'VS Code', 'LaTeX', 'MySQL', 'Firebase', 'Figma', 'Problem Solving', 'Leadership'] },
    ];
    return (
        <Page>
            <LargeTitle sub="Technical toolbox">Skills</LargeTitle>
            <div className="space-y-4 pt-1">
                {groups.map((g, i) => (
                    <Card key={i}>
                        <div className="p-4">
                            <h3 className="text-[15px] font-semibold text-black mb-3">{g.title}</h3>
                            <div className="flex flex-wrap gap-2">
                                {g.skills.map((s, j) => (
                                    <span key={j} className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-[#f2f2f7] text-black/70 border border-black/[0.06]">{s}</span>
                                ))}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </Page>
    );
}

/* ---------- Learning ---------- */

function Learning() {
    const items = [
        { title: 'AWS Academy — Architecting & Security Foundations', body: 'Designing highly available, cost-effective, fault-tolerant and secure distributed systems on AWS. Deep understanding of IAM, VPC configurations, threat detection and serverless computing.' },
        { title: 'Applied Generative AI & NLP', body: 'Neural network architectures, pre-training methodologies and advanced NLP. Hands-on building multilingual translation engines and fine-tuning transformer models.' },
        { title: 'DevOps, Virtualization & Telecom Orchestration', body: 'Automated CI/CD pipelines with Jenkins, Docker/Podman container workloads, hypervisor environments and scalable bash utility scripts.' },
        { title: 'Bug Bounty & Penetration Testing', body: 'Modern reconnaissance frameworks, threat modeling, security scanning tools and ethical hacking protocols to audit distributed networks.' },
    ];
    return (
        <Page>
            <LargeTitle sub="What I've been studying">Learning</LargeTitle>
            <div className="space-y-4 pt-1">
                {items.map((it, i) => (
                    <Card key={i}>
                        <div className="p-4">
                            <h3 className="text-[15px] font-semibold mb-1.5" style={{ color: ACCENT }}>{it.title}</h3>
                            <p className="text-[14px] leading-relaxed text-black/70">{it.body}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </Page>
    );
}

/* ---------- Certifications ---------- */

function Certifications() {
    const certs = [
        { name: 'AWS Academy Graduate – Cloud Architecting', issuer: 'AWS Academy', date: 'Jan 2025' },
        { name: 'AWS Academy Graduate – Cloud Security Foundations', issuer: 'AWS Academy', date: 'Jan 2025' },
        { name: 'Artificial Neural Networks with Keras (Python & R)', issuer: 'Udemy', date: 'Jan 2025' },
        { name: 'Data Manipulation in Python: NumPy & Pandas', issuer: 'Udemy', date: 'Jan 2025' },
        { name: 'AWS Academy Graduate – Cloud Foundations', issuer: 'AWS Academy', date: 'Dec 2024' },
        { name: 'Recon for Bug Bounty & Penetration Testers', issuer: 'Udemy', date: 'Aug 2024' },
        { name: 'Applied Generative AI and NLP', issuer: 'Udemy', date: 'Jul 2024' },
        { name: 'Machine Learning Course with Python', issuer: 'Udemy', date: 'May 2024' },
        { name: 'Web Developer Certificate', issuer: 'Acmegrade', date: 'Apr 2022' },
    ];
    const activities = [
        { title: 'Karate Black Belt (1st Dan)', detail: 'Earned Black Belt in Karate, Shitō-ryū style (Jan 2020).' },
        { title: 'Office Bearer — EPIC Club', detail: 'Coordinated videography, production and technical presentations at Amrita Vishwa Vidyapeetham (2023–2024).' },
        { title: 'Live in Labs Program', detail: 'Researched and deployed socio-economic solutions in rural villages (Jan 2024).' },
        { title: 'AYUDH Volunteer', detail: 'Volunteered in AYUDH social service initiatives at Amrita Hospital, Faridabad.' },
    ];
    return (
        <Page>
            <LargeTitle sub="Certifications & activities">Achievements</LargeTitle>

            <GroupLabel>Professional Certifications</GroupLabel>
            <Card>
                {certs.map((c, i) => (
                    <div key={i}>
                        <div className="flex items-center px-4 py-3">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-3" style={{ background: '#ff950022' }}>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#ff9500"><path d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4Zm-2 16-4-4 1.4-1.4L10 14.2l6.6-6.6L18 9l-8 8Z" /></svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-[14px] font-medium text-black leading-snug">{c.name}</div>
                                <div className="text-[12px] text-black/40 mt-0.5">{c.issuer} · {c.date}</div>
                            </div>
                        </div>
                        {i < certs.length - 1 && <div className="h-px bg-black/[0.07] ml-[52px]" />}
                    </div>
                ))}
            </Card>

            <GroupLabel>Activities & Leadership</GroupLabel>
            <div className="space-y-4">
                {activities.map((a, i) => (
                    <Card key={i}>
                        <div className="p-4">
                            <h4 className="text-[15px] font-semibold mb-1" style={{ color: ACCENT }}>{a.title}</h4>
                            <p className="text-[14px] leading-relaxed text-black/70">{a.detail}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </Page>
    );
}

/* ---------- Projects ---------- */

const TAG_COLORS = {
    python: '#3b82f6', bash: '#9ca3af', react: '#06b6d4', linux: '#eab308',
    'c++': '#6366f1', iot: '#a855f7', arduino: '#14b8a6', cryptography: '#ef4444',
    distributed: '#10b981', algorithms: '#ec4899', electron: '#0284c7', typescript: '#2563eb',
    ssh: '#059669', xterm: '#9333ea', sqlite: '#d97706', ai: '#c026d3', whisper: '#7c3aed',
    javascript: '#ca8a04', automation: '#0d9488', gemini: '#4f46e5', mcp: '#e11d48',
    express: '#475569', ffmpeg: '#ea580c', pdf: '#dc2626'
};

function Projects() {
    const list = [
        { name: 'Ternix — Remote Session Manager & SSH Terminal', date: '2026', link: 'https://github.com/Praneethreddy-github/ternix', description: 'Cross-platform SSH, Telnet, Serial, RDP & VNC remote manager with split-pane layout, floating windows, AES-256-GCM SQLite vault, and SFTP file manager.', domains: ['electron', 'typescript', 'react', 'ssh', 'sqlite'] },
        { name: 'Bloom 🌸 — Radial Desktop Launcher & Local AI', date: '2026', link: 'https://bloom-dial.web.app', description: 'Floating glass bud launcher & focus workspace with radial dial navigation, local Whisper AI voice dictation (@xenova/transformers), TTS, and focus timer.', domains: ['electron', 'ai', 'whisper', 'javascript', 'automation'] },
        { name: 'DevFlow 🤖 — Autonomous AI Engineering Platform', date: '2026', link: 'https://github.com/Praneethreddy-github/DevFlow', description: 'Autonomous platform connecting Jira & GitHub via MCP. Powered by Gemini CLI FixAgent to analyze tickets, repair code, stream diffs via SSE, and raise PRs.', domains: ['react', 'ai', 'gemini', 'mcp', 'express'] },
        { name: 'Morphix — Desktop File Conversion & Media Suite', date: '2026', link: 'https://github.com/Praneethreddy-github/Morphix', description: 'Desktop conversion toolkit for docs, video, audio, images & PDFs with PDF manipulation, image cropping via skia, video trim via ffmpeg, and audio waveforms.', domains: ['electron', 'react', 'typescript', 'ffmpeg', 'pdf'] },
        { name: 'Resume Screener — AI Agent Candidate Triage', date: '2026', link: 'https://github.com/Praneethreddy-github/Resume', description: 'Intelligent candidate triage platform with a Gemini 2.5 Pro recruiter agent ("Why is Priya ranked #1?") and a 100% client-side deterministic rule engine.', domains: ['react', 'typescript', 'ai', 'gemini', 'express'] },
        { name: 'Real-Time System Resource Monitoring Dashboard', date: '2025', link: 'https://github.com/PraneethReddy-github', description: 'System resource monitoring dashboard tracking CPU, memory and network utilization across Linux systems with real-time telemetry visualization.', domains: ['python', 'bash', 'react', 'linux'] },
        { name: 'Road Safety & Accident Prevention Speed Zones', date: '2024', link: 'https://github.com/PraneethReddy-github', description: 'Speed control and accident prevention system using Arduino Uno, RF transmitters/receivers, ultrasonic sensors and embedded C to enforce speed limits in restricted zones.', domains: ['c++', 'iot', 'arduino'] },
        { name: 'Secure Multi Client-Server Communication (SSL)', date: '2024', link: 'https://github.com/PraneethReddy-github', description: 'Secure client-server communication over SSL/TLS with hybrid RSA-AES encryption, secure key exchange, digital signatures and encrypted transmission.', domains: ['python', 'cryptography', 'distributed'] },
        { name: 'Genetic Algorithm for Intelligent Vehicle Routing', date: '2023', link: 'https://github.com/PraneethReddy-github', description: 'Genetic-algorithm optimization solving the Vehicle Routing Problem for logistics networks, reducing routing costs and improving efficiency.', domains: ['python', 'algorithms'] },
    ];
    return (
        <Page>
            <LargeTitle sub="Selected work">Projects</LargeTitle>
            <div className="space-y-4 pt-1">
                {list.map((p, i) => (
                    <a key={i} href={p.link} target="_blank" rel="noreferrer" className="block">
                        <Card className="active:scale-[0.985] transition-transform">
                            <div className="p-4">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <h3 className="text-[16px] font-semibold text-black leading-snug">{p.name}</h3>
                                    <svg className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
                                </div>
                                <p className="text-[14px] leading-relaxed text-black/70 mb-3">{p.description}</p>
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-[12px] text-black/40 mr-1">{p.date}</span>
                                    {p.domains.map((d, j) => (
                                        <span key={j} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ color: TAG_COLORS[d] || '#888', background: `${TAG_COLORS[d] || '#888'}1a` }}>{d}</span>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </a>
                ))}
            </div>
        </Page>
    );
}

/* ---------- Publications ---------- */

function Publications() {
    const patents = [
        { title: 'Pothole Detection and Repair System and Method Thereof', type: 'Indian Patent', year: '2025', description: 'Automated road maintenance system detecting potholes via image acquisition and processing, integrating computer vision, geolocation tracking and automated filler dispensing for real-time repairs.' },
        { title: 'IoT-Enabled Pharmaceutical Inventory Management for Hospital Pharmacies', type: 'Indian Patent', year: '2024', description: 'IoT-based smart inventory system automating pharmaceutical stock management with barcode scanning, real-time tracking, automated restocking alerts and expiry monitoring using ESP32, PHP, MySQL and web dashboards.' },
    ];
    const pubs = [
        { title: 'Multi-Client Server Based Quantum Key Distribution', venue: '16th ICCCNT, IIT Indore', date: 'Jul 2025', description: 'Quantum-secure communication framework using QKD for scalable, secure key exchange between multiple clients and servers, with hybrid quantum-classical authentication.' },
        { title: 'Cloud-Based Real-Time Anomaly Detection in Network Traffic', venue: 'ICOCT, Bengaluru', date: 'Jun 2025', link: 'https://ieeexplore.ieee.org/document/11118829', description: 'ML-based anomaly detection for network traffic on cloud infrastructure with real-time analytics pipelines and deep-learning traffic-pattern analysis.' },
        { title: 'CloudShare: Passwordless Cloud Storage & Sharing Framework', venue: 'ICOCT, Bengaluru', date: 'Jun 2025', link: 'https://ieeexplore.ieee.org/document/11118777/', description: 'Secure cloud storage eliminating passwords via asymmetric cryptography and challenge-response protocols, with AES-encrypted file sharing.' },
        { title: 'Robust Emergency Communication using LoRa & GPS with Multi-Hop Routing', venue: 'ICSSAS', date: 'Oct 2024', link: 'https://ieeexplore.ieee.org/document/10760890/', description: 'Long-range emergency communication using LoRa and GPS with a multi-hop mesh routing architecture for distress signals in disaster scenarios.' },
        { title: 'License Plate Detection and Recognition Using YOLOv8 and OCR', venue: '15th ICCCNT, IIT Mandi', date: 'Jun 2024', link: 'https://ieeexplore.ieee.org/document/10725878/', description: 'Automatic license plate recognition with YOLOv8 detection and OCR engines (EasyOCR, PaddleOCR, Tesseract) across varied lighting and angles.' },
        { title: 'Improving Energy Efficiency of Heterogeneous Servers (AWS + ML)', venue: 'IEEE ICCCNT', date: 'Jun 2024', link: 'https://ieeexplore.ieee.org/document/10724212/', description: 'ML approach optimizing cloud energy consumption with regression models and containerized workloads on AWS EC2 and Docker.' },
        { title: 'Crop Damage Prediction using Machine Learning', venue: 'RAICS', date: 'Dec 2023', link: 'https://ieeexplore.ieee.org/document/10690031/', description: 'Crop damage prediction using Gradient Boosting and Neural Networks for early detection of crop diseases and pests.' },
    ];
    return (
        <Page>
            <LargeTitle sub="Patents & research papers">Publications</LargeTitle>

            <GroupLabel>Patents & IP</GroupLabel>
            <div className="space-y-4">
                {patents.map((p, i) => (
                    <Card key={i}>
                        <div className="p-4">
                            <div className="flex justify-between items-start gap-2 mb-2">
                                <h3 className="text-[15px] font-semibold text-black leading-snug">{p.title}</h3>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <Pill color="#10b981">{p.type}</Pill>
                                <Pill color="#8e8e93">{p.year}</Pill>
                            </div>
                            <p className="text-[14px] leading-relaxed text-black/70">{p.description}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <GroupLabel>Research Papers</GroupLabel>
            <div className="space-y-4">
                {pubs.map((p, i) => {
                    const Inner = (
                        <Card className={p.link ? 'active:scale-[0.985] transition-transform' : ''}>
                            <div className="p-4">
                                <div className="flex justify-between items-start gap-2 mb-1.5">
                                    <h3 className="text-[15px] font-semibold text-black leading-snug">{p.title}</h3>
                                    {p.link && <svg className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>{p.venue}</span>
                                    <span className="text-[12px] text-black/40">· {p.date}</span>
                                </div>
                                <p className="text-[14px] leading-relaxed text-black/70">{p.description}</p>
                            </div>
                        </Card>
                    );
                    return p.link ? (
                        <a key={i} href={p.link} target="_blank" rel="noreferrer" className="block">{Inner}</a>
                    ) : <div key={i}>{Inner}</div>;
                })}
            </div>
        </Page>
    );
}

/* ---------- Resume ---------- */

function Resume() {
    const FILE = '/files/Resume.pdf';
    return (
        <Page>
            <LargeTitle sub="Open it full screen, download it, or preview below">Resume</LargeTitle>

            <Card className="p-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-14 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,59,48,0.1)' }}>
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#ff3b30"><path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5Z" /></svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-[16px] font-semibold text-black truncate">P Praneeth Reddy</div>
                        <div className="text-[13px] text-black/45 mt-0.5">Resume · PDF document</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mt-4">
                    <a href={FILE} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[14px] font-semibold text-white active:scale-95 transition-transform"
                        style={{ background: ACCENT }}>
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7ZM14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3h-7Z" /></svg>
                        Open
                    </a>
                    <a href={FILE} download="P_Praneeth_Reddy_Resume.pdf"
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[14px] font-semibold active:scale-95 transition-transform"
                        style={{ color: ACCENT, background: 'rgba(0,122,255,0.1)' }}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={ACCENT}><path d="M12 3a1 1 0 0 1 1 1v9.6l2.3-2.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4l2.3 2.3V4a1 1 0 0 1 1-1ZM5 19h14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2Z" /></svg>
                        Download
                    </a>
                </div>
            </Card>

            <GroupLabel>Preview</GroupLabel>
            <a href={FILE} target="_blank" rel="noreferrer"
                className="block mx-4 rounded-[14px] overflow-hidden bg-white relative shadow-[0_1px_4px_rgba(0,0,0,0.1)] ring-1 ring-black/5 active:opacity-95"
                style={{ aspectRatio: '1 / 1.414' }}>
                <iframe className="w-full h-full border-none pointer-events-none" src={`${FILE}#view=FitH&toolbar=0&navpanes=0`} title="Resume preview" scrolling="no" />
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
                    Tap to open
                </span>
            </a>
        </Page>
    );
}

/* ---------- dispatcher ---------- */

const SECTIONS = {
    about: About,
    education: Education,
    skills: Skills,
    learning: Learning,
    certifications: Certifications,
    projects: Projects,
    publications: Publications,
    resume: Resume,
};

export default function Portfolio({ section }) {
    const Comp = SECTIONS[section] || About;
    return <Comp />;
}

export const PORTFOLIO_SECTIONS = SECTIONS;

/* ---------- Portfolio app: a single icon that lists every section ---------- */

const MENU = [
    { id: 'about', label: 'About Me', color: '#007aff', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z' },
    { id: 'projects', label: 'Projects', color: '#5856d6', icon: 'M4 6H2v14a2 2 0 0 0 2 2h14v-2H4V6Zm16-4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z' },
    { id: 'skills', label: 'Skills', color: '#ff9500', icon: 'M22.7 19 13.6 9.9c.9-2.3.4-5-1.5-6.9a6.5 6.5 0 0 0-7.4-1.3L9 6 6 9 1.6 4.7A6.5 6.5 0 0 0 2.9 12c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4Z' },
    { id: 'education', label: 'Education', color: '#34c759', icon: 'M12 3 1 9l4 2.2V15c0 3.9 3.1 7 7 7s7-3.1 7-7v-3.8L21 9 12 3Zm6 12c0 2.8-2.2 5-6 5s-6-2.2-6-5v-2.7L12 14l6-2.7V15Z' },
    { id: 'certifications', label: 'Achievements', color: '#ff3b30', icon: 'M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4Zm-2 16-4-4 1.4-1.4L10 14.2l6.6-6.6L18 9l-8 8Z' },
    { id: 'publications', label: 'Publications', color: '#8e8e93', icon: 'M12 6.3C10.8 5.5 9.2 5 7.5 5S4.2 5.5 3 6.3v13c1.2-.8 2.8-1.3 4.5-1.3s3.3.5 4.5 1.3m0-13c1.2-.8 2.8-1.3 4.5-1.3S19.8 5.5 21 6.3v13c-1.2-.8-2.8-1.3-4.5-1.3S13.2 18.5 12 19.3m0-13v13' },
    { id: 'learning', label: 'Learning', color: '#af52de', icon: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-7 3a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm0 13H5v-.2c0-.6.3-1.2.8-1.6A10 10 0 0 1 12 15a10 10 0 0 1 6.2 2.2c.5.4.8 1 .8 1.6V19h-7Z' },
    { id: 'resume', label: 'Resume', color: '#ffcc00', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm2 16H8v-2h8v2Zm0-4H8v-2h8v2Zm-3-5V3.5L18.5 9H13Z' },
];

function Row({ item, onSelect, last }) {
    return (
        <button onClick={() => onSelect(item.id)} className="w-full flex items-center px-4 py-3 active:bg-black/[0.03] text-left">
            <div className="w-8 h-8 rounded-[9px] flex items-center justify-center flex-shrink-0 mr-3" style={{ background: item.color }}>
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill={item.id === 'publications' ? 'none' : '#fff'} stroke={item.id === 'publications' ? '#fff' : 'none'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
            </div>
            <span className="flex-1 text-[16px] text-black">{item.label}</span>
            <svg className="w-[18px] h-[18px] fill-black/25" viewBox="0 0 24 24"><path d="M8.6 7.4 10 6l6 6-6 6-1.4-1.4 4.6-4.6-4.6-4.6Z" /></svg>
            {!last && <span className="sr-only">divider</span>}
        </button>
    );
}

export function PortfolioApp() {
    const [sec, setSec] = useState(null);

    if (sec) {
        const Comp = SECTIONS[sec] || About;
        return (
            <div className="h-full flex flex-col bg-[#f2f2f7] ios-font">
                <button
                    onClick={() => setSec(null)}
                    className="flex items-center px-3 py-2.5 text-[#007aff] text-[16px] font-medium active:opacity-60 flex-shrink-0 bg-[#f2f2f7]/90 backdrop-blur border-b border-black/[0.05]"
                >
                    <svg className="w-6 h-6 fill-[#007aff] -ml-1" viewBox="0 0 24 24"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4-4.6-4.6 4.6-4.6Z" /></svg>
                    About Me
                </button>
                <div className="flex-1 overflow-y-auto ios-scroll"><Comp /></div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-[#f2f2f7] ios-font pb-10 animate-ios-rise">
            <div className="flex flex-col items-center pt-7 pb-5 px-6">
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg ring-1 ring-black/5">
                    <img src="/images/logos/pfp.jpg" alt="Praneeth" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-[22px] font-bold text-black mt-3">P Praneeth Reddy</h1>
                <p className="text-[14px] text-black/45 mt-0.5">Software Developer @ Simnovus</p>
            </div>

            <div className="mx-4 bg-white rounded-[16px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
                {MENU.map((item, i) => (
                    <div key={item.id}>
                        <Row item={item} onSelect={setSec} last={i === MENU.length - 1} />
                        {i < MENU.length - 1 && <div className="h-px bg-black/[0.07] ml-[60px]" />}
                    </div>
                ))}
            </div>
        </div>
    );
}
