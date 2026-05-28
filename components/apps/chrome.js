import React, { Component } from 'react';
import GoogleSearchResult from '../chrome/GoogleSearchResult';
import WikipediaProfile from '../chrome/WikipediaProfile';

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
            display_url: 'https://www.google.com/search?q=Praneeth+Reddy'
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
            // Ignore cross-origin errors safely to prevent infinite reload loops
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
            document.getElementById("chrome-url-bar").blur();
        }
    }

    handleDisplayUrl = (e) => {
        this.setState({ display_url: e.target.value });
    }

    renderTabBar = () => {
        const { tabs, activeTabId } = this.state;
        const isDark = this.props.dark_mode;
        return (
            <div className={`w-full flex items-end px-3 pt-2 select-none overflow-x-auto no-scrollbar transition-colors duration-150 ${isDark ? 'bg-[#202124]' : 'bg-[#dee1e6]'}`} style={{ minHeight: "40px" }}>
                <div className="flex items-end space-x-1.5 pr-4">
                    {tabs.map((tab) => {
                        const isActive = tab.id.toString() === activeTabId.toString();
                        let faviconSrc = null;
                        if (this.isWikipediaForPraneeth(tab.url)) {
                            faviconSrc = 'https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org';
                        } else if (this.isGoogleSearchForPraneeth(tab.url)) {
                            faviconSrc = 'https://www.google.com/s2/favicons?sz=64&domain=google.com';
                        } else if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
                            try {
                                const domain = new URL(tab.url).hostname;
                                faviconSrc = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
                            } catch (e) { }
                        } else if (tab.url.includes('/chrome/')) {
                            faviconSrc = 'https://www.google.com/s2/favicons?sz=64&domain=google.com';
                        }
                        return (
                            <div
                                key={tab.id}
                                onClick={() => this.switchTab(tab.id)}
                                className={`group relative flex items-center h-9 px-3 rounded-t-lg text-[11px] cursor-pointer transition-colors max-w-[200px] min-w-[140px] ${isActive
                                    ? (isDark ? 'bg-[#35363a] text-white shadow-[0_-1px_3px_rgba(0,0,0,0.2)]' : 'bg-white text-gray-800 shadow-[0_-1px_3px_rgba(0,0,0,0.15)]')
                                    : (isDark ? 'bg-transparent text-gray-400 hover:bg-[#2d2e30] hover:text-gray-250' : 'bg-transparent text-[#5f6368] hover:bg-[#d0d3d6]/70 hover:text-[#3c4043]')
                                    }`}
                                style={{
                                    borderTopLeftRadius: '8px',
                                    borderTopRightRadius: '8px',
                                    marginBottom: isActive ? '-1px' : '0px',
                                    zIndex: isActive ? 10 : 1,
                                    position: 'relative'
                                }}
                            >
                                {/* Favicon */}
                                {faviconSrc ? (
                                    <img className="w-3.5 h-3.5 mr-2 flex-shrink-0 rounded-sm" src={faviconSrc} alt="favicon" onError={(e) => { e.target.src = '/themes/Yaru/apps/chrome.png'; }} />
                                ) : (
                                    <svg className="w-3.5 h-3.5 mr-2 flex-shrink-0" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                    </svg>
                                )}

                                <span className="truncate pr-4 font-normal select-none">{tab.title}</span>
                                <button
                                    onClick={(e) => this.closeTab(tab.id, e)}
                                    className={`absolute right-2 w-4 h-4 flex items-center justify-center rounded-full transition-colors ${isDark ? 'hover:bg-white/15 text-gray-400 hover:text-white' : 'hover:bg-black/10 text-gray-500 hover:text-black'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-2.5 h-2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {!isActive && (
                                    <div className={`absolute right-0 top-2.5 bottom-2.5 w-[1px] ${isDark ? 'bg-gray-700/60' : 'bg-gray-400/40'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={this.addTab}
                    className={`p-1.5 mb-1.5 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-[#5f6368] hover:bg-black/5 hover:text-black'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>
        );
    }

    displayUrlBar = () => {
        const { tabs, activeTabId } = this.state;
        const activeTab = tabs.find(t => t.id.toString() === activeTabId.toString());
        const canGoBack = activeTab && activeTab.historyPointer > 0;
        const canGoForward = activeTab && activeTab.historyStack && activeTab.historyPointer < activeTab.historyStack.length - 1;
        const isDark = this.props.dark_mode;

        const isCustomTab = activeTab && (this.isGoogleSearchForPraneeth(activeTab.url) || this.isWikipediaForPraneeth(activeTab.url));
        const outerBarHeight = isCustomTab ? 'h-[50px]' : 'h-[34px]';

        return (
            <div className={`w-full ${outerBarHeight} px-3 flex items-center text-sm border-b shadow-md select-none gap-2 transition-colors duration-150 ${isDark ? 'bg-[#35363a] text-white border-black/40' : 'bg-white text-[#3c4043] border-b-[1.5px] border-[#c1c4c8]'
                }`}>
                {/* Navigation Buttons */}
                <div className="flex items-center gap-1">
                    <div
                        onClick={canGoBack ? this.goBack : null}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${canGoBack
                            ? (isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer' : 'text-[#5f6368] hover:bg-black/5 hover:text-[#3c4043] cursor-pointer')
                            : (isDark ? 'text-gray-500 cursor-not-allowed' : 'text-[#c1c4c7] cursor-not-allowed')
                            }`}
                        title="Back"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
                    </div>
                    <div
                        onClick={canGoForward ? this.goForward : null}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${canGoForward
                            ? (isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer' : 'text-[#5f6368] hover:bg-black/5 hover:text-[#3c4043] cursor-pointer')
                            : (isDark ? 'text-gray-500 cursor-not-allowed' : 'text-[#c1c4c7] cursor-not-allowed')
                            }`}
                        title="Forward"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" /></svg>
                    </div>
                    <div onClick={this.refresh} className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-[#5f6368] hover:bg-black/5 hover:text-[#3c4043]'
                        }`} title="Refresh">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" /></svg>
                    </div>
                    <div onClick={this.goToHome} className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-[#5f6368] hover:bg-black/5 hover:text-[#3c4043]'
                        }`} title="Google Home page">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                    </div>
                </div>

                {/* Address Pill */}
                <div className={`flex-grow h-7 rounded-full flex items-center px-3 border transition-colors relative ${isDark
                    ? 'bg-[#202124] border-[#444746] hover:border-white/10 focus-within:border-blue-500 focus-within:bg-[#1c1d20]'
                    : 'bg-[#f1f3f4] border-[#dee1e6] hover:border-gray-300 focus-within:border-blue-500 focus-within:bg-white'
                    }`}>
                    {/* Lock Icon */}
                    <div className="text-green-500 mr-2 flex items-center">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" /></svg>
                    </div>
                    <input
                        onKeyDown={this.checkKey}
                        onChange={this.handleDisplayUrl}
                        value={this.state.display_url}
                        id="chrome-url-bar"
                        className={`outline-none bg-transparent text-xs w-full font-light pr-6 ${isDark ? 'text-gray-200 focus:text-white' : 'text-[#3c4043] focus:text-black'
                            }`}
                        type="url"
                        spellCheck={false}
                        autoComplete="off"
                    />
                    {/* Star Icon */}
                    <div className={`absolute right-3 cursor-pointer transition-colors flex items-center ${isDark ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-500 hover:text-yellow-500'
                        }`}>
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                    </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-1.5 pr-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-colors ${isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-[#5f6368] hover:bg-black/5 hover:text-[#3c4043]'
                        }`}>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M10.5 4.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v.75h3.75c.83 0 1.5.67 1.5 1.5v3.75h-.75c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h.75v3.75c0 .83-.67 1.5-1.5 1.5h-3.75v-.75c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.75H6.75c-.83 0-1.5-.67-1.5-1.5v-3.75h.75c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-.75V6.75c0-.83.67-1.5 1.5-1.5h3.75V4.5z" /></svg>
                    </div>
                    <img className={`w-6 h-6 rounded-full border cursor-pointer object-cover hover:scale-105 transition-transform ${isDark ? 'border-gray-600' : 'border-gray-300'
                        }`} src="/images/logos/pfp.jpg" alt="Profile" onError={(e) => { e.target.src = '/themes/Yaru/apps/chrome.png'; }} />
                </div>
            </div>
        );
    }

    isGoogleSearchForPraneeth = (url) => {
        if (!url) return false;
        const lowercaseUrl = url.toLowerCase();
        // Route ALL searches to the custom component to bypass iframe CAPTCHA blocks
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
            <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} className={`h-full w-full flex flex-col overflow-hidden ${isDark ? 'bg-[#35363a]' : 'bg-[#f1f3f4]'
                }`}>
                {this.renderTabBar()}
                {this.displayUrlBar()}
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
        )
    }
}

export default Chrome;

export const displayChrome = () => {
    return <Chrome> </Chrome>;
}
