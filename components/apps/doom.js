import React from 'react';

export default function Doom() {
    return (
        <div className="w-full h-full flex flex-col bg-black text-white">
            <div className="bg-[#1e1e1e] text-[11px] text-gray-400 px-4 py-1.5 flex justify-between items-center select-none font-sans border-b border-white/5 flex-shrink-0">
                <span className="flex items-center space-x-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span>Doom (DOS Shareware)</span>
                </span>
                <span className="text-[10px] text-gray-500 italic">Double-click game to lock mouse; supports keyboard, mouse, and gamepads</span>
            </div>
            <div className="flex-grow w-full h-full overflow-hidden relative bg-black">
                <iframe 
                    src="https://raz0red.github.io/webprboom/" 
                    className="w-full h-full absolute inset-0 border-none"
                    title="Doom Wasm Game"
                    allow="autoplay; gamepad; keyboard; pointer-lock"
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                    allowFullScreen
                />
            </div>
        </div>
    );
}

export const displayDoom = () => {
    return <Doom />;
}
