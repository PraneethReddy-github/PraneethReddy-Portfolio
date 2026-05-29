import React, { Component } from 'react';
import BackgroundImage from '../util components/background-image';
import SideBar from './side_bar';
import apps from '../../apps.config';
import Window from '../base/window';
import UbuntuApp from '../base/ubuntu_app';
import AllApplications from '../screen/all-applications'
import DesktopMenu from '../context menus/desktop-menu';
import DefaultMenu from '../context menus/default';
import $ from 'jquery';
import ReactGA from 'react-ga4';

export class Desktop extends Component {
    constructor() {
        super();
        this.app_stack = [];
        this.initFavourite = {};
        this.allWindowClosed = false;
        this.state = {
            focused_windows: {},
            closed_windows: {},
            allAppsView: false,
            overlapped_windows: {},
            disabled_apps: {},
            favourite_apps: {},
            hideSideBar: false,
            minimized_windows: {},
            desktop_apps: [],
            context_menus: {
                desktop: false,
                default: false,
            },
            showNameBar: false,
            activitiesSearchQuery: "",
            context_menu_target: null,
            selectionBox: {
                visible: false,
                startX: 0,
                startY: 0,
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            selected_apps: {}
        }
    }

    componentDidMount() {
        ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });
        this.fetchAppsData();
        this.setContextListeners();
        this.setEventListeners();
        this.checkForNewFolders();
        window.addEventListener('keydown', this.handleGlobalKeys);
        window.addEventListener('ubuntu-trash-restored', this.handleTrashRestored);

