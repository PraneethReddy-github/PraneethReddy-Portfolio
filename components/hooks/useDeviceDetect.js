import { useState, useEffect } from 'react';

export default function useDeviceDetect() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const isMobileDevice = Boolean(userAgent.match(mobileRegex));
        
        const isSmallScreen = window.innerWidth <= 768;

        setIsMobile(isMobileDevice || isSmallScreen);

        const handleResize = () => {
            setIsMobile(isMobileDevice || window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}
