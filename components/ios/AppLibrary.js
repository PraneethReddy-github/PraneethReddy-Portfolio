import React, { useState, useMemo, useEffect } from 'react';
import {
    AboutMeIcon, ResumeIcon, ProjectsIcon, SkillsIcon, EducationIcon,
    CertificationsIcon, PublicationsIcon, LearningIcon,
    CameraIcon, GamesIcon, PhotosIcon, CalendarIcon,
    PhoneIcon, MailIcon, SafariIcon, VarshionIcon, GitHubIcon, LinkedInIcon,
} from './Icons';

/* Icons the home screen doesn't already define */
const ClockIcon = () => (
    <div className="w-[60px] h-[60px] rounded-[18px] bg-black flex items-center justify-center shadow-md">
        <svg className="w-[52px] h-[52px]" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="20" fill="#fff" />
            <line x1="26" y1="26" x2="26" y2="13" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="26" x2="35" y2="26" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="26" x2="20" y2="32" stroke="#ff9500" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="26" cy="26" r="1.6" fill="#ff9500" />
        </svg>
    </div>
);

const WeatherIcon = () => (
    <div className="w-[60px] h-[60px] rounded-[18px] bg-gradient-to-br from-[#4aa3ec] to-[#1f6fd1] flex items-center justify-center shadow-md">
        <svg className="w-9 h-9" viewBox="0 0 24 24">
            <circle cx="9" cy="9" r="4" fill="#ffe27a" />
            <path d="M17.5 19h-9a3.5 3.5 0 0 1-.3-6.98A5 5 0 0 1 18 13a3 3 0 0 1-.5 6Z" fill="#fff" />
        </svg>
    </div>
);

const CATEGORIES = [
    {
        name: 'Portfolio',
        apps: [
            { id: 'portfolio',      name: 'About Me',     Icon: AboutMeIcon },
            { id: 'resume',         name: 'Resume',       Icon: ResumeIcon },
            { id: 'projects',       name: 'Projects',     Icon: ProjectsIcon },
            { id: 'skills',         name: 'Skills',       Icon: SkillsIcon },
            { id: 'education',      name: 'Education',    Icon: EducationIcon },
            { id: 'certifications', name: 'Achievements', Icon: CertificationsIcon },
            { id: 'publications',   name: 'Publications', Icon: PublicationsIcon },
            { id: 'learning',       name: 'Learning',     Icon: LearningIcon },
        ],
    },
    {
        name: 'Utilities',
        apps: [
            { id: 'timer',      name: 'Clock',      Icon: ClockIcon },
            { id: 'calendar',   name: 'Calendar',   Icon: CalendarIcon },
            { id: 'weather',    name: 'Weather',    Icon: WeatherIcon },
            { id: 'camera',     name: 'Camera',     Icon: CameraIcon },
        ],
    },
    {
        name: 'Entertainment',
        apps: [
            { id: 'games',  name: 'Arcade', Icon: GamesIcon },
            { id: 'photos', name: 'Photos', Icon: PhotosIcon },
        ],
    },
    {
        name: 'Contacts',
        apps: [
            { id: 'phone',    name: 'Contact',  Icon: PhoneIcon },
            { id: 'mail',     name: 'Mail',     Icon: MailIcon },
            { id: 'varshion', name: 'Varshion', Icon: VarshionIcon },
        ],
    },
    {
        name: 'Web',
        apps: [
            { id: 'safari',   name: 'Browser',  Icon: SafariIcon },
            { id: 'github',   name: 'GitHub',   Icon: GitHubIcon },
            { id: 'linkedin', name: 'LinkedIn', Icon: LinkedInIcon },
        ],
    },
];

const ALL_APPS = CATEGORIES.flatMap((c) => c.apps);

/* Icon scaled (no label) — used inside the folder boxes */
function ScaledIcon({ Icon, scale }) {
    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <div style={{ transform: `scale(${scale})` }}><Icon /></div>
        </div>
    );
}

/* Labelled tile — used in search results and inside an opened folder */
function AppTile({ app, onClick }) {
    return (
        <button onClick={() => onClick(app.id)} className="flex flex-col items-center active:scale-90 transition-transform">
            <app.Icon />
            <span className="text-white text-[10.5px] mt-1.5 font-medium drop-shadow-md text-center leading-tight max-w-[72px] truncate">
                {app.name}
            </span>
        </button>
    );
}

/* Search-result row — icon on the left, name beside it, stacked vertically */
function SearchRow({ app, onClick }) {
    return (
        <button
            onClick={() => onClick(app.id)}
            className="flex items-center w-full px-3 py-2 text-left active:bg-white/10 transition-colors"
        >
            <div className="w-11 h-11 flex items-center justify-center overflow-hidden flex-shrink-0">
                <div style={{ transform: 'scale(0.62)' }}><app.Icon /></div>
            </div>
            <span className="ml-3 text-white text-[15px] font-medium drop-shadow">{app.name}</span>
        </button>
    );
}

