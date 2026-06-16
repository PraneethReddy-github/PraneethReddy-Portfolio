import React from 'react';
import { PhoneIcon, MailIcon, SafariIcon, VarshionIcon } from './Icons';

export default function Dock({ onOpenApp }) {
    const dockApps = [
        { id: 'phone', Icon: PhoneIcon, name: 'Phone' },
        { id: 'mail', Icon: MailIcon, name: 'Mail' },
        { id: 'safari', Icon: SafariIcon, name: 'Browser' },
        { id: 'varshion', Icon: VarshionIcon, name: 'Varshion' },
    ];

    return (
        <div className="absolute bottom-[18px] left-[16px] right-[16px] h-[92px] bg-white/15 backdrop-blur-2xl rounded-[34px] border border-white/25 flex items-center justify-around px-3 shadow-2xl z-10">
            {dockApps.map((app) => (
                <div
                    key={app.id}
                    className="ios-tap cursor-pointer"
                    onClick={() => onOpenApp(app.id)}
                >
                    <app.Icon />
                </div>
            ))}
        </div>
    );
}
