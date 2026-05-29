import React, { useState, useEffect } from 'react'

function DesktopMenu(props) {

    const [isFullScreen, setIsFullScreen] = useState(false)

    useEffect(() => {
        document.addEventListener('fullscreenchange', checkFullScreen);
        return () => { document.removeEventListener('fullscreenchange', checkFullScreen); };
    }, [])

    const openTerminal = () => { props.openApp("terminal"); }
    const openSettings = () => { props.openApp("settings"); }

    const checkFullScreen = () => {
        if (document.fullscreenElement) { setIsFullScreen(true) }
        else { setIsFullScreen(false) }
    }

    const goFullScreen = () => {
        try {
            if (document.fullscreenElement) { document.exitFullscreen() }
            else { document.documentElement.requestFullscreen() }
        } catch (e) { console.log(e) }
    }

    const { isDark, active, addNewFolder } = props;

    return (
        <div id="desktop-menu" className={(active ? " block " : " hidden ") + ` cursor-default w-52 text-left font-light rounded-xl py-2 absolute z-50 text-[13px] shadow-lg border ${isDark ? 'bg-[#2a2a2a] text-white border-white/10' : 'bg-white text-gray-800 border-gray-200'}`}>
            <div onClick={addNewFolder} className={`w-full py-1.5 ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                <span className="ml-5">New Folder</span>
            </div>
            <Devider isDark={isDark} />
            <div onClick={openTerminal} className={`w-full py-1.5 ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                <span className="ml-5">Open in Terminal</span>
            </div>
            <Devider isDark={isDark} />
            <div onClick={openSettings} className={`w-full py-1.5 ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                <span className="ml-5">Change Background...</span>
            </div>
            <div onClick={openSettings} className={`w-full py-1.5 ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                <span className="ml-5">Settings</span>
            </div>
            <Devider isDark={isDark} />
            <div onClick={goFullScreen} className={`w-full py-1.5 ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                <span className="ml-5">{isFullScreen ? "Exit" : "Enter"} Full Screen</span>
            </div>
        </div>
    )
}

function Devider({ isDark }) {
    return (
        <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200'} my-1 mx-4`}></div>
    );
}

export default DesktopMenu
