import React, { Component } from 'react';
import GoogleSearchResult from './GoogleSearchResult';
import WikipediaProfile from './WikipediaProfile';

export class Chrome extends Component {
    constructor() {
        super();
        this.home_url = 'https://www.google.com/webhp?igu=1';
        this.state = {
            tabs: [
                {
                    id: "1",
                    url: '/chrome/result.html',
                    display_url: 'https://www.google.com/search?q=Praneeth+Reddy',
                    title: 'Praneeth Reddy - Google Search',
                    historyStack: ['/chrome/result.html'],
                    historyPointer: 0
                }
            ],
            activeTabId: "1",
            display_url: 'https://www.google.com/search?q=Praneeth+Reddy',
            showTabOverview: false,
            urlEditing: false
        }
    }

    componentDidMount() {
        window.addEventListener('message', this.handleMessage);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleMessage);
    }

    handleMessage = (e) => {
        if (e.data && e.data.type === 'chrome-search') {
            const query = e.data.query.trim();
            if (query.length > 0) {
                const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1`;
                const display_url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                this.loadTabUrl(this.state.activeTabId, url, display_url);
            }
        }
    }

    handleIframeLoad = (tabId, e) => {
        const iframe = e.target;
        const isFirstLoad = !iframe._hasLoadedBefore;
        iframe._hasLoadedBefore = true;

        try {
            const contentWindow = iframe.contentWindow;
            if (!contentWindow) return;

            const pathname = contentWindow.location.pathname;
            const search = contentWindow.location.search;
            const hash = contentWindow.location.hash;
            const relativeUrl = pathname + search + hash;

            const tab = this.state.tabs.find(t => t.id.toString() === tabId.toString());
            if (!tab) return;

            if (tab.url !== relativeUrl) {
                let display_url = relativeUrl;
                let title = 'Google Search';

                if (relativeUrl.includes('homepage.html')) {
                    display_url = 'https://en.wikipedia.org/wiki/P_Praneeth_Reddy';
                    title = 'Praneeth Reddy - Wikipedia';
                } else if (relativeUrl.includes('result.html')) {
                    display_url = 'https://www.google.com/search?q=Praneeth+Reddy';
                    title = 'Praneeth Reddy - Google Search';
                } else if (relativeUrl.includes('index.html')) {
                    display_url = 'https://www.google.com';
                    title = 'Google';
                }

                this.syncTabUrl(tabId, relativeUrl, display_url, title);
            }
        } catch (error) {
            if (iframe._isProgrammaticLoad) {
                iframe._isProgrammaticLoad = false;
            }
        }
    }

    syncTabUrl = (tabId, url, display_url, title) => {
        const newTabs = this.state.tabs.map(t => {
            if (t.id.toString() === tabId.toString()) {
                let stack = t.historyStack ? [...t.historyStack] : [t.url];
                let pointer = t.historyPointer !== undefined ? t.historyPointer : 0;

                if (stack[pointer] !== url) {
                    stack = stack.slice(0, pointer + 1);
                    stack.push(url);
                    pointer = stack.length - 1;
                }
                return {
                    ...t,
                    url,
                    display_url,
                    title,
                    historyStack: stack,
                    historyPointer: pointer
                };
            }
            return t;
        });

        this.setState({
            tabs: newTabs,
            display_url: tabId.toString() === this.state.activeTabId.toString() ? display_url : this.state.display_url
        });
    }

    addTab = () => {
        const newId = Date.now().toString();
        const newTab = {
            id: newId,
            url: 'https://www.google.com/webhp?igu=1',
            display_url: 'https://www.google.com',
            title: 'Google',
            historyStack: ['https://www.google.com/webhp?igu=1'],
            historyPointer: 0
        };
        this.setState({
            tabs: [...this.state.tabs, newTab],
            activeTabId: newId,
            display_url: 'https://www.google.com'
        });
    }

    closeTab = (id, e) => {
        e.stopPropagation();
        const { tabs, activeTabId } = this.state;
        if (tabs.length === 1) {
            const closeBtn = document.getElementById("close-chrome");
            if (closeBtn) closeBtn.click();
            return;
        }

        const newTabs = tabs.filter(t => t.id.toString() !== id.toString());
        let newActiveId = activeTabId;
        if (activeTabId.toString() === id.toString()) {
            const index = tabs.findIndex(t => t.id.toString() === id.toString());
            const nextActiveTab = tabs[index - 1] || tabs[index + 1];
            newActiveId = nextActiveTab.id.toString();
        }

        const nextActiveTabObj = newTabs.find(t => t.id.toString() === newActiveId) || newTabs[0];

        this.setState({
            tabs: newTabs,
            activeTabId: newActiveId,
            display_url: nextActiveTabObj ? nextActiveTabObj.display_url : 'https://www.google.com'
        });
    }

    switchTab = (id) => {
        const tab = this.state.tabs.find(t => t.id.toString() === id.toString());
        this.setState({
            activeTabId: id.toString(),
            display_url: tab ? tab.display_url : 'https://www.google.com'
        });
    }

    loadTabUrl = (tabId, url, display_url = url, forceTitle = null) => {
        const iframe = document.getElementById(`chrome-screen-${tabId}`);
        if (iframe) {
            iframe._isProgrammaticLoad = true;
        }

        let title = 'New Tab';
        if (url.includes('google.com/search')) {
            try {
                const u = new URL(url);
                const q = u.searchParams.get('q') || 'Google Search';
                title = `${decodeURIComponent(q)} - Google Search`;
            } catch (e) {
                title = 'Google Search';
            }
        } else if (url.includes('google.com')) {
            title = 'Google';
        } else if (url.includes('/chrome/result.html')) {
            title = 'Praneeth Reddy - Google Search';
        } else if (url.includes('/chrome/homepage.html')) {
            title = 'Praneeth Reddy - Wikipedia';
        } else {
            try {
                title = new URL(url).hostname;
            } catch (e) {
                title = url;
            }
        }

        const newTabs = this.state.tabs.map(t => {
            if (t.id.toString() === tabId.toString()) {
                let stack = t.historyStack ? [...t.historyStack] : [t.url];
                let pointer = t.historyPointer !== undefined ? t.historyPointer : 0;
                if (stack[pointer] !== url) {
                    stack = stack.slice(0, pointer + 1);
                    stack.push(url);
                    pointer = stack.length - 1;
                }
                return {
                    ...t,
                    url,
                    display_url,
                    title: forceTitle || title,
                    historyStack: stack,
                    historyPointer: pointer
                };
            }
            return t;
        });

        this.setState({
            tabs: newTabs,
            display_url: tabId.toString() === this.state.activeTabId.toString() ? display_url : this.state.display_url
        });
    }

    updateActiveTab = (url, display_url) => {
        this.loadTabUrl(this.state.activeTabId, url, display_url);
    }

    refreshChrome = () => {
        const { activeTabId } = this.state;
        const iframe = document.getElementById(`chrome-screen-${activeTabId}`);
        if (iframe) {
            try {
                iframe.contentWindow.location.reload(true);
            } catch (e) {
                const src = iframe.src;
                iframe.src = src;
            }
        }
    }

    goBack = () => {
        const { tabs, activeTabId } = this.state;
        const activeTab = tabs.find(t => t.id.toString() === activeTabId.toString());
        if (activeTab && activeTab.historyPointer > 0) {
            const newPointer = activeTab.historyPointer - 1;
            const prevUrl = activeTab.historyStack[newPointer];

            const iframe = document.getElementById(`chrome-screen-${activeTabId}`);
            if (iframe) {
                iframe._isProgrammaticLoad = true;
            }

            let prevDisplayUrl = prevUrl;
            let title = '';
            if (prevUrl.includes("google.com/search")) {
                try {
                    const u = new URL(prevUrl);
                    const q = u.searchParams.get("q");
                    prevDisplayUrl = q ? `https://www.google.com/search?q=${q}` : "https://www.google.com";
                    title = q ? `${decodeURIComponent(q)} - Google Search` : 'Google Search';
                } catch (e) {
                    title = 'Google Search';
                }
            } else if (prevUrl.includes("google.com/webhp") || prevUrl.includes("google.com")) {
                prevDisplayUrl = "https://www.google.com";
                title = "Google";
            } else if (prevUrl.includes("/chrome/result.html")) {
                prevDisplayUrl = "https://www.google.com/search?q=Praneeth+Reddy";
                title = "Praneeth Reddy - Google Search";
            } else if (prevUrl.includes("/chrome/homepage.html")) {
                prevDisplayUrl = "https://en.wikipedia.org/wiki/P_Praneeth_Reddy";
                title = "Praneeth Reddy - Wikipedia";
            } else {
                try {
                    title = new URL(prevUrl).hostname;
                } catch (e) {
                    title = prevUrl;
                }
            }

            const newTabs = tabs.map(t => {
                if (t.id.toString() === activeTabId.toString()) {
                    return { ...t, historyPointer: newPointer, url: prevUrl, display_url: prevDisplayUrl, title };
                }
                return t;
            });
            this.setState({
                tabs: newTabs,
                display_url: activeTabId.toString() === this.state.activeTabId.toString() ? prevDisplayUrl : this.state.display_url
            });
        }
    }

    goForward = () => {
        const { tabs, activeTabId } = this.state;
        const activeTab = tabs.find(t => t.id.toString() === activeTabId.toString());
        if (activeTab && activeTab.historyStack && activeTab.historyPointer < activeTab.historyStack.length - 1) {
            const newPointer = activeTab.historyPointer + 1;
            const nextUrl = activeTab.historyStack[newPointer];

            const iframe = document.getElementById(`chrome-screen-${activeTabId}`);
            if (iframe) {
                iframe._isProgrammaticLoad = true;
            }

            let nextDisplayUrl = nextUrl;
            let title = '';
            if (nextUrl.includes("google.com/search")) {
                try {
                    const u = new URL(nextUrl);
                    const q = u.searchParams.get("q");
                    nextDisplayUrl = q ? `https://www.google.com/search?q=${q}` : "https://www.google.com";
                    title = q ? `${decodeURIComponent(q)} - Google Search` : 'Google Search';
                } catch (e) {
                    title = 'Google Search';
                }
            } else if (nextUrl.includes("google.com/webhp") || nextUrl.includes("google.com")) {
                nextDisplayUrl = "https://www.google.com";
                title = "Google";
            } else if (nextUrl.includes("/chrome/result.html")) {
                nextDisplayUrl = "https://www.google.com/search?q=Praneeth+Reddy";
                title = "Praneeth Reddy - Google Search";
            } else if (nextUrl.includes("/chrome/homepage.html")) {
                nextDisplayUrl = "https://en.wikipedia.org/wiki/P_Praneeth_Reddy";
                title = "Praneeth Reddy - Wikipedia";
            } else {
                try {
                    title = new URL(nextUrl).hostname;
                } catch (e) {
                    title = nextUrl;
                }
            }

            const newTabs = tabs.map(t => {
                if (t.id.toString() === activeTabId.toString()) {
                    return { ...t, historyPointer: newPointer, url: nextUrl, display_url: nextDisplayUrl, title };
                }
                return t;
            });
            this.setState({
                tabs: newTabs,
                display_url: activeTabId.toString() === this.state.activeTabId.toString() ? nextDisplayUrl : this.state.display_url
            });
        }
    }

    goToHome = () => {
        const { activeTabId } = this.state;
        const iframe = document.getElementById(`chrome-screen-${activeTabId}`);
        if (iframe) {
            iframe._isProgrammaticLoad = true;
        }
        this.loadTabUrl(activeTabId, 'https://www.google.com/webhp?igu=1', 'https://www.google.com');
    }

    checkKey = (e) => {
        if (e.key === "Enter") {
            let query = this.state.display_url.trim();
            if (query.length === 0) return;

            let url = "";
            let display_url = "";

            const hasSpace = query.includes(" ");
            const hasDot = query.includes(".");
            const isUrl = !hasSpace && (hasDot || query.startsWith("localhost") || query.startsWith("http://") || query.startsWith("https://"));

            if (isUrl) {
                url = query;
                if (!url.startsWith("http://") && !url.startsWith("https://")) {
                    url = "https://" + url;
                }
                display_url = url;

                if (url.includes("google.com")) {
                    try {
                        const parsedUrl = new URL(url);
                        const q = parsedUrl.searchParams.get("q");
                        if (q) {
                            url = `https://www.google.com/search?q=${encodeURIComponent(q)}&igu=1`;
                            display_url = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
                        } else {
                            url = "https://www.google.com/webhp?igu=1";
                            display_url = "https://www.google.com";
                        }
                    } catch (e) {
                        url = "https://www.google.com/webhp?igu=1";
                        display_url = "https://www.google.com";
                    }
                }
            } else {
                url = `https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1`;
                display_url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }

            this.loadTabUrl(this.state.activeTabId, url, display_url);
            this.setState({ urlEditing: false });
            const bar = document.getElementById("chrome-url-bar");
            if (bar) bar.blur();
        }
    }

    handleDisplayUrl = (e) => {
        this.setState({ display_url: e.target.value });
    }

    getPillLabel = () => {
        const raw = (this.state.display_url || '').trim();
        if (!raw) return 'Search or enter website name';
        try {
            const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
            if (u.hostname.includes('google.com') && u.searchParams.get('q')) {
                return decodeURIComponent(u.searchParams.get('q'));
            }
            return u.hostname.replace(/^www\./, '');
        } catch (e) {
            return raw;
        }
    }

    toggleTabOverview = () => {
        this.setState({ showTabOverview: !this.state.showTabOverview });
    }

    selectTabFromOverview = (id) => {
        this.switchTab(id);
        this.setState({ showTabOverview: false });
    }

    displayUrlBar = () => {
        const isDark = this.props.dark_mode;
        const pillLabel = this.getPillLabel();
        const isEditing = this.state.urlEditing;

        return (
            <div
                className="ios-font w-full px-3 pt-2 pb-2.5 flex items-center select-none z-20"
                style={{
                    backgroundColor: 'rgba(249,249,249,0.82)',
                    backdropFilter: 'saturate(180%) blur(20px)',
                    WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                    borderBottom: '0.5px solid rgba(0,0,0,0.12)'
                }}
            >
                <div
                    className="relative flex-grow h-9 rounded-full flex items-center px-3"
                    style={{ backgroundColor: '#e3e3e8' }}
                >
                    <span className="text-[#8e8e93] text-[13px] font-medium leading-none flex-shrink-0 select-none">
                        <span className="text-[11px]">A</span><span className="text-[15px]">A</span>
                    </span>

                    {isEditing ? (
                        <input
                            onKeyDown={this.checkKey}
                            onChange={this.handleDisplayUrl}
                            onBlur={() => this.setState({ urlEditing: false })}
                            value={this.state.display_url}
                            id="chrome-url-bar"
                            autoFocus
                            className="outline-none bg-transparent text-[15px] w-full text-center mx-2 text-[#1c1c1e] placeholder-[#8e8e93]"
                            type="url"
                            spellCheck={false}
                            autoComplete="off"
                            placeholder="Search or enter website"
                        />
                    ) : (
                        <button
                            onClick={() => this.setState({ urlEditing: true })}
                            className="flex-grow flex items-center justify-center gap-1 mx-2 min-w-0"
                        >
                            <svg viewBox="0 0 24 24" className="w-3 h-3 flex-shrink-0 fill-current text-[#3c3c43]">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                            </svg>
                            <span className="text-[15px] text-[#1c1c1e] truncate leading-none">{pillLabel}</span>
                        </button>
                    )}

                    <button
                        onClick={(e) => { e.stopPropagation(); this.refreshChrome(); }}
                        className="flex-shrink-0 text-[#3c3c43] flex items-center"
                        title="Reload"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    renderBottomToolbar = () => {
        const { tabs, activeTabId } = this.state;
        const activeTab = tabs.find(t => t.id.toString() === activeTabId.toString());
        const canGoBack = activeTab && activeTab.historyPointer > 0;
        const canGoForward = activeTab && activeTab.historyStack && activeTab.historyPointer < activeTab.historyStack.length - 1;
        const blue = '#007AFF';
        const grey = '#b0b0b5';

        return (
            <div
                className="ios-font w-full flex items-center justify-between px-7 pt-2.5 z-20"
                style={{
                    paddingBottom: '20px',
                    backgroundColor: 'rgba(249,249,249,0.82)',
                    backdropFilter: 'saturate(180%) blur(20px)',
                    WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                    borderTop: '0.5px solid rgba(0,0,0,0.12)'
                }}
            >
                <button
                    onClick={canGoBack ? this.goBack : undefined}
                    disabled={!canGoBack}
                    className="flex items-center justify-center"
                    style={{ color: canGoBack ? blue : grey }}
                    title="Back"
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 5l-7 7 7 7" />
                    </svg>
                </button>

                <button
                    onClick={canGoForward ? this.goForward : undefined}
                    disabled={!canGoForward}
                    className="flex items-center justify-center"
                    style={{ color: canGoForward ? blue : grey }}
                    title="Forward"
                >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <button className="flex items-center justify-center" style={{ color: blue }} title="Share">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 15V3" />
                        <path d="M8 7l4-4 4 4" />
                        <path d="M6 11H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1" />
                    </svg>
                </button>

                <button onClick={this.toggleTabOverview} className="relative flex items-center justify-center" style={{ color: blue }} title="Tabs">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <rect x="8" y="3" width="13" height="13" rx="2.5" />
                        <path d="M16 16v2.5A2.5 2.5 0 0 1 13.5 21h-8A2.5 2.5 0 0 1 3 18.5v-8A2.5 2.5 0 0 1 5.5 8H8" />
                    </svg>
                    <span
                        className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 flex items-center justify-center rounded-full text-white text-[9px] font-semibold leading-none"
                        style={{ backgroundColor: blue }}
                    >
                        {tabs.length}
                    </span>
                </button>

                <button className="flex items-center justify-center" style={{ color: blue }} title="Bookmarks">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                </button>
            </div>
        );
    }

    renderTabOverview = () => {
        const { tabs, activeTabId } = this.state;
        const isDark = this.props.dark_mode;

        const faviconFor = (tab) => {
            if (this.isWikipediaForPraneeth(tab.url)) return 'https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org';
            if (this.isGoogleSearchForPraneeth(tab.url)) return 'https://www.google.com/s2/favicons?sz=64&domain=google.com';
            if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
                try { return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(tab.url).hostname}`; } catch (e) { }
            }
            if (tab.url.includes('/chrome/')) return 'https://www.google.com/s2/favicons?sz=64&domain=google.com';
            return null;
        };

        return (
            <div
                className="ios-font absolute inset-0 z-40 flex flex-col"
                style={{ backgroundColor: isDark ? '#1c1c1e' : '#f2f2f7' }}
            >
                <div className="flex-grow overflow-y-auto no-scrollbar px-4 pt-4 pb-2">
                    <div className="grid grid-cols-2 gap-4">
                        {tabs.map((tab) => {
                            const isActive = tab.id.toString() === activeTabId.toString();
                            const fav = faviconFor(tab);
                            return (
                                <div
                                    key={tab.id}
                                    onClick={() => this.selectTabFromOverview(tab.id)}
                                    className="relative rounded-2xl overflow-hidden cursor-pointer flex flex-col bg-white shadow-md"
                                    style={{
                                        height: '180px',
                                        outline: isActive ? '2.5px solid #007AFF' : '0.5px solid rgba(0,0,0,0.08)'
                                    }}
                                >
                                    <div className="flex items-center gap-2 px-2.5 h-8 flex-shrink-0" style={{ backgroundColor: '#f2f2f7' }}>
                                        {fav ? (
                                            <img className="w-4 h-4 rounded-sm flex-shrink-0" src={fav} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                                        ) : null}
                                        <span className="text-[11px] text-[#1c1c1e] truncate flex-grow leading-none">{tab.title}</span>
                                        <button
                                            onClick={(e) => this.closeTab(tab.id, e)}
                                            className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#3c3c43" className="w-2 h-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex-grow flex flex-col items-center justify-center px-2 bg-white">
                                        {fav ? (
                                            <img className="w-9 h-9 rounded-lg mb-2" src={fav} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                                        ) : null}
                                        <span className="text-[10px] text-[#8e8e93] text-center truncate w-full">{tab.display_url}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    className="w-full flex items-center justify-between px-7 pt-3"
                    style={{ paddingBottom: '20px', borderTop: '0.5px solid rgba(0,0,0,0.12)' }}
                >
                    <button onClick={() => { this.addTab(); this.setState({ showTabOverview: false }); }} className="flex items-center justify-center" style={{ color: '#007AFF' }} title="New Tab">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                    <span className="text-[15px] text-[#1c1c1e]">{tabs.length} {tabs.length === 1 ? 'Tab' : 'Tabs'}</span>
                    <button onClick={this.toggleTabOverview} className="text-[17px] font-semibold" style={{ color: '#007AFF' }}>
                        Done
                    </button>
                </div>
            </div>
        );
    }

    isGoogleSearchForPraneeth = (url) => {
        if (!url) return false;
        const lowercaseUrl = url.toLowerCase();
        return lowercaseUrl.includes('result.html') || lowercaseUrl.includes('google.com/search');
    };

    isWikipediaForPraneeth = (url) => {
        if (!url) return false;
        const lowercaseUrl = url.toLowerCase();
        return lowercaseUrl.includes('homepage.html') ||
            (lowercaseUrl.includes('wikipedia.org/wiki/') &&
                (lowercaseUrl.includes('praneeth') || lowercaseUrl.includes('reddy')));
    };

    extractQuery = (url) => {
        try {
            const u = new URL(url, 'https://www.google.com');
            return u.searchParams.get('q') || 'Praneeth Reddy';
        } catch (e) {
            return 'Praneeth Reddy';
        }
    }

    render() {
        const isDark = this.props.dark_mode;
        return (
            <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} className={`ios-font relative h-full w-full flex flex-col overflow-hidden ${isDark ? 'bg-[#1c1c1e]' : 'bg-white'
                }`}>
                {this.displayUrlBar()}
                <div className="relative flex-grow overflow-hidden flex flex-col bg-white">
                {this.state.tabs.map((tab) => {
                    const isActive = tab.id.toString() === this.state.activeTabId.toString();

                    if (this.isGoogleSearchForPraneeth(tab.url)) {
                        return (
                            <div
                                key={tab.id}
                                className={`flex-grow overflow-hidden ${isActive ? 'flex flex-col' : 'hidden'}`}
                                id={`chrome-screen-${tab.id}`}
                            >
                                <GoogleSearchResult
                                    query={this.extractQuery(tab.url)}
                                    onSearch={(query) => {
                                        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1`;
                                        const display_url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                                        this.loadTabUrl(tab.id, url, display_url);
                                    }}
                                    onNavigate={(targetUrl, targetDisplay, targetTitle) => {
                                        this.loadTabUrl(tab.id, targetUrl, targetDisplay, targetTitle);
                                    }}
                                    darkMode={isDark}
                                />
                            </div>
                        );
                    }

                    if (this.isWikipediaForPraneeth(tab.url)) {
                        return (
                            <div
                                key={tab.id}
                                className={`flex-grow overflow-hidden ${isActive ? 'flex flex-col' : 'hidden'}`}
                                id={`chrome-screen-${tab.id}`}
                            >
                                <WikipediaProfile
                                    onNavigate={(targetUrl, targetDisplay, targetTitle) => {
                                        this.loadTabUrl(tab.id, targetUrl, targetDisplay, targetTitle);
                                    }}
                                    darkMode={isDark}
                                />
                            </div>
                        );
                    }

                    return (
                        <iframe
                            key={tab.id}
                            src={tab.url}
                            className={`flex-grow bg-white ${isActive ? 'block' : 'hidden'}`}
                            id={`chrome-screen-${tab.id}`}
                            frameBorder="0"
                            title={`Chrome Browser Tab ${tab.id}`}
                            onLoad={(e) => this.handleIframeLoad(tab.id, e)}
                        />
                    );
                })}
                </div>
                {this.renderBottomToolbar()}
                {this.state.showTabOverview && this.renderTabOverview()}
            </div>
        )
    }
}

export default Chrome;

export const displayChrome = () => {
    return <Chrome> </Chrome>;
}
