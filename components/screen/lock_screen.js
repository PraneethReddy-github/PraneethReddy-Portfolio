import React, { useEffect } from 'react';
import Clock from '../util components/clock';

export default function LockScreen(props) {

    const wallpapers = {
        "wall-1": "./images/wallpapers/wall-1.webp",
        "wall-2": "./images/wallpapers/wall-2.webp",
        "wall-3": "./images/wallpapers/wall-3.webp",
        "wall-4": "./images/wallpapers/wall-4.webp",
        "wall-5": "./images/wallpapers/wall-5.webp",
        "wall-6": "./images/wallpapers/wall-6.webp",
        "wall-7": "./images/wallpapers/wall-7.webp",
        "wall-8": "./images/wallpapers/wall-8.webp",
        "wall-9": "./images/wallpapers/wall-9.png",
        "wall-10": "./images/wallpapers/wall-10.png",
    };

    useEffect(() => {
        if (props.isLocked) {
            window.addEventListener('click', props.unLockScreen);
            window.addEventListener('keydown', props.unLockScreen);
        }
        return () => {
            window.removeEventListener('click', props.unLockScreen);
            window.removeEventListener('keydown', props.unLockScreen);
        };
    }, [props.isLocked, props.unLockScreen]);

    return (
        <div id="ubuntu-lock-screen" style={{ zIndex: "100" }} className={(props.isLocked ? " visible translate-y-0 " : " invisible -translate-y-full ") + " absolute outline-none bg-black bg-opacity-90 transform duration-500 select-none top-0 right-0 overflow-hidden m-0 p-0 h-screen w-screen"}>
            <div style={{ backgroundImage: `url(${wallpapers[props.bgImgName]})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center" }} className="absolute top-0 left-0 w-full h-full transform z-20 blur-md scale-105"></div>
            <div className="w-full h-full z-50 overflow-hidden relative flex flex-col justify-center items-center text-white">
                <div className=" text-7xl">
                    <Clock onlyTime={true} />
                </div>
                <div className="mt-4 text-xl font-medium">
                    <Clock onlyDay={true} />
                </div>
                <div className="mt-16 text-base text-gray-300 font-light select-none tracking-wide animate-pulse">
                    Click or Press a key to unlock
                </div>
                <div className="mt-6 text-xs text-gray-300 font-light select-none tracking-wide max-w-xs text-center">
                    "Talk is cheap. Show me the code." — Linus Torvalds
                </div>
            </div>
        </div>
    )
}
