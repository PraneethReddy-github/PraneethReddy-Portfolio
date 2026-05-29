import React, { useState, useEffect } from 'react';

// GNOME-style toggle switch
function Toggle({ enabled, onToggle }) {
    return (
        <button
            onClick={onToggle}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center flex-shrink-0 ${enabled ? 'justify-end' : 'bg-gray-600 justify-start'}`}
            style={enabled ? { backgroundColor: 'var(--ubuntu-accent-color, #e95420)' } : {}}
        >
            <div className="w-5 h-5 rounded-full bg-white shadow" />
        </button>
    );
}

// A flat row with optional right element — no border card, just a row
function Row({ label, sublabel, right, onClick, isDark }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between px-4 py-3 ${onClick ? `cursor-pointer ${isDark ? 'hover:bg-white/5 active:bg-white/10' : 'hover:bg-black/5 active:bg-black/10'} transition-colors` : ''}`}
        >
            <div className="flex flex-col min-w-0 pr-4">
                <span className={`text-[12px] font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'} leading-snug`}>{label}</span>
                {sublabel && <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'} leading-snug mt-0.5`}>{sublabel}</span>}
            </div>
            <div className="flex-shrink-0 flex items-center">{right}</div>
        </div>
    );
}

// Section of rows with dividers between them, no outer border/card
function RowGroup({ children, isDark }) {
    const rows = React.Children.toArray(children).filter(Boolean);
    return (
        <div className="w-full">
            {rows.map((row, i) => (
                <React.Fragment key={i}>
                    {React.cloneElement(row, { isDark })}
                    {i < rows.length - 1 && <div className={`h-px ${isDark ? 'bg-white/5' : 'bg-gray-200'} mx-4`} />}
                </React.Fragment>
            ))}
        </div>
    );
}