/* A classic App-Library category box: 2×2 grid of icons; if >4 apps the
   4th slot becomes a mini-cluster that opens the full folder. */
function CategoryBox({ cat, onAppClick, onOpenFolder }) {
    const hasFolder = cat.apps.length > 4;
    const large = hasFolder ? cat.apps.slice(0, 3) : cat.apps.slice(0, 4);
    const cluster = hasFolder ? cat.apps.slice(3) : [];

    return (
        <div>
            <h2 className="text-white/70 text-[13px] font-medium mb-2 px-1.5 truncate drop-shadow">{cat.name}</h2>
            <div
                onClick={() => onOpenFolder(cat)}
                className="aspect-square rounded-[26px] bg-white/12 backdrop-blur-2xl border border-white/10 p-2 grid grid-cols-2 grid-rows-2 gap-1.5 shadow-lg cursor-pointer"
            >
                {large.map((app) => (
                    <button
                        key={app.id}
                        onClick={(e) => { e.stopPropagation(); onAppClick(app.id); }}
                        className="active:scale-90 transition-transform"
                    >
                        <ScaledIcon Icon={app.Icon} scale={1.04} />
                    </button>
                ))}
                {hasFolder && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onOpenFolder(cat); }}
                        className="rounded-[15px] bg-black/20 grid grid-cols-2 grid-rows-2 gap-[3px] p-1.5 active:scale-90 transition-transform"
                    >
                        {cluster.slice(0, 4).map((app) => (
                            <ScaledIcon key={app.id} Icon={app.Icon} scale={0.5} />
                        ))}
                    </button>
                )}
            </div>
        </div>
    );
}

/* Opened folder — no box: the apps sit straight on the blurred wallpaper,
   iOS-style, with a left-aligned title. Tap anywhere empty to close. */
function FolderOverlay({ folder, onDismiss, onAppClick }) {
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const r = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(r);
    }, []);

    const close = () => {
        setShown(false);
        setTimeout(onDismiss, 260); // let the exit transition play out
    };

    return (
        <div
            className="fixed inset-0 z-[55] flex items-center justify-center"
            onClick={close}
            style={{
                background: 'rgba(0,0,0,0.38)',
                backdropFilter: shown ? 'blur(28px) saturate(1.3)' : 'blur(0px)',
                WebkitBackdropFilter: shown ? 'blur(28px) saturate(1.3)' : 'blur(0px)',
                opacity: shown ? 1 : 0,
                transition: 'opacity 0.28s ease, backdrop-filter 0.28s ease, -webkit-backdrop-filter 0.28s ease',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full px-8"
                style={{
                    transformOrigin: 'center',
                    transform: shown ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(14px)',
                    opacity: shown ? 1 : 0,
                    transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1), opacity 0.24s ease',
                }}
            >
                <h2 className="text-white text-left text-[26px] font-semibold tracking-[-0.4px] drop-shadow-lg mb-6 px-1.5">
                    {folder.name}
                </h2>
                <div className="grid grid-cols-4 gap-x-4 gap-y-7">
                    {folder.apps.map((app) => (
                        <AppTile key={app.id} app={app} onClick={onAppClick} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function AppLibrary({ onAppClick }) {
    const [query, setQuery] = useState('');
    const [folder, setFolder] = useState(null);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return null;
        return ALL_APPS.filter((a) => a.name.toLowerCase().includes(q));
    }, [query]);

    const handleTap = (id) => { setFolder(null); onAppClick(id); };

    return (
        <div className="px-5 pt-16 pb-32 min-h-full relative">
            <h1 className="text-white text-[30px] font-bold tracking-[-0.5px] drop-shadow-md mb-3">App Library</h1>

            <div className="relative mb-6">
                <svg className="w-[18px] h-[18px] fill-white/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14z" />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search apps"
                    className="w-full bg-white/15 backdrop-blur-xl rounded-[14px] pl-10 pr-9 py-2.5 text-white text-[15px] placeholder-white/50 outline-none border border-white/15"
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-white/80 text-[13px] leading-none"
                    >
                        ×
                    </button>
                )}
            </div>

            {results ? (
                results.length ? (
                    <div className="rounded-[16px] overflow-hidden bg-white/10 backdrop-blur-xl border border-white/10">
                        {results.map((app, i) => (
                            <React.Fragment key={app.id}>
                                <SearchRow app={app} onClick={handleTap} />
                                {i < results.length - 1 && <div className="h-px bg-white/10 ml-[56px]" />}
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-16">
                        <span className="text-white/55 text-[15px] font-medium">No apps found</span>
                    </div>
                )
            ) : (
                /* Category boxes (classic App Library layout) */
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    {CATEGORIES.map((cat) => (
                        <CategoryBox key={cat.name} cat={cat} onAppClick={handleTap} onOpenFolder={setFolder} />
                    ))}
                </div>
            )}

            {folder && (
                <FolderOverlay folder={folder} onDismiss={() => setFolder(null)} onAppClick={handleTap} />
            )}
        </div>
    );
}
