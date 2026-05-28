import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

class Slider extends Component {
    render() {
        return (
            <input
                type="range"
                onChange={this.props.onChange}
                className={this.props.className}
                name={this.props.name}
                min="0"
                max="100"
                value={this.props.value}
                step="1"
                style={this.props.style}
            />
        );
    }
}

export class StatusCard extends Component {
    constructor() {
        super();
        this.state = {
            sound_level: 75,
            brightness_level: 100,
            wifi_active: true,
            bluetooth_active: true,
            power_mode_active: true,
            night_light_active: false,
            dnd_active: false,
            camera_flash: false
        };
    }

    handleClickOutside = () => {
        this.props.toggleVisible();
    };

    componentDidMount() {
        const savedWifi = localStorage.getItem('wifi-active');
        const savedBt   = localStorage.getItem('bluetooth-active');
        const savedDnd  = localStorage.getItem('dnd-active');
        this.setState({
            sound_level:       parseInt(localStorage.getItem('sound-level') || '75', 10),
            brightness_level:  parseInt(localStorage.getItem('brightness-level') || '100', 10),
            night_light_active: localStorage.getItem('night-light') === 'true',
            wifi_active:       savedWifi !== null ? savedWifi === 'true' : true,
            bluetooth_active:  savedBt   !== null ? savedBt   === 'true' : true,
            dnd_active:        savedDnd  !== null ? savedDnd  === 'true' : false,
        }, () => { this.applyScreenFilters(); });

        // Keep in sync with Settings app
        this._onSettingsChanged = (e) => {
            const { key, value } = e.detail;
            if (key === 'wifi-active')       this.setState({ wifi_active:      value });
            if (key === 'bluetooth-active')  this.setState({ bluetooth_active: value });
            if (key === 'sound-level')       this.setState({ sound_level:      parseInt(value, 10) });
            if (key === 'dnd-active')        this.setState({ dnd_active:       value });
        };
        window.addEventListener('portfolio-settings-changed', this._onSettingsChanged);
    }

    componentWillUnmount() {
        window.removeEventListener('portfolio-settings-changed', this._onSettingsChanged);
    }

    applyScreenFilters = () => {
        const screen = document.getElementById('monitor-screen');
        if (screen) {
            // Brightness formula: maps 0-100 to 0.45-1.0 to ensure the screen remains visible at minimum brightness
            const brightness = (0.55 / 100) * this.state.brightness_level + 0.45;
            let filterString = `brightness(${brightness})`;
            if (this.state.night_light_active) {
                filterString += ` sepia(0.45) saturate(1.15) hue-rotate(-15deg)`;
            }
            screen.style.filter = filterString;
        }
    };

    handleBrightness = (e) => {
        const val = e.target.value;
        this.setState({ brightness_level: val }, () => {
            localStorage.setItem('brightness-level', val);
            this.applyScreenFilters();
        });
    };

    handleSound = (e) => {
        const val = e.target.value;
        this.setState({ sound_level: val }, () => {
            localStorage.setItem('sound-level', val);
            window.dispatchEvent(new CustomEvent('portfolio-settings-changed', { detail: { key: 'sound-level', value: val } }));
        });
    };

    toggleWifi = () => {
        const nextVal = !this.state.wifi_active;
        this.setState({ wifi_active: nextVal }, () => {
            localStorage.setItem('wifi-active', nextVal);
            window.dispatchEvent(new Event('wifi-status-changed'));
            window.dispatchEvent(new CustomEvent('portfolio-settings-changed', { detail: { key: 'wifi-active', value: nextVal } }));
        });
    };

    toggleBluetooth = () => {
        const nextVal = !this.state.bluetooth_active;
        this.setState({ bluetooth_active: nextVal }, () => {
            localStorage.setItem('bluetooth-active', nextVal);
            window.dispatchEvent(new CustomEvent('portfolio-settings-changed', { detail: { key: 'bluetooth-active', value: nextVal } }));
        });
    };

    togglePowerMode = () => {
        this.setState({ power_mode_active: !this.state.power_mode_active });
    };

    toggleNightLight = () => {
        const nextVal = !this.state.night_light_active;
        this.setState({ night_light_active: nextVal }, () => {
            localStorage.setItem('night-light', nextVal);
            this.applyScreenFilters();
        });
    };

    toggleDND = () => {
        const nextVal = !this.state.dnd_active;
        this.setState({ dnd_active: nextVal }, () => {
            localStorage.setItem('dnd-active', nextVal);
            window.dispatchEvent(new CustomEvent('portfolio-settings-changed', { detail: { key: 'dnd-active', value: nextVal } }));
        });
    };

    triggerCamera = () => {
        this.setState({ camera_flash: true });
        setTimeout(() => this.setState({ camera_flash: false }), 200);
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav');
            audio.volume = 0.3;
            audio.play();
        } catch (e) {
            // Audio error ignored
        }

