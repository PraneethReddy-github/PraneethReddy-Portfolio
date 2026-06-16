import React from 'react';

export default function BootScreen() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black relative z-50">
            <div className="absolute w-32 h-32 rounded-full bg-white/5 blur-3xl animate-[pulse_2.5s_ease-in-out_infinite]" />

            <svg
                viewBox="0 0 384 512"
                className="w-[90px] h-[90px] fill-white mb-[88px] relative z-10"
                style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.15))' }}
            >
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
            </svg>

            <div className="absolute bottom-[18%] w-[160px] h-[4px] bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full animate-[ios-boot_2.3s_cubic-bezier(0.45,0.05,0.3,1)_forwards]" />
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes ios-boot {
                    0%   { width: 0%; }
                    20%  { width: 25%; }
                    50%  { width: 55%; }
                    75%  { width: 75%; }
                    90%  { width: 88%; }
                    100% { width: 100%; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50%       { opacity: 0.8; transform: scale(1.15); }
                }
            `}} />
        </div>
    );
}
