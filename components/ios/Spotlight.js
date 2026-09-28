import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Parser } from 'expr-eval';
import { ALL_APPS } from './AppLibrary';
import { haptic } from './haptics';

/* ------------------------------------------------------------------ */
/*  Search index                                                       */
/* ------------------------------------------------------------------ */

const KEYWORDS = {
    portfolio: ['about', 'me', 'bio', 'praneeth', 'profile'],
    resume: ['cv', 'pdf'],
    projects: ['work', 'apps', 'github'],
    skills: ['tech', 'stack', 'languages'],
    education: ['school', 'college', 'degree', 'btech'],
    certifications: ['certs', 'achievements', 'aws'],
    publications: ['papers', 'research', 'patents', 'ieee'],
    learning: ['courses', 'study'],
    games: ['arcade', 'play', 'snake', '2048', 'flappy'],
    safari: ['browser', 'web', 'internet'],
    timer: ['clock', 'alarm', 'stopwatch', 'time'],
    phone: ['contact', 'call', 'number'],
    mail: ['email', 'message', 'send'],
    varshion: ['chat', 'ai', 'assistant', 'bot'],
    settings: ['wallpaper', 'preferences', 'options', 'haptics'],
    photos: ['gallery', 'pictures', 'images'],
    camera: ['photo', 'selfie'],
    weather: ['forecast', 'temperature', 'rain'],
    calendar: ['date', 'events', 'day'],
    github: ['code', 'repos'],
    linkedin: ['job', 'network', 'social'],
};

const SUGGESTED = ['portfolio', 'projects', 'skills', 'resume', 'photos', 'games', 'safari', 'mail'];

const appById = (id) => ALL_APPS.find((a) => a.id === id);

