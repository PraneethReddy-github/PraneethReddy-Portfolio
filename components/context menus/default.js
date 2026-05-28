import React from 'react'
function DefaultMenu(props) {
    const { isDark, active, targetId, openApp, deleteApp } = props;
    
    // If we right click the desktop itself but somehow trigger this menu, fallback gracefully
    if (!targetId) return null;

    return (
        <div id="default-menu" className={(active ? " block " : " hidden ") + ` cursor-default w-48 text-left font-light rounded-xl py-2 absolute z-50 text-[13px] shadow-lg border ${isDark ? 'bg-[#2a2a2a] text-white border-white/10' : 'bg-white text-gray-800 border-gray-200'}`}>
            <div 
                onClick={() => openApp(targetId)} 
                className={`w-full block cursor-default py-1.5 px-5 ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
            >
                Open
            </div>
            <Devider isDark={isDark} />
            <div 
                onClick={() => deleteApp(targetId)} 
                className={`w-full block cursor-default py-1.5 px-5 text-red-500 font-medium ${isDark ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
            >
                Move to Trash
            </div>
        </div>
    )
}

function Devider({ isDark }) {
    return (
        <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200'} my-1 mx-4`}></div>
    );
}

export default DefaultMenu
