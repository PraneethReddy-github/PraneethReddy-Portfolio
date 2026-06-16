import React, { useState, useRef } from 'react';
import StatusBar from './StatusBar';
import Dock from './Dock';
import AppWrapper from './AppWrapper';
import AppLibrary from './AppLibrary';
import { SongWidget, CalendarWidget, WeatherWidget } from './Widgets';
import {
    AboutMeIcon, CameraIcon, GamesIcon, PhotosIcon,
    GitHubIcon, LinkedInIcon,
} from './Icons';

export default function HomeScreen({ onLock }) {
    const [openApp, setOpenApp] = useState(null);
    const [appParams, setAppParams] = useState(null); // optional deep-link data (e.g. Camera → Photos)
    const [progress, setProgress] = useState(0); // 0 = home, 1 = app library (continuous)
    const pagerRef = useRef(null);

    const openAppWith = (id, params = null) => { setAppParams(params); setOpenApp(id); };

    const apps = [
        { id: 'portfolio', name: 'About Me', Icon: AboutMeIcon },
        { id: 'camera', name: 'Camera', Icon: CameraIcon },
        { id: 'games', name: 'Arcade', Icon: GamesIcon },
        { id: 'photos', name: 'Photos', Icon: PhotosIcon },
        { id: 'github', name: 'GitHub', Icon: GitHubIcon },
        { id: 'linkedin', name: 'LinkedIn', Icon: LinkedInIcon },
    ];

    const openExternal = {
        github: 'https://github.com/PraneethReddy-github',
        linkedin: 'https://www.linkedin.com/in/connectwithpraneeth/',
    };

    const handleAppClick = (id) => {
        if (openExternal[id]) window.open(openExternal[id], '_blank');
        else openAppWith(id);
    };

    const onPagerScroll = (e) => {
        const el = e.currentTarget;
        setProgress(Math.max(0, Math.min(1, el.scrollLeft / el.clientWidth)));
    };

    return (
        <div className="w-full h-full relative overflow-hidden ios-font">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(/images/wallpapers/iphone.jpg)', animation: 'ios-wallpaper-breathe 18s ease-in-out infinite' }}
            />

            <StatusBar />

            {/* Frosted top scrim — content blurs/fades as it scrolls up under the
                time + island + controls. Sits above content (z-40) but below the
                status bar (z-50), with a mask so the blur dissolves downward. */}
            <div
                className="absolute top-0 left-0 right-0 h-[68px] z-40 pointer-events-none"
                style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.22), rgba(0,0,0,0))',
                    maskImage: 'linear-gradient(to bottom, black 0%, black 42%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 42%, transparent 100%)',
                }}
            />

            <div
                ref={pagerRef}
                onScroll={onPagerScroll}
                className="flex h-full w-full overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden"
                style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}
            >
                <div
                    className="w-full h-full flex-shrink-0 overflow-y-auto ios-scroll pt-16 px-5 pb-32"
                    style={{ scrollSnapAlign: 'start' }}
                >
                    <div className="grid grid-cols-2 gap-3 mb-3 animate-ios-rise">
                        <CalendarWidget onOpen={openAppWith} />
                        <WeatherWidget onOpen={openAppWith} />
                    </div>

                    <div className="mb-6 animate-ios-rise" style={{ animationDelay: '60ms' }}>
                        <SongWidget />
                    </div>

                    <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                        {apps.map((app, i) => (
                            <div
                                key={app.id}
                                className="flex flex-col items-center animate-ios-icon-pop"
                                style={{ animationDelay: `${i * 28}ms` }}
                                onClick={() => handleAppClick(app.id)}
                            >
                                <div className="ios-tap cursor-pointer">
                                    <app.Icon />
                                </div>
                                <span className="text-white text-[11px] mt-1.5 font-medium drop-shadow-md select-none text-center leading-tight max-w-[72px] truncate">
                                    {app.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    className="w-full h-full flex-shrink-0 overflow-y-auto ios-scroll"
                    style={{ scrollSnapAlign: 'start' }}
                >
                    <AppLibrary onAppClick={handleAppClick} />
                </div>
            </div>

            <div
                className="absolute bottom-[122px] left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none"
                style={{ opacity: 1 - progress }}
            >
                {[0, 1].map((i) => (
                    <div
                        key={i}
                        className="w-[7px] h-[7px] rounded-full"
                        style={{ background: i === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)' }}
                    />
                ))}
            </div>

            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ transform: `translateX(${-progress * 100}%)` }}
            >
                <div className="pointer-events-auto">
                    <Dock onOpenApp={openAppWith} />
                </div>
            </div>

            {openApp && (
                <AppWrapper
                    key={openApp}
                    appId={openApp}
                    params={appParams}
                    onOpenApp={openAppWith}
                    onClose={() => { setOpenApp(null); setAppParams(null); }}
                />
            )}
        </div>
    );
}