        const capture = () => {
            if (window.html2canvas) {
                // Find screen element to capture (or fall back to document.body)
                const target = document.getElementById('monitor-screen') || document.body;
                window.html2canvas(target, {
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null
                }).then(canvas => {
                    const link = document.createElement('a');
                    const dateStr = new Date().toISOString().slice(0, 19).replace(/T|:/g, '_');
                    link.download = `screenshot_${dateStr}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                });
            }
        };

        if (!window.html2canvas) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = capture;
            document.head.appendChild(script);
        } else {
            capture();
        }
    };

    render() {
        const { wifi_active, bluetooth_active, power_mode_active, night_light_active, dnd_active } = this.state;
        const isDarkTheme = this.props.dark_mode !== false;

        // Dynamic theme styling
        const containerClass = isDarkTheme
            ? "absolute w-[360px] bg-[#1e1e1e] bg-opacity-95 text-white rounded-3xl p-5 shadow-2xl border border-[#2d2d2d] top-9 right-3 z-50 select-none status-card transition-all duration-300 ease-out"
            : "absolute w-[360px] bg-[#f6f6f6] bg-opacity-98 text-gray-900 rounded-3xl p-5 shadow-2xl border border-[#d1d1d1] top-9 right-3 z-50 select-none status-card transition-all duration-300 ease-out";

        const activeBtnClass = "bg-[#4d5c54] text-white hover:bg-[#57685f]";
        const inactiveBtnClass = isDarkTheme
            ? "bg-[#2d2d2d] text-gray-300 hover:bg-[#383838]"
            : "bg-[#e4e4e4] text-gray-800 hover:bg-[#dadada]";

        const headerBtnClass = isDarkTheme
            ? "w-8 h-8 rounded-full bg-[#2d2d2d] hover:bg-[#383838] flex items-center justify-center cursor-pointer transition-colors text-white"
            : "w-8 h-8 rounded-full bg-[#e4e4e4] hover:bg-[#dadada] flex items-center justify-center cursor-pointer transition-colors text-gray-800";

        const batteryPillClass = isDarkTheme
            ? "flex items-center space-x-2 bg-[#2d2d2d] hover:bg-[#383838] px-3 py-1.5 rounded-full text-xxs font-medium cursor-pointer transition-colors text-white"
            : "flex items-center space-x-2 bg-[#e4e4e4] hover:bg-[#dadada] px-3 py-1.5 rounded-full text-xxs font-medium cursor-pointer transition-colors text-gray-800";

        const sliderContainerClass = isDarkTheme
            ? "flex items-center space-x-3 mb-3 bg-[#2d2d2d] bg-opacity-40 p-2.5 rounded-2xl"
            : "flex items-center space-x-3 mb-3 bg-[#e4e4e4] bg-opacity-50 p-2.5 rounded-2xl";

        const sliderContainerClassBrightness = isDarkTheme
            ? "flex items-center space-x-3 mb-4 bg-[#2d2d2d] bg-opacity-40 p-2.5 rounded-2xl"
            : "flex items-center space-x-3 mb-4 bg-[#e4e4e4] bg-opacity-50 p-2.5 rounded-2xl";

        const sliderIconClass = isDarkTheme ? "w-5 h-5 text-gray-400" : "w-5 h-5 text-gray-600";

        const labelTitleClass = "text-xxs font-bold leading-tight truncate";
        const labelSubtitleClass = (active) => {
            if (active) return "text-[9px] text-gray-200 leading-none truncate";
            return isDarkTheme ? "text-[9px] text-gray-300 leading-none truncate" : "text-[9px] text-gray-500 leading-none truncate";
        };

        const trackBgColor = isDarkTheme ? "#3e3e3e" : "#cccccc";

        // Linear gradient background to show filled tracks on range inputs
        const soundSliderStyle = {
            background: `linear-gradient(to right, var(--ubuntu-accent-color, #e95420) 0%, var(--ubuntu-accent-color, #e95420) ${this.state.sound_level}%, ${trackBgColor} ${this.state.sound_level}%, ${trackBgColor} 100%)`
        };

        const brightnessSliderStyle = {
            background: `linear-gradient(to right, var(--ubuntu-accent-color, #e95420) 0%, var(--ubuntu-accent-color, #e95420) ${this.state.brightness_level}%, ${trackBgColor} ${this.state.brightness_level}%, ${trackBgColor} 100%)`
        };

        return (
            <>
                {this.state.camera_flash && (
                    <div className="fixed inset-0 bg-white z-50 pointer-events-none animate-ping" />
                )}
                <div className={containerClass + (this.props.visible ? ' visible animateShow' : ' invisible')}>
                    {/* Top Row: Battery Status & Quick Controls */}
                    <div className="flex justify-between items-center mb-4">
                        <div className={batteryPillClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-green-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                            <span>82%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* Camera (Screenshot) */}
                            <button onClick={this.triggerCamera} className={headerBtnClass} title="Take Screenshot">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                            </button>
                            {/* Settings (Open Settings App) */}
                            <button id="open-settings" className={headerBtnClass} title="Settings">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869L9.594 3.94z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            {/* Lock Screen */}
                            <button onClick={this.props.lockScreen} className={headerBtnClass} title="Lock Screen">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-2.25 10.5h13.5c.621 0 1.125-.504 1.125-1.125v-7.25c0-.621-.504-1.125-1.125-1.125H6.75c-.621 0-1.125.504-1.125 1.125v7.25c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </button>
                            {/* Power Off */}
                            <button onClick={this.props.shutDown} className={headerBtnClass} title="Power Menu">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-red-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Sound Slider */}
                    <div className={sliderContainerClass}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={sliderIconClass}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72" />
                        </svg>
                        <Slider 
                            onChange={this.handleSound} 
                            className="ubuntu-slider flex-grow h-1.5 rounded-lg appearance-none cursor-pointer" 
                            value={this.state.sound_level} 
                            name="sound_range" 
                            style={soundSliderStyle}
                        />
                    </div>

                    {/* Brightness Slider */}
                    <div className={sliderContainerClassBrightness}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={sliderIconClass}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m-9-9h1.5m15 0H21m-3.343-5.657l-1.06 1.06m-9.192 9.192l-1.06 1.06m11.314 0l-1.06-1.06M6.343 6.343l-1.06-1.06M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <Slider 
                            onChange={this.handleBrightness} 
                            className="ubuntu-slider flex-grow h-1.5 rounded-lg appearance-none cursor-pointer" 
                            name="brightness_range" 
                            value={this.state.brightness_level} 
                            style={brightnessSliderStyle}
                        />
                    </div>

                    {/* Quick Setting Grid (GNOME 45/46 6-box uniform format) */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Wi-Fi Pill */}
                        <div onClick={this.toggleWifi} className={`flex items-center space-x-2.5 p-2.5 rounded-2xl cursor-pointer select-none transition-colors ${wifi_active ? activeBtnClass : inactiveBtnClass}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5zM8.25 15a5.25 5.25 0 017.5 0M5.25 12a9.45 9.45 0 0113.5 0M2.25 9A14.25 14.25 0 0121.75 9" />
                            </svg>
                            <div className="flex flex-col text-left overflow-hidden">
                                <span className={labelTitleClass}>Wi-Fi</span>
                                <span className={labelSubtitleClass(wifi_active)}>{wifi_active ? "praneethreddy 5g" : "Off"}</span>
                            </div>
                        </div>

                        {/* Bluetooth Pill */}
                        <div onClick={this.toggleBluetooth} className={`flex items-center space-x-2.5 p-2.5 rounded-2xl cursor-pointer select-none transition-colors ${bluetooth_active ? activeBtnClass : inactiveBtnClass}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 17.5l11-11L12 2v20l5.5-4.5-11-11" />
                            </svg>
                            <div className="flex flex-col text-left overflow-hidden">
                                <span className={labelTitleClass}>Bluetooth</span>
                                <span className={labelSubtitleClass(bluetooth_active)}>{bluetooth_active ? "On" : "Off"}</span>
                            </div>
                        </div>

                        {/* Power Mode Pill */}
                        <div onClick={this.togglePowerMode} className={`flex items-center space-x-2.5 p-2.5 rounded-2xl cursor-pointer select-none transition-colors ${power_mode_active ? activeBtnClass : inactiveBtnClass}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                            </svg>
                            <div className="flex flex-col text-left overflow-hidden">
                                <span className={labelTitleClass}>Power Mode</span>
                                <span className={labelSubtitleClass(power_mode_active)}>{power_mode_active ? "Performance" : "Balanced"}</span>
                            </div>
                        </div>

                        {/* Night Light Pill */}
                        <div onClick={this.toggleNightLight} className={`flex items-center space-x-2.5 p-2.5 rounded-2xl cursor-pointer select-none transition-colors ${night_light_active ? activeBtnClass : inactiveBtnClass}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                            <div className="flex flex-col text-left overflow-hidden">
                                <span className={labelTitleClass}>Night Light</span>
                                <span className={labelSubtitleClass(night_light_active)}>{night_light_active ? "On" : "Off"}</span>
                            </div>
                        </div>

                        {/* Dark Style Pill */}
                        <div onClick={() => this.props.toggleDarkMode()} className={`flex items-center space-x-2.5 p-2.5 rounded-2xl cursor-pointer select-none transition-colors ${isDarkTheme ? activeBtnClass : inactiveBtnClass}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m-.386-6.364l1.591 1.591M12 18.75a6.75 6.75 0 110-13.5 6.75 6.75 0 010 13.5z" />
                            </svg>
                            <div className="flex flex-col text-left overflow-hidden">
                                <span className={labelTitleClass}>Dark Style</span>
                                <span className={labelSubtitleClass(isDarkTheme)}>{isDarkTheme ? "On" : "Off"}</span>
                            </div>
                        </div>

                        {/* Do Not Disturb Pill */}
                        <div onClick={this.toggleDND} className={`flex items-center space-x-2.5 p-2.5 rounded-2xl cursor-pointer select-none transition-colors ${dnd_active ? activeBtnClass : inactiveBtnClass}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex flex-col text-left overflow-hidden">
                                <span className={labelTitleClass}>DND</span>
                                <span className={labelSubtitleClass(dnd_active)}>{dnd_active ? "On" : "Off"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default onClickOutside(StatusCard);
