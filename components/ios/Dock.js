import React from 'react';
import { PhoneIcon, MailIcon, SafariIcon, VarshionIcon } from './Icons';
import useLongPress from './useLongPress';
import { haptic } from './haptics';

export const DOCK_APPS = [
    { id: 'phone', Icon: PhoneIcon, name: 'Contact' },
    { id: 'mail', Icon: MailIcon, name: 'Mail' },
    { id: 'safari', Icon: SafariIcon, name: 'Browser' },
    { id: 'varshion', Icon: VarshionIcon, name: 'Varshion' },
];

function DockIcon({ app, onOpen, onLongPress, active }) {
    const lp = useLongPress({
        onLongPress: (e, rect) => onLongPress && onLongPress(app, rect),
        onClick: () => { haptic('light'); onOpen(app.id); },
    });
    return (
        <div className="relative flex flex-col items-center">
            <div {...lp.handlers} style={lp.style} className="ios-tap cursor-pointer">
                <app.Icon />
            </div>
            {/* Tiny "running" dot under recently-used dock apps, like macOS/iPadOS */}
            <span
                className="absolute -bottom-2 w-[4px] h-[4px] rounded-full bg-white/80 transition-opacity duration-300"
                style={{ opacity: active ? 1 : 0 }}
            />
        </div>
    );
}

export default function Dock({ onOpenApp, onLongPress, activeIds = [] }) {
    return (
        <div className="absolute bottom-[18px] left-[16px] right-[16px] h-[92px] bg-white/15 backdrop-blur-2xl rounded-[34px] border border-white/25 flex items-center justify-around px-3 shadow-2xl z-10">
            {DOCK_APPS.map((app) => (
                <DockIcon
                    key={app.id}
                    app={app}
                    onOpen={onOpenApp}
                    onLongPress={onLongPress}
                    active={activeIds.includes(app.id)}
                />
            ))}
        </div>
    );
}