/* Portfolio content lifted from Portfolio.js */
const SKILLS = [
    ['Programming', ['Python', 'Go', 'Java', 'C', 'C++', 'TypeScript', 'JavaScript', 'Shell', 'SQL', 'Rust', 'PHP']],
    ['AI & Agents', ['Gemini API/CLI', 'MCP Protocol', 'Local Whisper AI', 'LangChain', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Computer Vision']],
    ['Desktop & Media', ['Electron 33', 'xterm.js', 'fluent-ffmpeg', 'pdf-lib / pdf.js', 'skia canvas', 'wavesurfer.js', 'SQLite', 'IndexedDB']],
    ['Web', ['React', 'Next.js', 'Vite', 'Express', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Flask', 'Node.js', 'REST API']],
    ['Cloud & DevOps', ['AWS', 'Docker', 'Podman', 'Jenkins', 'CI/CD', 'Virtualization', 'Linux']],
    ['Networking & Security', ['TCP/IP', 'SSL/TLS', 'RSA-AES', 'Network Simulation', 'Distributed Systems', 'Wireshark']],
    ['Tools', ['Git', 'Jupyter', 'VS Code', 'LaTeX', 'MySQL', 'Firebase', 'Figma', 'Problem Solving', 'Leadership']],
];
const PROJECTS = [
    ['Ternix — Remote Session Manager & SSH Terminal', 'electron typescript react ssh sqlite'],
    ['Bloom 🌸 — Radial Desktop Launcher & Local AI', 'electron ai whisper javascript launcher'],
    ['DevFlow 🤖 — Autonomous AI Engineering Platform', 'react ai gemini mcp jira github'],
    ['Morphix — Desktop File Conversion & Media Suite', 'electron react typescript ffmpeg pdf'],
    ['Resume Screener — AI Agent Candidate Triage', 'react typescript ai gemini recruiter'],
    ['Real-Time System Resource Monitoring Dashboard', 'python bash react linux'],
    ['Road Safety & Accident Prevention Speed Zones', 'c++ iot arduino'],
    ['Secure Multi Client-Server Communication (SSL)', 'python cryptography distributed'],
    ['Genetic Algorithm for Intelligent Vehicle Routing', 'python algorithms'],
];
const CERTS = [
    ['AWS Academy Graduate – Cloud Architecting', 'AWS Academy · Jan 2025'],
    ['AWS Academy Graduate – Cloud Security Foundations', 'AWS Academy · Jan 2025'],
    ['Artificial Neural Networks with Keras', 'Udemy · Jan 2025'],
    ['Data Manipulation in Python: NumPy & Pandas', 'Udemy · Jan 2025'],
    ['AWS Academy Graduate – Cloud Foundations', 'AWS Academy · Dec 2024'],
];
const EDUCATION = [
    ['B.Tech in Computer Science & Engineering', 'Amrita Vishwa Vidyapeetham · 2021 – 2025'],
    ['Class 12 — PCM (CBSE)', 'Narayana Junior College · 2019 – 2021'],
    ['Class 10 (ICSE)', 'New Baldwins High School · 2019'],
];
const PUBLICATIONS = [
    ['Pothole Detection and Repair System', 'Indian Patent · 2025'],
    ['IoT-Enabled Pharmaceutical Inventory Management', 'Indian Patent · 2024'],
    ['Multi-Client Server Based Quantum Key Distribution', '16th ICCCNT, IIT Indore · 2025'],
    ['Cloud-Based Real-Time Anomaly Detection in Network Traffic', 'ICOCT, Bengaluru · 2025'],
    ['CloudShare: Passwordless Cloud Storage & Sharing', 'ICOCT, Bengaluru · 2025'],
    ['Emergency Communication using LoRa & GPS', 'ICSSAS · 2024'],
    ['License Plate Detection using YOLOv8 and OCR', '15th ICCCNT, IIT Mandi · 2024'],
    ['Improving Energy Efficiency of Heterogeneous Servers', 'IEEE ICCCNT · 2024'],
    ['Crop Damage Prediction using Machine Learning', 'RAICS · 2023'],
];

const CONTENT = [
    ...SKILLS.flatMap(([group, list]) => list.map((s) => ({ title: s, sub: `Skill · ${group}`, glyph: '⚡', color: '#FF9500', section: 'skills', hay: `${s} ${group}` }))),
    ...PROJECTS.map(([t, tags]) => ({ title: t, sub: 'Project', glyph: '🛠️', color: '#5856D6', section: 'projects', hay: `${t} ${tags}` })),
    ...CERTS.map(([t, sub]) => ({ title: t, sub: `Certification · ${sub}`, glyph: '🏆', color: '#FF3B30', section: 'certifications', hay: `${t} ${sub}` })),
    ...EDUCATION.map(([t, sub]) => ({ title: t, sub: `Education · ${sub}`, glyph: '🎓', color: '#34C759', section: 'education', hay: `${t} ${sub}` })),
    ...PUBLICATIONS.map(([t, sub]) => ({ title: t, sub: `Publication · ${sub}`, glyph: '📄', color: '#636366', section: 'publications', hay: `${t} ${sub}` })),
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const norm = (s) => s.toLowerCase().trim();
const initials = (name) => name.split(/[\s—–-]+/).filter(Boolean).map((w) => w[0]).join('').toLowerCase();

function scoreApp(app, q) {
    const name = norm(app.name);
    if (name === q) return 100;
    if (name.startsWith(q)) return 80;
    if (name.includes(q)) return 60;
    if (initials(app.name) === q) return 55;
    const kws = KEYWORDS[app.id] || [];
    if (kws.some((k) => k === q)) return 50;
    if (kws.some((k) => k.startsWith(q))) return 40;
    if (kws.some((k) => k.includes(q))) return 30;
    if (app.id.includes(q)) return 25;
    return 0;
}

const MATH_RE = /^[\d\s+\-*/().^%,]+$/;
const parser = new Parser();
function evalMath(q) {
    if (!/\d/.test(q) || !MATH_RE.test(q) || !/[+\-*/^%]/.test(q)) return null;
    try {
        const v = parser.evaluate(q);
        if (typeof v !== 'number' || !isFinite(v)) return null;
        return Number.isInteger(v) ? String(v) : String(parseFloat(v.toFixed(8)));
    } catch { return null; }
}

const RECENT_KEY = 'spotlight_recent';
function loadRecent() {
    try { const v = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
}
function pushRecent(id) {
    try {
        const next = [id, ...loadRecent().filter((x) => x !== id)].slice(0, 6);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
}

/* ------------------------------------------------------------------ */
/*  Small UI pieces                                                    */
/* ------------------------------------------------------------------ */

function Header({ children }) {
    return <div className="text-white/50 text-[11px] font-semibold uppercase tracking-widest px-4 pt-5 pb-2">{children}</div>;
}

function Group({ children }) {
    return <div className="rounded-[16px] overflow-hidden bg-white/10 border border-white/10">{children}</div>;
}

function Divider() { return <div className="h-px bg-white/10 ml-[56px]" />; }

function AppRow({ app, onClick, big = false, sub }) {
    const size = big ? 60 : 44;
    return (
        <button
            type="button"
            onClick={() => onClick(app.id)}
            className="flex items-center w-full px-3 py-2 text-left active:bg-white/10 transition-colors"
        >
            <div className="flex items-center justify-center overflow-hidden flex-shrink-0" style={{ width: size, height: size }}>
                <div style={{ transform: `scale(${big ? 0.9 : 0.62})` }}><app.Icon /></div>
            </div>
            <div className="ml-3 min-w-0">
                <div className={`text-white font-medium truncate ${big ? 'text-[17px]' : 'text-[15px]'}`}>{app.name}</div>
                {sub && <div className="text-white/50 text-[12px] truncate">{sub}</div>}
            </div>
        </button>
    );
}

function ContentRow({ item, onClick }) {
    return (
        <button
            type="button"
            onClick={() => onClick(item.section)}
            className="flex items-center w-full px-3 py-2.5 text-left active:bg-white/10 transition-colors"
        >
            <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center text-[16px] flex-shrink-0 ml-[5px]" style={{ background: item.color }}>
                {item.glyph}
            </div>
            <div className="ml-[13px] min-w-0">
                <div className="text-white text-[15px] font-medium truncate">{item.title}</div>
                <div className="text-white/50 text-[12px] truncate">{item.sub}</div>
            </div>
        </button>
    );
}

function GlyphRow({ glyph, color, label, sub, onClick }) {
    return (
        <button type="button" onClick={onClick} className="flex items-center w-full px-3 py-2.5 text-left active:bg-white/10 transition-colors">
            <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0 ml-[5px]" style={{ background: color }}>{glyph}</div>
            <div className="ml-[13px] min-w-0">
                <div className="text-white text-[15px] font-medium truncate">{label}</div>
                {sub && <div className="text-white/50 text-[12px] truncate">{sub}</div>}
            </div>
        </button>
    );
}

const GlobeGlyph = () => (
    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.9 6h-3a15.6 15.6 0 0 0-1.3-3.6A8 8 0 0 1 18.9 8ZM12 4a14 14 0 0 1 1.9 4h-3.8A14 14 0 0 1 12 4ZM4.3 14a8 8 0 0 1 0-4h3.4a16 16 0 0 0 0 4H4.3Zm.8 2h3a15.6 15.6 0 0 0 1.3 3.6A8 8 0 0 1 5.1 16Zm3-8h-3a8 8 0 0 1 4.3-3.6A15.6 15.6 0 0 0 8.1 8ZM12 20a14 14 0 0 1-1.9-4h3.8A14 14 0 0 1 12 20Zm2.3-6H9.7a14 14 0 0 1 0-4h4.6a14 14 0 0 1 0 4Zm.3 5.6a15.6 15.6 0 0 0 1.3-3.6h3a8 8 0 0 1-4.3 3.6Zm1.7-5.6a16 16 0 0 0 0-4h3.4a8 8 0 0 1 0 4h-3.4Z" /></svg>
);
const CompassGlyph = () => (
    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.5 5.5-2.8 6.2-6.2 2.8 2.8-6.2 6.2-2.8ZM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" /></svg>
);

/* ------------------------------------------------------------------ */
/*  Spotlight                                                          */
/* ------------------------------------------------------------------ */

export default function Spotlight({ onOpenApp, onClose }) {
    const [query, setQuery] = useState('');
    const [shown, setShown] = useState(false);
    const [recent, setRecent] = useState([]);
    const inputRef = useRef(null);
    const closingRef = useRef(false);
    const swipeRef = useRef(null);

    useEffect(() => {
        setRecent(loadRecent());
        const r = requestAnimationFrame(() => {
            setShown(true);
            inputRef.current && inputRef.current.focus();
        });
        return () => cancelAnimationFrame(r);
    }, []);

    const close = () => {
        if (closingRef.current) return;
        closingRef.current = true;
        setShown(false);
        inputRef.current && inputRef.current.blur();
        setTimeout(onClose, 220);
    };

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') close(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const open = (id, params) => {
        haptic('light');
        pushRecent(id);
        onOpenApp(id, params);
        close();
    };

    const q = norm(query);

    const results = useMemo(() => {
        if (!q) return null;
        const apps = ALL_APPS
            .map((a) => ({ app: a, score: scoreApp(a, q) }))
            .filter((r) => r.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((r) => r.app);
        const content = CONTENT.filter((c) => norm(c.hay).includes(q)).slice(0, 12);
        const math = evalMath(query.trim());
        return { top: apps[0] || null, apps: apps.slice(1, 8), content, math };
    }, [q, query]);

    const submit = (e) => {
        e.preventDefault();
        if (results && results.top) open(results.top.id);
        else if (results && results.content.length) open(results.content[0].section);
    };

    const webSearch = () => {
        haptic('light');
        window.open('https://www.google.com/search?q=' + encodeURIComponent(query.trim()), '_blank');
    };

    /* swipe-up on backdrop closes */
    const onTouchStart = (e) => { swipeRef.current = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
        if (swipeRef.current === null || swipeRef.current === undefined) return;
        if (swipeRef.current - e.changedTouches[0].clientY > 70) close();
        swipeRef.current = null;
    };

    const recentApps = recent.map(appById).filter(Boolean).slice(0, 4);
    const noResults = results && !results.top && !results.apps.length && !results.content.length && !results.math;

    return (
        <div
            className="absolute inset-0 z-[65] flex flex-col ios-font"
            onClick={close}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{
                background: 'rgba(10,10,14,0.55)',
                backdropFilter: shown ? 'blur(28px) saturate(1.3)' : 'blur(0px)',
                WebkitBackdropFilter: shown ? 'blur(28px) saturate(1.3)' : 'blur(0px)',
                opacity: shown ? 1 : 0,
                transform: shown ? 'scale(1)' : 'scale(1.04)',
                transition: 'opacity 0.22s ease, transform 0.3s var(--ios-spring), backdrop-filter 0.25s ease, -webkit-backdrop-filter 0.25s ease',
            }}
        >
            {/* Sticky search bar */}
            <form
                onSubmit={submit}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 px-4 flex-shrink-0"
                style={{ paddingTop: 60 }}
            >
                <div className="relative flex-1">
                    <svg className="w-[17px] h-[17px] fill-white/55 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search"
                        inputMode="search"
                        enterKeyHint="search"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        className="w-full bg-white/15 backdrop-blur-xl rounded-[14px] pl-10 pr-9 py-2.5 text-white text-[16px] placeholder-white/50 outline-none border border-white/15"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => { setQuery(''); inputRef.current && inputRef.current.focus(); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-white/80 text-[13px] leading-none"
                            aria-label="Clear"
                        >
                            ×
                        </button>
                    )}
                </div>
                <button type="button" onClick={close} className="text-white text-[16px] font-medium active:opacity-50 transition-opacity">
                    Cancel
                </button>
            </form>

            {/* Results */}
            <div
                className="flex-1 min-h-0 overflow-y-auto ios-scroll px-4"
                style={{ paddingBottom: 120 }}
                onClick={(e) => e.stopPropagation()}
            >
                {!results && (
                    <>
                        <Header>Siri Suggestions</Header>
                        <div className="rounded-[20px] bg-white/10 border border-white/10 px-2 py-4 grid grid-cols-4 gap-y-4">
                            {SUGGESTED.map(appById).filter(Boolean).map((app) => (
                                <button key={app.id} type="button" onClick={() => open(app.id)} className="flex flex-col items-center active:scale-90 transition-transform">
                                    <app.Icon />
                                    <span className="text-white text-[10.5px] mt-1.5 font-medium text-center leading-tight max-w-[72px] truncate">{app.name}</span>
                                </button>
                            ))}
                        </div>

                        {recentApps.length > 0 && (
                            <>
                                <div className="flex items-center justify-between pr-1">
                                    <Header>Recent</Header>
                                    <button
                                        type="button"
                                        onClick={() => { try { localStorage.removeItem(RECENT_KEY); } catch {} setRecent([]); }}
                                        className="text-white/50 text-[12px] font-medium pt-3 active:text-white/80"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <Group>
                                    {recentApps.map((app, i) => (
                                        <React.Fragment key={app.id}>
                                            <AppRow app={app} onClick={open} />
                                            {i < recentApps.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </Group>
                            </>
                        )}
                    </>
                )}

                {results && (
                    <>
                        {results.math && (
                            <>
                                <Header>Calculator</Header>
                                <div className="rounded-[16px] bg-white/10 border border-white/10 px-4 py-3">
                                    <div className="text-white/50 text-[13px] truncate">{query.trim()}</div>
                                    <div className="text-white text-[30px] font-semibold tracking-[-0.5px] tabular-nums">= {results.math}</div>
                                </div>
                            </>
                        )}

                        {results.top && (
                            <>
                                <Header>Top Hit</Header>
                                <Group><AppRow app={results.top} onClick={open} big sub="App" /></Group>
                            </>
                        )}

                        {results.apps.length > 0 && (
                            <>
                                <Header>Applications</Header>
                                <Group>
                                    {results.apps.map((app, i) => (
                                        <React.Fragment key={app.id}>
                                            <AppRow app={app} onClick={open} />
                                            {i < results.apps.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </Group>
                            </>
                        )}

                        {results.content.length > 0 && (
                            <>
                                <Header>Portfolio</Header>
                                <Group>
                                    {results.content.map((item, i) => (
                                        <React.Fragment key={`${item.section}-${item.title}`}>
                                            <ContentRow item={item} onClick={open} />
                                            {i < results.content.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </Group>
                            </>
                        )}

                        {noResults && (
                            <div className="text-center pt-10 pb-4">
                                <div className="text-white/90 text-[17px] font-semibold">No Results for “{query.trim()}”</div>
                                <div className="text-white/45 text-[13px] mt-1">Check the spelling or try the web.</div>
                            </div>
                        )}

                        <Header>Search</Header>
                        <Group>
                            <GlyphRow glyph={<GlobeGlyph />} color="#007AFF" label="Search the Web" sub={`“${query.trim()}”`} onClick={webSearch} />
                            <Divider />
                            <GlyphRow glyph={<CompassGlyph />} color="#0A84FF" label="Search in Portfolio Browser" onClick={() => open('safari')} />
                        </Group>
                    </>
                )}
            </div>
        </div>
    );
}