        // Open default apps after boot sequence
        setTimeout(() => {
            this.openApp("chrome");
            setTimeout(() => {
                this.openApp("terminal");
            }, 300); // Slight delay for smoother animation
        }, 1500);
    }

    componentWillUnmount() {
        this.removeContextListeners();
        window.removeEventListener('keydown', this.handleGlobalKeys);
        window.removeEventListener('ubuntu-trash-restored', this.handleTrashRestored);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleTrashRestored = () => {
        // Need to remove any duplicate new-folders from the apps array first to prevent double-rendering
        const storedNewFolders = JSON.parse(localStorage.getItem('new_folders')) || [];
        const validFolderIds = storedNewFolders.map(f => `new-folder-${f.id}`);

        // Remove old dynamic folders from the global apps array to prevent duplication
        for (let i = apps.length - 1; i >= 0; i--) {
            if (apps[i].id.startsWith('new-folder-')) {
                apps.splice(i, 1);
            }
        }

        this.checkForNewFolders();
        this.updateAppsData();
    }

    checkForNewFolders = () => {
        // Clear any existing dynamic folders from global apps array first to prevent duplicates
        for (let i = apps.length - 1; i >= 0; i--) {
            if (apps[i].id.startsWith('new-folder-')) {
                apps.splice(i, 1);
            }
        }

        var new_folders = localStorage.getItem('new_folders');
        if (new_folders === null || new_folders === undefined) {
            localStorage.setItem("new_folders", JSON.stringify([]));
        } else {
            try {
                new_folders = JSON.parse(new_folders);
                // Sanitize IDs: strip out any prefix and filter duplicate entries
                let seen = new Set();
                let sanitized = [];
                new_folders.forEach(folder => {
                    let cleanId = folder.id.replace(/^new-folder-/, '');
                    if (!seen.has(cleanId)) {
                        seen.add(cleanId);
                        sanitized.push({ id: cleanId, name: folder.name });
                    }
                });
                new_folders = sanitized;
                localStorage.setItem("new_folders", JSON.stringify(new_folders));
            } catch (e) {
                new_folders = [];
            }

            new_folders.forEach(folder => {
                apps.push({
                    id: `new-folder-${folder.id}`,
                    title: folder.name,
                    icon: './themes/Yaru/system/folder.png',
                    disabled: true,
                    favourite: false,
                    desktop_shortcut: true,
                    screen: () => { },
                });
            });
            this.updateAppsData();
        }
    }

    setEventListeners = () => {
        document.getElementById("open-settings").addEventListener("click", () => {
            this.openApp("settings");
        });
    }

    setContextListeners = () => {
        document.addEventListener('contextmenu', this.checkContextMenu);
        document.addEventListener('click', this.hideAllContextMenu);
    }

    removeContextListeners = () => {
        document.removeEventListener("contextmenu", this.checkContextMenu);
        document.removeEventListener("click", this.hideAllContextMenu);
    }

    checkContextMenu = (e) => {
        e.preventDefault();
        this.hideAllContextMenu();
        switch (e.target.dataset.context) {
            case "desktop-area":
                ReactGA.event({ category: `Context Menu`, action: `Opened Desktop Context Menu` });
                this.showContextMenu(e, "desktop");
                break;
            default:
                ReactGA.event({ category: `Context Menu`, action: `Opened Default Context Menu` });
                this.showContextMenu(e, "default");
        }
    }

    showContextMenu = (e, menuName) => {
        let { posx, posy } = this.getMenuPosition(e);
        let contextMenu = document.getElementById(`${menuName}-menu`);
        if (posx + $(contextMenu).width() > window.innerWidth) posx -= $(contextMenu).width();
        if (posy + $(contextMenu).height() > window.innerHeight) posy -= $(contextMenu).height();
        posx = posx.toString() + "px";
        posy = posy.toString() + "px";
        contextMenu.style.left = posx;
        contextMenu.style.top = posy;
        this.setState({ context_menus: { ...this.state.context_menus, [menuName]: true } });
    }

    showAppContextMenu = (e, appId) => {
        e.preventDefault();
        e.stopPropagation();
        this.hideAllContextMenu();
        this.setState({ context_menu_target: appId }, () => {
            this.showContextMenu(e, "default");
        });
    }

    deleteApp = (appId) => {
        // Find the app to get its metadata
        let appData = apps.find(a => a.id === appId);
        if (!appData) return;

        // Add to Trash
        let trash_items = [];
        try {
            const stored = localStorage.getItem("trash_items");
            if (stored) trash_items = JSON.parse(stored);
        } catch (e) { }
        trash_items.push({ id: appData.id, name: appData.title, icon: appData.icon });
        localStorage.setItem("trash_items", JSON.stringify(trash_items));

        // Remove from desktop_apps
        let desktop_apps = this.state.desktop_apps.filter(id => id !== appId);
        this.setState({ desktop_apps });

        // If it was a custom folder, remove from new_folders
        if (appId.startsWith("new-folder-")) {
            try {
                let new_folders = JSON.parse(localStorage.getItem('new_folders')) || [];
                new_folders = new_folders.filter(f => f.id !== appId.replace('new-folder-', ''));
                localStorage.setItem("new_folders", JSON.stringify(new_folders));
            } catch (e) { }

            // Remove from the global apps array to prevent it from reappearing
            for (let i = apps.length - 1; i >= 0; i--) {
                if (apps[i].id === appId) {
                    apps.splice(i, 1);
                }
            }
        } else {
            try {
                let deleted_apps = JSON.parse(localStorage.getItem("deleted_default_apps")) || [];
                if (!deleted_apps.includes(appId)) deleted_apps.push(appId);
                localStorage.setItem("deleted_default_apps", JSON.stringify(deleted_apps));
            } catch (e) { }
        }

        // Close any context menus
        this.hideAllContextMenu();
        this.setState({ context_menu_target: null });

        // Notify trash app to re-render if it's open
        window.dispatchEvent(new Event('ubuntu-trash-changed'));
    }

    hideAllContextMenu = () => {
        let menus = this.state.context_menus;
        Object.keys(menus).forEach(key => { menus[key] = false; });
        this.setState({ context_menus: menus });
    }

    getMenuPosition = (e) => {
        var posx = 0;
        var posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) { posx = e.pageX; posy = e.pageY; }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { posx, posy }
    }

    fetchAppsData = () => {
        let focused_windows = {}, closed_windows = {}, disabled_apps = {}, favourite_apps = {}, overlapped_windows = {}, minimized_windows = {};
        let desktop_apps = [];
        let deleted_apps = [];
        try {
            const stored = localStorage.getItem("deleted_default_apps");
            if (stored) deleted_apps = JSON.parse(stored);
        } catch (e) { }

        apps.forEach((app) => {
            focused_windows = { ...focused_windows, [app.id]: false };
            closed_windows = { ...closed_windows, [app.id]: true };
            disabled_apps = { ...disabled_apps, [app.id]: app.disabled };
            favourite_apps = { ...favourite_apps, [app.id]: app.favourite };
            overlapped_windows = { ...overlapped_windows, [app.id]: false };
            minimized_windows = { ...minimized_windows, [app.id]: false }
            if (app.desktop_shortcut && !deleted_apps.includes(app.id)) desktop_apps.push(app.id);
        });
        this.setState({ focused_windows, closed_windows, disabled_apps, favourite_apps, overlapped_windows, minimized_windows, desktop_apps });
        this.initFavourite = { ...favourite_apps };
    }

    updateAppsData = () => {
        let focused_windows = {}, closed_windows = {}, favourite_apps = {}, minimized_windows = {}, disabled_apps = {};
        let desktop_apps = [];
        let deleted_apps = [];
        try {
            const stored = localStorage.getItem("deleted_default_apps");
            if (stored) deleted_apps = JSON.parse(stored);
        } catch (e) { }

        apps.forEach((app) => {
            focused_windows = { ...focused_windows, [app.id]: (this.state.focused_windows[app.id] ?? false) };
            minimized_windows = { ...minimized_windows, [app.id]: (this.state.minimized_windows[app.id] ?? false) };
            disabled_apps = { ...disabled_apps, [app.id]: app.disabled };
            closed_windows = { ...closed_windows, [app.id]: (this.state.closed_windows[app.id] ?? true) };
            favourite_apps = { ...favourite_apps, [app.id]: app.favourite }
            if (app.desktop_shortcut && !deleted_apps.includes(app.id)) desktop_apps.push(app.id);
        });
        this.setState({ focused_windows, closed_windows, disabled_apps, minimized_windows, favourite_apps, desktop_apps });
        this.initFavourite = { ...favourite_apps };
    }

    renderDesktopApps = () => {
        if (Object.keys(this.state.closed_windows).length === 0) return;
        let appsJsx = [];
        apps.forEach((app, index) => {
            if (this.state.desktop_apps.includes(app.id)) {
                const props = {
                    name: app.title,
                    id: app.id,
                    icon: app.icon,
                    openApp: this.openApp,
                    isExternalApp: app.isExternalApp,
                    url: app.url,
                    onContextMenu: this.showAppContextMenu,
                    isSelected: this.state.selected_apps[app.id] === true
                }
                appsJsx.push(<UbuntuApp key={index} {...props} />);
            }
        });
        return appsJsx;
    }

    renderWindows = () => {
        let windowsJsx = [];
        apps.forEach((app, index) => {
            if (this.state.closed_windows[app.id] === false) {
                const props = {
                    title: app.title, id: app.id, screen: app.screen, addFolder: this.addToDesktop,
                    closed: this.closeApp, openApp: this.openApp, focus: this.focus,
                    isFocused: this.state.focused_windows[app.id], hideSideBar: this.hideSideBar,
                    hasMinimised: this.hasMinimised, minimized: this.state.minimized_windows[app.id],
                    changeBackgroundImage: this.props.changeBackgroundImage, bg_image_name: this.props.bg_image_name,
                    dark_mode: this.props.dark_mode,
                    toggleDarkMode: this.props.toggleDarkMode,
                    zIndex: 10 + this.app_stack.indexOf(app.id),
                }
                windowsJsx.push(<Window key={index} {...props} />)
            }
        });
        return windowsJsx;
    }

    hideSideBar = (objId, hide) => {
        if (hide === this.state.hideSideBar) return;
        if (objId === null) {
            if (hide === false) { this.setState({ hideSideBar: false }); }
            else {
                for (const key in this.state.overlapped_windows) {
                    if (this.state.overlapped_windows[key]) { this.setState({ hideSideBar: true }); return; }
                }
            }
            return;
        }
        if (hide === false) {
            for (const key in this.state.overlapped_windows) {
                if (this.state.overlapped_windows[key] && key !== objId) return;
            }
        }
        let overlapped_windows = this.state.overlapped_windows;
        overlapped_windows[objId] = hide;
        this.setState({ hideSideBar: hide, overlapped_windows });
    }

    hasMinimised = (objId) => {
        let minimized_windows = this.state.minimized_windows;
        var focused_windows = this.state.focused_windows;
        minimized_windows[objId] = true;
        focused_windows[objId] = false;
        this.setState({ minimized_windows, focused_windows });
        this.hideSideBar(null, false);
        this.giveFocusToLastApp();
    }

    giveFocusToLastApp = () => {
        if (!this.checkAllMinimised()) {
            for (let i = this.app_stack.length - 1; i >= 0; i--) {
                const appId = this.app_stack[i];
                if (!this.state.minimized_windows[appId]) {
                    this.focus(appId);
                    break;
                }
            }
        }
    }

    handleMouseDown = (e) => {
        // Only start selection if clicking directly on the desktop background (data-context="desktop-area")
        if (e.target.dataset.context !== "desktop-area") return;

        // Drag selection is left click (0)
        if (e.button !== 0) return;

        e.preventDefault();

        const rect = e.currentTarget.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        this.setState({
            selectionBox: {
                visible: true,
                startX,
                startY,
                x: startX,
                y: startY,
                width: 0,
                height: 0
            },
            selected_apps: {} // clear previous selections on new click
        });

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseMove = (e) => {
        const { selectionBox } = this.state;
        if (!selectionBox || !selectionBox.visible) return;

        const desktop = document.querySelector('[data-context="desktop-area"]');
        if (!desktop) return;
        const rect = desktop.getBoundingClientRect();

        const currentX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const currentY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

        const x = Math.min(selectionBox.startX, currentX);
        const y = Math.min(selectionBox.startY, currentY);
        const width = Math.abs(currentX - selectionBox.startX);
        const height = Math.abs(currentY - selectionBox.startY);

        this.setState({
            selectionBox: {
                ...selectionBox,
                x,
                y,
                width,
                height
            }
        });

        this.checkSelectionCollision(x, y, width, height);
    }

    handleMouseUp = (e) => {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);

        this.setState({
            selectionBox: {
                visible: false,
                startX: 0,
                startY: 0,
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        });
    }

    checkSelectionCollision = (selectX, selectY, selectWidth, selectHeight) => {
        const desktop = document.querySelector('[data-context="desktop-area"]');
        if (!desktop) return;
        const desktopRect = desktop.getBoundingClientRect();

        const selLeft = desktopRect.left + selectX;
        const selTop = desktopRect.top + selectY;
        const selRight = selLeft + selectWidth;
        const selBottom = selTop + selectHeight;

        let selected_apps = {};

        const appElements = document.querySelectorAll('[id^="app-"]');
        appElements.forEach(appElement => {
            if (appElement.closest('.animateFadeIn') || appElement.closest('.animateFadeOut')) return;

            const appRect = appElement.getBoundingClientRect();
            const isOverlapping = !(
                appRect.right < selLeft ||
                appRect.left > selRight ||
                appRect.bottom < selTop ||
                appRect.top > selBottom
            );

            if (isOverlapping) {
                const appId = appElement.id.replace('app-', '');
                selected_apps[appId] = true;
            }
        });

        this.setState({ selected_apps });
    }

    checkAllMinimised = () => {
        let result = true;
        for (const key in this.state.minimized_windows) {
            if (!this.state.closed_windows[key]) { result = result & this.state.minimized_windows[key]; }
        }
        return result;
    }

    openApp = (objId) => {
        ReactGA.event({ category: `Open App`, action: `Opened ${objId} window` });
        if (this.state.disabled_apps[objId]) return;
        if (this.state.minimized_windows[objId]) {
            this.focus(objId);
            var r = document.querySelector("#" + objId);
            r.style.transform = `translate(${r.style.getPropertyValue("--window-transform-x")},${r.style.getPropertyValue("--window-transform-y")}) scale(1)`;
            let minimized_windows = this.state.minimized_windows;
            minimized_windows[objId] = false;
            this.setState({ minimized_windows: minimized_windows });
            return;
        }
        if (this.app_stack.includes(objId)) this.focus(objId);
        else {
            let closed_windows = { ...this.state.closed_windows };
            let favourite_apps = { ...this.state.favourite_apps };
            var frequentApps = localStorage.getItem('frequentApps') ? JSON.parse(localStorage.getItem('frequentApps')) : [];
            var currentApp = frequentApps.find(app => app.id === objId);
            if (currentApp) {
                frequentApps.forEach((app) => { if (app.id === currentApp.id) { app.frequency += 1; } });
            } else {
                frequentApps.push({ id: objId, frequency: 1 });
            }
            frequentApps.sort((a, b) => { if (a.frequency < b.frequency) return 1; if (a.frequency > b.frequency) return -1; return 0; });
            localStorage.setItem("frequentApps", JSON.stringify(frequentApps));
            setTimeout(() => {
                closed_windows[objId] = false;
                this.setState({ closed_windows, allAppsView: false }, this.focus(objId));
                this.app_stack.push(objId);
            }, 200);
        }
    }

    closeApp = (objId) => {
        this.app_stack.splice(this.app_stack.indexOf(objId), 1);
        this.giveFocusToLastApp();
        this.hideSideBar(null, false);
        let closed_windows = { ...this.state.closed_windows };
        closed_windows[objId] = true;
        this.setState({ closed_windows });
    }

    focus = (objId) => {
        var focused_windows = { ...this.state.focused_windows };
        focused_windows[objId] = true;
        for (let key in focused_windows) {
            if (focused_windows.hasOwnProperty(key)) { if (key !== objId) { focused_windows[key] = false; } }
        }

        // Move focused app to top of stack
        let stackIndex = this.app_stack.indexOf(objId);
        if (stackIndex !== -1) {
            this.app_stack.splice(stackIndex, 1);
            this.app_stack.push(objId);
        }

        this.setState({ focused_windows });
    }

    addNewFolder = () => { this.setState({ showNameBar: true }); }

    addToDesktop = (folder_name) => {
        folder_name = folder_name.trim();
        let folder_id = folder_name.replace(/\s+/g, '-').toLowerCase();
        apps.push({ id: `new-folder-${folder_id}`, title: folder_name, icon: './themes/Yaru/system/folder.png', disabled: true, favourite: false, desktop_shortcut: true, screen: () => { } });
        var new_folders = JSON.parse(localStorage.getItem('new_folders'));
        new_folders.push({ id: folder_id, name: folder_name });
        localStorage.setItem("new_folders", JSON.stringify(new_folders));
        this.setState({ showNameBar: false }, this.updateAppsData);
    }

    showAllApps = () => { this.setState({ allAppsView: !this.state.allAppsView }) }

    renderNameBar = () => {
        let addFolder = () => {
            let folder_name = document.getElementById("folder-name-input").value;
            if (folder_name.trim() !== '') {
                this.addToDesktop(folder_name);
            }
        }
        let removeCard = () => { this.setState({ showNameBar: false }); }

        const isDark = this.props.dark_mode;

        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={removeCard}>
                <div
                    className={`w-80 flex flex-col rounded-2xl overflow-hidden shadow-2xl border ${isDark ? 'bg-[#2a2a2a] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-6 pt-6 pb-4">
                        <span className="text-sm font-bold tracking-wide">New Folder</span>
                        <input
                            className={`w-full mt-4 px-3 py-2 text-sm outline-none rounded-lg border-2 transition-colors ${isDark ? 'bg-white/5 border-transparent focus:border-[#e95420] text-white' : 'bg-black/5 border-transparent focus:border-[#e95420] text-gray-900'}`}
                            id="folder-name-input"
                            type="text"
                            placeholder="Folder Name"
                            autoComplete="off"
                            spellCheck="false"
                            autoFocus={true}
                            onKeyDown={(e) => { if (e.key === 'Enter') addFolder(); else if (e.key === 'Escape') removeCard(); }}
                        />
                    </div>
                    <div className={`flex border-t ${isDark ? 'border-white/10' : 'border-gray-200'} font-medium text-sm`}>
                        <button onClick={removeCard} className={`flex-1 py-3 transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-600'}`}>
                            Cancel
                        </button>
                        <div className={`w-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                        <button onClick={addFolder} className={`flex-1 py-3 transition-colors text-[#e95420] ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}>
                            Create
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    handleGlobalKeys = (e) => {
        if (e.key === 'Escape' && this.props.activities_overview) {
            this.props.toggleActivities();
        }
    };

    handleActivitiesSearch = (e) => {
        this.setState({ activitiesSearchQuery: e.target.value });
    };

    renderAppMockup = (appId) => {
        switch (appId) {
            case 'chrome':
                return (
                    <div className="w-full h-full bg-[#121212] flex flex-col text-white text-[8px] font-sans">
                        <div className="bg-[#2b2a2a] px-2 py-1 flex items-center space-x-1.5 border-b border-[#3c3b3b]">
                            <div className="flex space-x-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
                            </div>
                            <div className="bg-[#1c1a1a] rounded px-3 py-0.5 text-[6px] text-gray-300 w-32 truncate">google.com/search?q=praneeth+reddy</div>
                        </div>
                        <div className="flex-grow p-2 flex flex-col justify-start space-y-1">
                            <span className="text-[#8ab4f8] font-bold text-[9px]">Praneeth Reddy - Software Developer and DevOps Engineer</span>
                            <span className="text-gray-400 text-[6px] leading-tight">Highly skilled engineering portfolio specializing in high-performance Go backends, distributed systems, and container orchestration...</span>
                            <div className="flex space-x-2 mt-1">
                                <span className="border border-gray-700 px-1 py-0.5 rounded text-[5px]">GitHub</span>
                                <span className="border border-gray-700 px-1 py-0.5 rounded text-[5px]">LinkedIn</span>
                            </div>
                        </div>
                    </div>
                );
            case 'terminal':
                return (
                    <div className="w-full h-full bg-[#300a24] text-[#4af626] font-mono text-[7px] p-2 leading-normal">
                        <div>praneeth@ubuntu:~$ neofetch</div>
                        <div className="flex space-x-2 mt-1 text-ub-orange">
                            <div className="font-bold whitespace-pre">
                                {`  /\\_/\\  \n ( o.o ) \n  > ^ < `}
                            </div>
                            <div className="text-[6px] text-white leading-normal">
                                <span className="text-orange-500 font-bold">OS:</span> Ubuntu 24.04 LTS<br />
                                <span className="text-orange-500 font-bold">Host:</span> Portfolio WebApp<br />
                                <span className="text-orange-500 font-bold">Kernel:</span> React-Engine-v2<br />
                                <span className="text-orange-500 font-bold">Shell:</span> bash 5.2.21
                            </div>
                        </div>
                    </div>
                );
            case 'vscode':
                return (
                    <div className="w-full h-full bg-[#1e1e1e] flex text-gray-400 text-[6px] font-mono">
                        <div className="w-8 bg-[#252526] border-r border-[#3c3c3c] p-1 flex flex-col space-y-1">
                            <span className="text-white text-[7px]">EXPLORER</span>
                            <span className="text-gray-300">src/</span>
                            <span className="text-orange-500 pl-1">✓ main.go</span>
                            <span className="pl-1">✓ api.go</span>
                        </div>
                        <div className="flex-grow p-2 flex flex-col space-y-0.5 overflow-hidden text-gray-300">
                            <span className="text-[#6a9955]">// High-performance HTTP server</span>
                            <span><span className="text-[#569cd6]">package</span> main</span>
                            <span><span className="text-[#569cd6]">import</span> <span className="text-[#ce9178]">"fmt"</span></span>
                            <span><span className="text-[#569cd6]">func</span> <span className="text-[#dcdcaa]">main</span>() &#123;</span>
                            <span className="pl-2">fmt.<span className="text-[#dcdcaa]">Println</span>(<span className="text-[#ce9178]">"Starting backend..."</span>)</span>
                            <span>&#125;</span>
                        </div>
                    </div>
                );
            case 'doom':
                return (
                    <div className="w-full h-full bg-black flex flex-col justify-between p-2 text-white font-mono text-[7px]">
                        <div className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            <span className="font-bold text-[9px] text-red-500">DOOM</span>
                        </div>
                        <div className="text-gray-400 leading-tight">
                            Shareware DOS version. Click to start retro demon slaying.
                        </div>
                    </div>
                );
            case 'game-2048':
                return (
                    <div className="w-full h-full bg-[#faf8ef] flex flex-col justify-between p-2 text-[#776e65] font-sans text-[7px]">
                        <div className="flex items-center space-x-1.5">
                            <span className="w-5 h-5 bg-[#EDC22E] rounded flex items-center justify-center text-white text-[9px] font-bold">20</span>
                            <span className="font-bold text-[9px]">2048 Game</span>
                        </div>
                        <div className="text-[#776e65]/80 leading-tight">
                            Classic sliding tile game. Get to the 2048 tile!
                        </div>
                    </div>
                );
            case 'calc':
                return (
                    <div className="w-full h-full bg-[#1e222b] text-white flex flex-col text-[8px]">
                        <div className="flex-grow bg-[#21252b] p-2 text-right flex items-end justify-end text-[14px] font-bold text-orange-400">
                            92
                        </div>
                        <div className="grid grid-cols-4 gap-0.5 p-1 bg-[#1e222b]">
                            <span className="bg-gray-700 text-center py-1 rounded-sm">C</span>
                            <span className="bg-gray-700 text-center py-1 rounded-sm">(</span>
                            <span className="bg-gray-700 text-center py-1 rounded-sm">)</span>
                            <span className="bg-orange-500 text-center py-1 rounded-sm">÷</span>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="w-full h-full bg-[#201f1f] flex text-gray-300 text-[6px]">
                        <div className="w-12 bg-[#2d2d2d] border-r border-[#3c3c3c] p-1.5 flex flex-col space-y-1">
                            <span className="font-bold text-white mb-1">Settings</span>
                            <span className="bg-orange-500 text-white rounded px-1 py-0.5">Appearance</span>
                            <span>Wi-Fi</span>
                            <span>Bluetooth</span>
                            <span>System</span>
                        </div>
                        <div className="flex-grow p-2 flex flex-col justify-center items-center">
                            <div className="w-6 h-6 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-[8px] font-bold text-white mt-1">Yaru Theme</span>
                            <span className="text-[5px] text-gray-400">Orange Accent</span>
                        </div>
                    </div>
                );
            case 'gedit':
                return (
                    <div className="w-full h-full bg-white text-gray-800 p-2 text-[6px] font-sans flex flex-col justify-between">
                        <div>
                            <div className="font-bold border-b border-gray-200 pb-0.5 text-gray-500 text-[5px]">contact_message.txt</div>
                            <div className="mt-1">To: Praneeth Reddy</div>
                            <div className="text-gray-600">Subject: Excellent Portfolio! Let's connect and build something awesome together!</div>
                        </div>
                        <div className="text-right text-[5px] text-gray-400">Line 3, Col 45</div>
                    </div>
                );
            default:
                return (
                    <div className="w-full h-full bg-gradient-to-br from-[#2c3e50] to-[#3498db] flex flex-col justify-center items-center text-white p-2 text-[8px] text-center">
                        <span className="font-bold leading-tight truncate w-full">{apps.find(a => a.id === appId)?.title || 'Ubuntu App'}</span>
                        <span className="text-[5px] opacity-75 mt-1">Active Window</span>
                    </div>
                );
        }
    };

    renderWindowCard = (app) => {
        return (
            <div key={app.id} className="relative group">
                <div
                    onClick={() => {
                        this.openApp(app.id);
                        this.props.toggleActivities();
                    }}
                    className="relative w-64 h-44 rounded-2xl border border-white/10 bg-[#1e1e1e] overflow-hidden flex flex-col shadow-2xl window-card-hover transition-all cursor-pointer"
                >
                    {/* Mini Yaru Title Bar */}
                    <div className="bg-[#201f1f] px-3.5 py-1.5 flex items-center justify-between text-[10px] text-gray-300 font-semibold select-none border-b border-white/5">
                        <span className="truncate pr-4">{app.title}</span>
                        <div className="flex space-x-1.5 flex-shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]/70" />
                        </div>
                    </div>
                    {/* Live Mock Content Area */}
                    <div className="flex-grow overflow-hidden relative select-none">
                        {this.renderAppMockup(app.id)}
                    </div>
                </div>
                {/* Floating App Icon at the bottom center (outside overflow-hidden so it is never clipped) */}
                <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#2b2b2b] rounded-xl flex items-center justify-center shadow-2xl border border-white/10 group-hover:scale-110 group-hover:-translate-y-1 transition-all z-20 pointer-events-none">
                    <img src={app.icon} className="w-7 h-7 object-contain" alt={app.title} />
                </div>
            </div>
        );
    };

    renderActivitiesOverview = () => {
        const activeApps = apps.filter(app => this.state.closed_windows[app.id] === false);
        const searchQuery = (this.state.activitiesSearchQuery || '').toLowerCase().trim();

        const filteredActiveApps = searchQuery
            ? activeApps.filter(app => app.title.toLowerCase().includes(searchQuery))
            : activeApps;

        const filteredSystemApps = searchQuery
            ? apps.filter(app => {
                const isOpen = this.state.closed_windows[app.id] === false;
                const matches = app.title.toLowerCase().includes(searchQuery);
                return !isOpen && matches;
            })
            : [];

        return (
            <div
                className={`fixed inset-0 top-8 bg-[#141414] bg-opacity-95 flex flex-col justify-between items-center py-6 select-none z-[45] transition-all duration-300 ${this.props.activities_overview ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={this.props.toggleActivities}
            >
                {/* Search Bar at the Top */}
                <div className="w-full flex justify-center px-4" onClick={(e) => e.stopPropagation()}>
                    <div className="w-[420px] flex items-center bg-[#252525]/90 border border-white/10 px-4 py-2.5 rounded-2xl text-gray-300 search-bar-focus transition-all shadow-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Type to search..."
                            value={this.state.activitiesSearchQuery}
                            onChange={this.handleActivitiesSearch}
                            className="bg-transparent outline-none w-full text-sm placeholder-gray-500 text-white font-sans"
                            autoFocus
                        />
                        {this.state.activitiesSearchQuery && (
                            <button
                                onClick={() => this.setState({ activitiesSearchQuery: "" })}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Workspace Carousel (Center) */}
                <div
                    className="w-[78%] h-[60%] rounded-3xl relative shadow-3xl border border-white/5 overflow-hidden transition-all duration-300 bg-black/40 flex items-center justify-center p-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* The scaled down background wallpaper inside the workspace card */}
                    <div className="absolute inset-0 z-0 opacity-85">
                        <BackgroundImage img={this.props.bg_image_name} />
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                    </div>

                    {/* Window previews or Search results */}
                    <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
                        {searchQuery && (filteredActiveApps.length > 0 || filteredSystemApps.length > 0) ? (
                            <div className="w-full flex flex-col justify-start space-y-6 max-h-full overflow-y-auto no-scrollbar px-4 py-2">
                                {filteredActiveApps.length > 0 && (
                                    <div>
                                        <h3 className="text-[10px] uppercase tracking-wider text-gray-450 font-bold mb-3 pl-2">Open Windows</h3>
                                        <div className="flex flex-wrap gap-6 items-center">
                                            {filteredActiveApps.map(app => this.renderWindowCard(app))}
                                        </div>
                                    </div>
                                )}
                                {filteredSystemApps.length > 0 && (
                                    <div>
                                        <h3 className="text-[10px] uppercase tracking-wider text-gray-450 font-bold mb-3 pl-2">Application Results</h3>
                                        <div className="flex flex-wrap gap-4 items-center">
                                            {filteredSystemApps.map(app => (
                                                <div
                                                    key={app.id}
                                                    onClick={() => {
                                                        this.openApp(app.id);
                                                        this.setState({ activitiesSearchQuery: "" });
                                                        this.props.toggleActivities();
                                                    }}
                                                    className="flex items-center space-x-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 px-4 py-2.5 rounded-2xl cursor-pointer transition-all active:scale-95"
                                                >
                                                    <img src={app.icon} className="w-8 h-8 object-contain" alt={app.title} />
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-xs font-bold text-white leading-tight">{app.title}</span>
                                                        <span className="text-[9px] text-gray-400">Launch App</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : activeApps.length > 0 ? (
                            <div className="w-full h-full overflow-y-auto flex flex-wrap gap-8 p-8 justify-center content-start no-scrollbar">
                                {activeApps.map(app => this.renderWindowCard(app))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center space-y-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-14 h-14 text-gray-405 opacity-60">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                                </svg>
                                <span className="text-gray-300 font-medium text-sm">No Open Windows</span>
                                <span className="text-gray-500 text-xs">Search above or click an app below to launch</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Horizontal Dock at the Bottom */}
                <div
                    className="bg-[#1e1e1e]/60 backdrop-blur-md px-4 py-2 border border-white/5 shadow-2xl rounded-2xl flex items-center justify-center space-x-3.5 z-20"
                    onClick={(e) => e.stopPropagation()}
                >
                    {apps.filter(app => this.state.favourite_apps[app.id] !== false).map((app) => {
                        const isOpen = this.state.closed_windows[app.id] === false;
                        return (
                            <div
                                onClick={() => {
                                    this.openApp(app.id);
                                    this.props.toggleActivities();
                                }}
                                key={app.id}
                                className="relative w-12 h-12 flex flex-col items-center justify-center rounded-xl bg-white/5 hover:bg-[#2c2c2c]/50 hover:bg-opacity-40 hover:scale-115 active:scale-95 cursor-pointer transition-all group"
                            >
                                <img src={app.icon} className="w-9 h-9 object-contain" alt={app.title} />
                                {isOpen && (
                                    <span
                                        className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full shadow-lg"
                                        style={{ backgroundColor: 'var(--ubuntu-accent-color, #e95420)' }}
                                    />
                                )}
                                {/* GNOME-Style Pinned App Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-[#111111]/95 text-[11px] text-white px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none border border-white/5 shadow-xl z-30">
                                    {app.title}
                                </div>
                            </div>
                        );
                    })}

                    {/* Vertical Separator */}
                    <div className="w-[1px] h-6 bg-white/10 self-center mx-1" />

                    {/* Show Applications Button */}
                    <div
                        onClick={() => {
                            this.showAllApps();
                            this.props.toggleActivities();
                        }}
                        className="relative w-12 h-12 flex flex-col items-center justify-center rounded-xl bg-white/5 hover:bg-[#2c2c2c]/50 hover:bg-opacity-40 hover:scale-115 active:scale-95 cursor-pointer transition-all group"
                    >
                        <img width="28px" height="28px" className="w-8 h-8 object-contain" src="./themes/Yaru/system/view-app-grid-symbolic.svg" alt="Show Applications" />
                        {/* GNOME-Style "Show Apps" Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-[#111111]/95 text-[11px] text-white px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap pointer-events-none border border-white/5 shadow-xl z-30">
                            Show Apps
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className={" h-full w-full flex flex-col items-end justify-start content-start flex-wrap-reverse pt-8 bg-transparent relative overflow-hidden overscroll-none window-parent"}>
                {/* Window Area */}
                <div className="absolute h-full w-full bg-transparent" data-context="desktop-area" onMouseDown={this.handleMouseDown}>
                    {this.renderWindows()}

                    {/* Drag Selection Marquee */}
                    {this.state.selectionBox && this.state.selectionBox.visible && (
                        <div
                            className="absolute border border-[#e95420] bg-[#e95420]/15 pointer-events-none z-50 rounded"
                            style={{
                                left: this.state.selectionBox.x,
                                top: this.state.selectionBox.y,
                                width: this.state.selectionBox.width,
                                height: this.state.selectionBox.height
                            }}
                        />
                    )}
                </div>
                {/* Background Image */}
                <BackgroundImage img={this.props.bg_image_name} />
                {/* Ubuntu Side Menu Bar */}
                <SideBar apps={apps}
                    hide={this.state.hideSideBar || this.props.activities_overview || this.state.allAppsView}
                    hideSideBar={this.hideSideBar}
                    favourite_apps={this.state.favourite_apps}
                    showAllApps={this.showAllApps}
                    allAppsView={this.state.allAppsView}
                    closed_windows={this.state.closed_windows}
                    focused_windows={this.state.focused_windows}
                    isMinimized={this.state.minimized_windows}
                    openAppByAppId={this.openApp} />
                {/* Desktop Apps */}
                {!this.state.allAppsView && this.renderDesktopApps()}
                {/* Context Menus */}
                <DesktopMenu active={this.state.context_menus.desktop} openApp={this.openApp} addNewFolder={this.addNewFolder} isDark={this.props.dark_mode} />
                <DefaultMenu active={this.state.context_menus.default} isDark={this.props.dark_mode} targetId={this.state.context_menu_target} deleteApp={this.deleteApp} openApp={this.openApp} />
                {/* Folder Input Name Bar */}
                {(this.state.showNameBar ? this.renderNameBar() : null)}
                {this.state.allAppsView ?
                    <AllApplications apps={apps} recentApps={this.app_stack} openApp={this.openApp} showAllApps={this.showAllApps} bg_image_name={this.props.bg_image_name} /> : null}

                {/* Activities Overview Overlay */}
                {this.renderActivitiesOverview()}
            </div>
        )
    }
}

export default Desktop