function SectionLabel({ children, isDark }) {
    return <div className={`px-4 pt-5 pb-1 text-[11px] font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>{children}</div>;
}

function Dropdown({ options, value, onChange, isDark }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            return;
        }
        const handler = () => setIsOpen(false);
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    }, [isOpen]);

    const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between px-3 py-1.5 w-48 text-[11px] font-medium outline-none rounded-lg border shadow-sm transition-all ${isDark ? 'bg-[#2a2a2a] border-white/10 text-gray-200 hover:bg-[#333333]' : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'}`}
            >
                <span className="truncate pr-2">{options.find(o => o.value === value)?.label || value}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className={`absolute right-0 top-full mt-1.5 w-56 max-h-64 flex flex-col overflow-hidden rounded-xl border shadow-xl z-50 ${isDark ? 'bg-[#252525] border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className={`p-2 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                            className={`w-full px-2 py-1.5 text-[11px] rounded-md outline-none border transition-colors ${isDark ? 'bg-white/5 border-transparent focus:border-white/20 text-gray-200 placeholder-gray-500' : 'bg-black/5 border-transparent focus:border-black/20 text-gray-800 placeholder-gray-500'}`}
                        />
                    </div>
                    <div className="p-1 overflow-y-auto no-scrollbar flex-grow">
                        {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                            <div 
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`px-3 py-2 text-[11px] rounded-lg cursor-pointer flex items-center justify-between transition-colors ${isDark ? 'text-gray-200 hover:bg-white/10' : 'text-gray-800 hover:bg-black/5'}`}
                                style={value === opt.value ? { backgroundColor: 'var(--ubuntu-accent-color, #e95420)', color: 'white' } : {}}
                            >
                                <span className="truncate pr-2">{opt.label}</span>
                                {value === opt.value && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                        )) : (
                            <div className={`px-3 py-3 text-[11px] text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export function Settings(props) {
    const isDark = props.dark_mode;
    const [activeTab, setActiveTab] = useState('appearance');
    const [wifiEnabled, setWifiEnabled] = useState(true);
    const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
    const [dndEnabled, setDndEnabled] = useState(false);
    const [lockScreenNotifEnabled, setLockScreenNotifEnabled] = useState(true);
    const [soundVolume, setSoundVolume] = useState('75');
    const [autoDateTime, setAutoDateTime] = useState(true);
    const [autoTimeZone, setAutoTimeZone] = useState(true);
    const [timeFormat, setTimeFormat] = useState('12');
    const [timeZone, setTimeZone] = useState('Local');
    const [availableZones, setAvailableZones] = useState([]);
    const [selectedAccent, setSelectedAccent] = useState('orange');
    const [systemSubTab, setSystemSubTab] = useState(null);

    useEffect(() => {
        // Accent color
        setSelectedAccent(localStorage.getItem('yaru-accent') || 'orange');

        // Shared states — read from localStorage so we're in sync with the control panel
        const savedWifi  = localStorage.getItem('wifi-active');
        const savedBt    = localStorage.getItem('bluetooth-active');
        const savedSound = localStorage.getItem('sound-level');
        const savedDnd   = localStorage.getItem('dnd-active');
        const savedTimeFormat = localStorage.getItem('time-format');
        const savedTimeZone = localStorage.getItem('time-zone');
        
        if (savedWifi  !== null) setWifiEnabled(savedWifi === 'true');
        if (savedBt    !== null) setBluetoothEnabled(savedBt === 'true');
        if (savedSound !== null) setSoundVolume(parseInt(savedSound, 10));
        if (savedDnd   !== null) setDndEnabled(savedDnd === 'true');
        if (savedTimeFormat !== null) setTimeFormat(savedTimeFormat);
        if (savedTimeZone !== null) setTimeZone(savedTimeZone);
        else setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local');

        try {
            setAvailableZones(Intl.supportedValuesOf('timeZone'));
        } catch (e) {
            setAvailableZones(['Asia/Kolkata', 'Europe/London', 'America/New_York', 'Asia/Tokyo']);
        }

        // Listen for changes made in the control panel
        const onChanged = (e) => {
            const { key, value } = e.detail;
            if (key === 'wifi-active')      setWifiEnabled(value);
            if (key === 'bluetooth-active') setBluetoothEnabled(value);
            if (key === 'sound-level')      setSoundVolume(parseInt(value, 10));
            if (key === 'dnd-active')       setDndEnabled(value);
            if (key === 'time-format')      setTimeFormat(value);
            if (key === 'time-zone')        setTimeZone(value);
        };
        window.addEventListener('portfolio-settings-changed', onChanged);
        return () => window.removeEventListener('portfolio-settings-changed', onChanged);
    }, []);

    // Save to localStorage + notify control panel of a change
    const syncSetting = (key, value) => {
        localStorage.setItem(key, value);
        window.dispatchEvent(new CustomEvent('portfolio-settings-changed', { detail: { key, value } }));
    };

    const changeAccent = (color) => {
        setSelectedAccent(color);
        syncSetting('yaru-accent', color);
    };

    const wallpapers = {
        "wall-9":  "./images/wallpapers/wall-9.png",
        "wall-10": "./images/wallpapers/wall-10.png",
        "wall-1":  "./images/wallpapers/wall-1.webp",
        "wall-2":  "./images/wallpapers/wall-2.webp",
        "wall-3":  "./images/wallpapers/wall-3.webp",
        "wall-4":  "./images/wallpapers/wall-4.webp",
        "wall-5":  "./images/wallpapers/wall-5.webp",
        "wall-6":  "./images/wallpapers/wall-6.webp",
        "wall-7":  "./images/wallpapers/wall-7.webp",
        "wall-8":  "./images/wallpapers/wall-8.webp",
    };

    // The two wallpapers that are auto-linked to the theme
    const DARK_WALL = 'wall-9';
    const LIGHT_WALL = 'wall-10';
    const THEME_WALLS = [DARK_WALL, LIGHT_WALL];

    // Manually picking a wallpaper — never affects the theme
    const handleWallpaperPick = (name) => {
        props.changeBackgroundImage(name);
    };

    // Toggling dark/light — also swaps wallpaper ONLY if the user
    // is currently on one of the two theme-linked wallpapers
    const handleThemeToggle = (dark) => {
        props.toggleDarkMode(dark);
        if (THEME_WALLS.includes(props.currBgImgName)) {
            props.changeBackgroundImage(dark ? DARK_WALL : LIGHT_WALL);
        }
    };

    const accentColors = {
        orange:  '#e95420',
        olive:   '#6d8a34',
        green:   '#35a854',
        teal:    '#008080',
        cyan:    '#11a0f0',
        blue:    '#1c71d8',
        purple:  '#7b1fa2',
        magenta: '#c2185b',
        red:     '#e01b24',
    };

    // Slim sidebar tabs — only the ones that matter
    const tabs = [
        {
            id: 'wifi', name: 'Wi-Fi',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5zM8.25 15a5.25 5.25 0 017.5 0M5.25 12a9.45 9.45 0 0113.5 0M2.25 9A14.25 14.25 0 0121.75 9" /></svg>
        },
        {
            id: 'bluetooth', name: 'Bluetooth',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.5 17.5l11-11L12 2v20l5.5-4.5-11-11" /></svg>
        },
        {
            id: 'sound', name: 'Sound',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72" /></svg>
        },
        {
            id: 'power', name: 'Power',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>
        },
        {
            id: 'appearance', name: 'Appearance',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m-.386-6.364l1.591 1.591M12 18.75a6.75 6.75 0 110-13.5 6.75 6.75 0 010 13.5z" /></svg>
        },
        {
            id: 'notifications', name: 'Notifications',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
        },
        {
            id: 'system', name: 'System',
            icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869L9.594 3.94z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        },
    ];

    const chevron = (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    );

    const renderContent = () => {
        // ── System sub-pages ──────────────────────────────────────────────────
        if (activeTab === 'system') {
            if (systemSubTab === 'about') {
                return (
                    <div className="flex flex-col">
                        <button onClick={() => setSystemSubTab(null)} className={`flex items-center space-x-1.5 text-[11px] ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} mb-4 transition-colors w-fit`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            <span>System</span>
                        </button>
                        <div className="flex flex-col items-center py-5 mb-3">
                            <img src="./themes/Yaru/status/cof_orange_hex.svg" alt="Ubuntu" className="w-16 h-16 mb-3 drop-shadow-md" />
                            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Ubuntu 24.04 LTS</div>
                            <div className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>Noble Numbat</div>
                        </div>
                        <RowGroup isDark={isDark}>
                            <Row label="Device Name" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>praneeth-ubuntu</span>} />
                            <Row label="Processor" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Intel Core i7-10700K × 16</span>} />
                            <Row label="Graphics" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>NVIDIA RTX 3070</span>} />
                            <Row label="Memory" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>16.0 GiB</span>} />
                            <Row label="Disk" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>512.0 GB</span>} />
                            <Row label="OS Type" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>64-bit</span>} />
                            <Row label="GNOME Version" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>46.0</span>} />
                            <Row label="Windowing System" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Wayland</span>} />
                            <Row label="Kernel" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Linux 6.8.0-31-generic</span>} />
                        </RowGroup>
                    </div>
                );
            }

            if (systemSubTab === 'datetime') {
                return (
                    <div className="flex flex-col">
                        <button onClick={() => setSystemSubTab(null)} className={`flex items-center space-x-1.5 text-[11px] ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} mb-4 transition-colors w-fit`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            <span>System</span>
                        </button>
                        <SectionLabel isDark={isDark}>Date & Time</SectionLabel>
                        <RowGroup isDark={isDark}>
                            <Row label="Automatic Date & Time" sublabel="Requires internet access" right={<Toggle enabled={autoDateTime} onToggle={() => setAutoDateTime(!autoDateTime)} />} />
                            <Row label="Automatic Time Zone" sublabel="Requires internet access" right={<Toggle enabled={autoTimeZone} onToggle={() => setAutoTimeZone(!autoTimeZone)} />} />
                            <Row label="Time Zone" right={
                                <Dropdown 
                                    isDark={isDark}
                                    value={timeZone}
                                    onChange={(v) => { setTimeZone(v); syncSetting('time-zone', v); }}
                                    options={[
                                        { label: 'Local System Time', value: 'Local' },
                                        ...availableZones.map(zone => ({ label: zone.replace(/_/g, ' '), value: zone }))
                                    ]}
                                />
                            } />
                            <Row label="Time Format" right={
                                <div className={`flex rounded-lg overflow-hidden border ${isDark ? 'border-white/10' : 'border-gray-300'} text-[11px] font-medium`}>
                                    <button 
                                        onClick={() => { setTimeFormat('12'); syncSetting('time-format', '12'); }}
                                        className={`px-3 py-1 outline-none transition-colors ${timeFormat === '12' ? 'bg-ub-orange text-white' : (isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-black/5 text-gray-600')}`}
                                    >AM / PM</button>
                                    <button 
                                        onClick={() => { setTimeFormat('24'); syncSetting('time-format', '24'); }}
                                        className={`px-3 py-1 outline-none transition-colors border-l ${isDark ? 'border-white/10' : 'border-gray-300'} ${timeFormat === '24' ? 'bg-ub-orange text-white' : (isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-black/5 text-gray-600')}`}
                                    >24-hour</button>
                                </div>
                            } />
                        </RowGroup>
                    </div>
                );
            }

            if (systemSubTab === 'users') {
                return (
                    <div className="flex flex-col">
                        <button onClick={() => setSystemSubTab(null)} className={`flex items-center space-x-1.5 text-[11px] ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} mb-4 transition-colors w-fit`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            <span>System</span>
                        </button>
                        <div className="flex flex-col items-center py-5 mb-3">
                            <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden mb-3 border-2 border-gray-400">
                                <img src="./images/logos/pfp.jpg" alt="User Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>praneeth</div>
                            <div className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>Administrator</div>
                        </div>
                        <SectionLabel isDark={isDark}>Profile Information</SectionLabel>
                        <RowGroup isDark={isDark}>
                            <Row label="Role" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'} truncate`}>Software Developer & DevOps Engineer</span>} />
                            <Row 
                                label="GitHub" 
                                onClick={() => window.open('https://github.com/PraneethReddy-github', '_blank', 'noopener,noreferrer')}
                                right={
                                    <div className={`flex items-center space-x-1.5 text-[11px] ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}>
                                        <span>@PraneethReddy-github</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </div>
                                } 
                            />
                            <Row 
                                label="LinkedIn" 
                                onClick={() => window.open('https://www.linkedin.com/in/connectwithpraneeth/', '_blank', 'noopener,noreferrer')}
                                right={
                                    <div className={`flex items-center space-x-1.5 text-[11px] ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}>
                                        <span>connectwithpraneeth</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </div>
                                } 
                            />
                            <Row 
                                label="Instagram" 
                                onClick={() => window.open('https://www.instagram.com/prx.reddy/', '_blank', 'noopener,noreferrer')}
                                right={
                                    <div className={`flex items-center space-x-1.5 text-[11px] ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-900'} transition-colors`}>
                                        <span>@prx.reddy</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </div>
                                } 
                            />
                        </RowGroup>
                    </div>
                );
            }

            return (
                <div className="flex flex-col">
                    <SectionLabel isDark={isDark}>System</SectionLabel>
                    <RowGroup isDark={isDark}>
                        <Row label="Date & Time" sublabel={`${timeZone === 'Local' ? 'Local Time' : timeZone.replace(/_/g, ' ')} · ${timeFormat === '12' ? 'AM / PM' : '24-hour'}`} right={chevron} onClick={() => setSystemSubTab('datetime')} />
                        <Row label="Users" sublabel="praneeth · Administrator" right={chevron} onClick={() => setSystemSubTab('users')} />
                        <Row label="About" sublabel="Hardware details and software versions" right={chevron} onClick={() => setSystemSubTab('about')} />
                    </RowGroup>
                </div>
            );
        }

        switch (activeTab) {
            // ── Wi-Fi ─────────────────────────────────────────────────────────
            case 'wifi':
                return (
                    <div className="flex flex-col">
                        <SectionLabel isDark={isDark}>Wireless</SectionLabel>
                        <RowGroup isDark={isDark}>
                            <Row
                                label="Wi-Fi"
                                right={<Toggle enabled={wifiEnabled} onToggle={() => { const v = !wifiEnabled; setWifiEnabled(v); syncSetting('wifi-active', v); }} />}
                            />
                        </RowGroup>
                        {wifiEnabled && (
                            <>
                                <SectionLabel isDark={isDark}>Connected Network</SectionLabel>
                                <RowGroup isDark={isDark}>
                                    <Row
                                        label="praneethreddy 5G"
                                        sublabel="Excellent signal · 540 Mb/s"
                                        right={
                                            <span className="flex items-center space-x-1 text-[10px] text-green-500">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                <span>Connected</span>
                                            </span>
                                        }
                                    />
                                </RowGroup>
                            </>
                        )}
                    </div>
                );

            // ── Bluetooth ─────────────────────────────────────────────────────
            case 'bluetooth':
                return (
                    <div className="flex flex-col">
                        <SectionLabel isDark={isDark}>Bluetooth</SectionLabel>
                        <RowGroup isDark={isDark}>
                            <Row
                                label="Bluetooth"
                                right={<Toggle enabled={bluetoothEnabled} onToggle={() => { const v = !bluetoothEnabled; setBluetoothEnabled(v); syncSetting('bluetooth-active', v); }} />}
                            />
                        </RowGroup>
                        {bluetoothEnabled && (
                            <>
                                <SectionLabel isDark={isDark}>Connected Devices</SectionLabel>
                                <RowGroup isDark={isDark}>
                                    <Row label="Logitech MX Master 3S" sublabel="Mouse" right={<span className="text-[10px] text-green-500">Connected</span>} />
                                    <Row label="Major IV" sublabel="Headphones" right={<span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Paired</span>} />
                                </RowGroup>
                            </>
                        )}
                    </div>
                );

            // ── Sound ─────────────────────────────────────────────────────────
            case 'sound':
                return (
                    <div className="flex flex-col">
                        <SectionLabel isDark={isDark}>Output</SectionLabel>
                        <RowGroup isDark={isDark}>
                            <Row
                                label="Volume"
                                right={
                                    <div className="flex items-center space-x-3 w-40">
                                        <input
                                            type="range" min="0" max="100"
                                            value={soundVolume}
                                            onChange={(e) => { const v = e.target.value; setSoundVolume(v); syncSetting('sound-level', v); }}
                                            className={`ubuntu-slider w-full rounded-full h-1.5 appearance-none cursor-pointer`}
                                            style={{
                                                background: `linear-gradient(to right, var(--ubuntu-accent-color, #e95420) 0%, var(--ubuntu-accent-color, #e95420) ${soundVolume}%, ${isDark ? '#4b5563' : '#d1d5db'} ${soundVolume}%, ${isDark ? '#4b5563' : '#d1d5db'} 100%)`
                                            }}
                                        />
                                        <span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'} w-8 text-right`}>{soundVolume}%</span>
                                    </div>
                                }
                            />
                            <Row label="Output Device" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Built-in Speakers</span>} />
                        </RowGroup>
                        <SectionLabel isDark={isDark}>Input</SectionLabel>
                        <RowGroup isDark={isDark}>
                            <Row label="Input Device" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Built-in Microphone</span>} />
                        </RowGroup>
                    </div>
                );

            // ── Power ─────────────────────────────────────────────────────────
            case 'power':
                return (
                    <div className="flex flex-col">
                        <SectionLabel isDark={isDark}>Power</SectionLabel>
                        <RowGroup isDark={isDark}>
                            <Row label="Power Mode" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Performance</span>} />
                            <Row label="Automatic Suspend" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>30 minutes</span>} />
                            <Row label="Screen Blank" right={<span className={`text-[11px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>5 minutes</span>} />
                        </RowGroup>
                    </div>
                );

            // ── Appearance ────────────────────────────────────────────────────
            case 'appearance':
                return (
                    <div className="flex flex-col">
                        {/* Style */}
                        <SectionLabel isDark={isDark}>Style</SectionLabel>
                        <div className="px-4 pb-2 flex space-x-4">
                            {[
                                { label: 'Light', dark: false, preview: 'bg-[#f5f5f5]', text: 'text-gray-600' },
                                { label: 'Dark', dark: true, preview: 'bg-[#1e1e1e]', text: 'text-gray-400' },
                            ].map(({ label, dark, preview, text }) => {
                                const isActive = !!props.dark_mode === dark;
                                return (
                                    <div
                                        key={label}
                                        onClick={() => handleThemeToggle(dark)}
                                        className={`flex flex-col items-center space-y-1.5 cursor-pointer p-2 rounded-xl transition-all ${isActive ? 'ring-2' : `ring-1 ${isDark ? 'ring-white/10 hover:ring-white/20' : 'ring-black/10 hover:ring-black/20'}`}`}
                                        style={isActive ? { '--tw-ring-color': 'var(--ubuntu-accent-color, #e95420)' } : {}}
                                    >
                                        <div className={`w-24 h-14 rounded-lg ${preview} flex items-center justify-center border ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                                            <span className={`text-[9px] ${text}`}>{label}</span>
                                        </div>
                                        <span 
                                            className={`text-[11px] ${isActive ? 'font-semibold' : (isDark ? 'text-gray-400' : 'text-gray-600')}`}
                                            style={isActive ? { color: 'var(--ubuntu-accent-color, #e95420)' } : {}}
                                        >{label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Accent color */}
                        <SectionLabel isDark={isDark}>Accent Color</SectionLabel>
                        <div className="px-4 pb-3 flex flex-wrap gap-2.5">
                            {Object.entries(accentColors).map(([name, hex]) => {
                                const isActive = selectedAccent === name;
                                return (
                                    <button
                                        key={name}
                                        onClick={() => changeAccent(name)}
                                        title={name}
                                        style={{ backgroundColor: hex }}
                                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform focus:outline-none ${isActive ? `scale-110 ring-2 ${isDark ? 'ring-white ring-offset-[#1e1e1e]' : 'ring-gray-300 ring-offset-[#fafafa]'} ring-offset-2` : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                                    >
                                        {isActive && (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3.5 h-3.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Wallpaper */}
                        <SectionLabel isDark={isDark}>Background</SectionLabel>
                        <div className="px-4 pb-4 flex flex-wrap gap-3">
                            {Object.keys(wallpapers).map((name, i) => (
                                <div
                                    key={i}
                                    tabIndex="0"
                                    onClick={() => handleWallpaperPick(name)}
                                    className={`w-[88px] h-14 rounded-lg cursor-pointer outline-none transition-all ${name === props.currBgImgName ? 'ring-2 scale-105' : `ring-1 ${isDark ? 'ring-white/10 hover:ring-white/30' : 'ring-black/10 hover:ring-black/30'}`}`}
                                    style={{ 
                                        backgroundImage: `url(${wallpapers[name]})`, 
                                        backgroundSize: 'cover', 
                                        backgroundPosition: 'center',
                                        ...(name === props.currBgImgName ? { '--tw-ring-color': 'var(--ubuntu-accent-color, #e95420)' } : {})
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                );

            // ── Notifications ─────────────────────────────────────────────────
            case 'notifications':
                return (
                    <div className="flex flex-col">
                        <SectionLabel isDark={isDark}>Notifications</SectionLabel>
                        <RowGroup isDark={isDark}>
                            <Row
                                label="Do Not Disturb"
                                sublabel="Mute all alerts and banners"
                                right={<Toggle enabled={dndEnabled} onToggle={() => { const v = !dndEnabled; setDndEnabled(v); syncSetting('dnd-active', v); }} />}
                            />
                            <Row label="Lock Screen Notifications" right={<Toggle enabled={lockScreenNotifEnabled} onToggle={() => setLockScreenNotifEnabled(!lockScreenNotifEnabled)} />} />
                        </RowGroup>
                    </div>
                );

            default:
                return null;
        }
    };


    return (
        <div className={`w-full flex flex-row flex-grow z-20 max-h-full overflow-hidden select-none ${isDark ? 'bg-[#1c1c1c] text-white' : 'bg-[#fafafa] text-gray-800'}`}>
            {/* Sidebar */}
            <div className={`w-[200px] flex-shrink-0 flex flex-col pt-3 overflow-y-auto ${isDark ? 'bg-[#161616] border-white/5' : 'bg-[#f0f0f0] border-gray-300'} border-r`}>
                <div className={`px-4 py-2 text-xs font-bold ${isDark ? 'text-gray-300 border-white/5' : 'text-gray-600 border-gray-300'} border-b pb-3 mb-1`}>Settings</div>
                <div className="flex flex-col py-1">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <div
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setSystemSubTab(null); }}
                                className={`flex items-center space-x-3 px-3.5 py-2.5 mx-1.5 rounded-lg text-[12px] cursor-pointer transition-colors duration-100 ${
                                    isActive
                                        ? (isDark ? 'bg-white/10 text-white font-medium' : 'bg-white text-gray-900 font-medium shadow-sm')
                                        : (isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5')
                                }`}
                            >
                                <span className={isActive ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-500' : 'text-gray-400')}>{tab.icon}</span>
                                <span>{tab.name}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content pane */}
            <div className="flex flex-col flex-grow overflow-hidden">
                {/* Header */}
                <div className={`px-5 py-3 text-sm font-semibold ${isDark ? 'text-gray-200 border-white/5 bg-[#1c1c1c]' : 'text-gray-800 border-gray-300 bg-[#fafafa]'} border-b`}>
                    {activeTab === 'system' && systemSubTab === 'about' ? 'About' : tabs.find(t => t.id === activeTab)?.name}
                </div>
                {/* Scrollable content */}
                <div className="flex-grow overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default Settings;

export const displaySettings = () => {
    return <Settings />;
};
