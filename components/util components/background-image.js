import React, { useState, useEffect, useRef } from 'react';

const bg_images = {
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

const baseStyle = {
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
};

export default function BackgroundImage({ img }) {
    // `current` is what's fully visible; `next` is fading in on top
    const [current, setCurrent] = useState(img);
    const [next, setNext]       = useState(null);
    const [fading, setFading]   = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        // No change — nothing to do
        if (img === current) return;

        // Clear any in-progress transition
        if (timerRef.current) clearTimeout(timerRef.current);

        // Start the cross-fade: put the new image on top at opacity 0
        setNext(img);
        setFading(false);

        // Tiny delay lets the browser paint the new layer at opacity-0 first
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setFading(true); // triggers CSS transition to opacity-1
            });
        });

        // After transition completes, promote next → current and clear the overlay
        timerRef.current = setTimeout(() => {
            setCurrent(img);
            setNext(null);
            setFading(false);
        }, 700); // matches transition duration below

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [img]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="absolute -z-10 top-0 right-0 h-full w-full overflow-hidden">
            {/* Layer 1 — the stable "old" wallpaper, always fully visible */}
            <div
                style={{
                    ...baseStyle,
                    backgroundImage: `url(${bg_images[current]})`,
                }}
                className="absolute inset-0"
            />

            {/* Layer 2 — the incoming wallpaper, cross-fades in on top */}
            {next && (
                <div
                    style={{
                        ...baseStyle,
                        backgroundImage: `url(${bg_images[next]})`,
                        opacity: fading ? 1 : 0,
                        transition: 'opacity 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className="absolute inset-0"
                />
            )}
        </div>
    );
}
