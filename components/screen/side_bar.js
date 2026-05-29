import React, { useState } from 'react'
import SideBarApp from '../base/side_bar_app';

let renderPinnedApps = (props) => {
    let sideBarAppsJsx = [];
    props.apps.forEach((app, index) => {
        if (props.favourite_apps[app.id] === false) return;
        sideBarAppsJsx.push(
            <SideBarApp key={index} id={app.id} title={app.title} icon={app.icon} isClose={props.closed_windows} isFocus={props.focused_windows} openApp={props.openAppByAppId} isMinimized={props.isMinimized} openFromMinimised={props.openFromMinimised} isExternalApp={app.isExternalApp} url={app.url} />
        );
    });
    return sideBarAppsJsx;
}

let renderRunningUnpinnedApps = (props) => {
    let sideBarAppsJsx = [];
    props.apps.forEach((app, index) => {
        // Only show if it's NOT a favorite, AND it's NOT closed (it's running)
        if (props.favourite_apps[app.id] === true || props.closed_windows[app.id] === true) return;
        
        sideBarAppsJsx.push(
            <SideBarApp key={index + 100} id={app.id} title={app.title} icon={app.icon} isClose={props.closed_windows} isFocus={props.focused_windows} openApp={props.openAppByAppId} isMinimized={props.isMinimized} openFromMinimised={props.openFromMinimised} isExternalApp={app.isExternalApp} url={app.url} />
        );
    });
    return sideBarAppsJsx;
}

export default function SideBar(props) {
    const hideTimeout = React.useRef(null);

    function showSideBar() {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        props.hideSideBar(null, false);
    }

    function hideSideBar() {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => {
            props.hideSideBar(null, true);
        }, 1500);
    }

    return (
        <>
            <div 
                onMouseEnter={showSideBar}
                onMouseLeave={hideSideBar}
                className={(props.hide ? " translate-y-20 opacity-0 pointer-events-none " : "") + " absolute transform duration-300 select-none z-40 bottom-2 left-1/2 -translate-x-1/2 w-auto h-auto flex flex-row justify-center items-center px-4 py-1.5 rounded-2xl bg-[#1e1e1e]/60 backdrop-blur-md border border-white/5 shadow-2xl"}
            >
                {/* Pinned Favorite Apps (excluding Chrome) */}
                {Object.keys(props.closed_windows).length !== 0 ? renderPinnedApps(props) : null}
                
                {/* Separator dividing Pinned and Unpinned/Chrome */}
                <div className="w-[1px] h-6 bg-white/10 self-center mx-1.5" />
                
                {/* Running Unpinned Apps */}
                {Object.keys(props.closed_windows).length !== 0 ? renderRunningUnpinnedApps(props) : null}

                <AllApps showApps={props.showAllApps} />
            </div>
            <div onMouseEnter={showSideBar} onMouseLeave={hideSideBar} className="w-full h-3 absolute bottom-0 left-0 bg-transparent z-50"></div>
        </>
    )
}

export function AllApps(props) {
    const [title, setTitle] = useState(false);

    return (
        <div
            className={`w-12 h-12 rounded-xl hover:bg-white hover:bg-opacity-10 flex items-center justify-center cursor-pointer transition-all active:scale-95 group`}
            onMouseEnter={() => { setTitle(true); }}
            onMouseLeave={() => { setTitle(false); }}
            onClick={props.showApps}
        >
            <div className="relative flex items-center justify-center">
                <svg
                    className="w-7 h-7 text-white fill-current"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M17.61.455a3.41 3.41 0 0 0-3.41 3.41 3.41 3.41 0 0 0 3.41 3.41 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41zM12.92.8C8.923.777 5.137 2.941 3.148 6.451a4.5 4.5 0 0 1 .26-.007 4.92 4.92 0 0 1 2.585.737A8.316 8.316 0 0 1 12.688 3.6 4.944 4.944 0 0 1 13.723.834 11.008 11.008 0 0 0 12.92.8zm9.226 4.994a4.915 4.915 0 0 1-1.918 2.246 8.36 8.36 0 0 1-.273 8.303 4.89 4.89 0 0 1 1.632 2.54 11.156 11.156 0 0 0 .559-13.089zM3.41 7.932A3.41 3.41 0 0 0 0 11.342a3.41 3.41 0 0 0 3.41 3.409 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41zm2.027 7.866a4.908 4.908 0 0 1-2.915.358 11.1 11.1 0 0 0 7.991 6.698 11.234 11.234 0 0 0 2.422.249 4.879 4.879 0 0 1-.999-2.85 8.484 8.484 0 0 1-.836-.136 8.304 8.304 0 0 1-5.663-4.32zm11.405.928a3.41 3.41 0 0 0-3.41 3.41 3.41 3.41 0 0 0 3.41 3.41 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41z" />
                </svg>
                <div className={(title ? " visible " : " invisible ") + " w-max py-1 px-2.5 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3.5 text-ubt-grey text-opacity-95 text-xs bg-ub-grey bg-opacity-95 border-gray-450 border border-opacity-40 rounded-md shadow-2xl z-30 font-sans"}>
                    Show Applications
                </div>
            </div>
        </div>
    );
}
