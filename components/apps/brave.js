import React, { Component } from 'react';

export class Brave extends Component {
    constructor() {
        super();
        this.home_url = 'https://www.google.com/webhp?igu=1';
        this.state = {
            url: 'https://www.google.com/webhp?igu=1',
            display_url: "https://www.google.com",
        }
    }

    componentDidMount() {
        let lastVisitedUrl = localStorage.getItem("brave-url");
        let lastDisplayedUrl = localStorage.getItem("brave-display-url");
        if (lastVisitedUrl !== null && lastVisitedUrl !== undefined) {
            this.setState({ url: lastVisitedUrl, display_url: lastDisplayedUrl }, this.refreshBrave);
        }
    }

    storeVisitedUrl = (url, display_url) => {
        localStorage.setItem("brave-url", url);
        localStorage.setItem("brave-display-url", display_url);
    }

    refreshBrave = () => {
        const screen = document.getElementById("brave-screen");
        if (screen) screen.src += '';
    }

    goToHome = () => {
        this.setState({ url: this.home_url, display_url: "https://www.google.com" });
        this.refreshBrave();
    }

    checkKey = (e) => {
        if (e.key === "Enter") {
            let url = e.target.value;
            let display_url = "";

            url = url.trim();
            if (url.length === 0) return;

            if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
                url = "https://" + url;
            }

            url = encodeURI(url);
            display_url = url;
            if (url.includes("google.com")) {
                url = 'https://www.google.com/webhp?igu=1';
                display_url = "https://www.google.com";
            }
            this.setState({ url, display_url: url });
            this.storeVisitedUrl(url, display_url);
            document.getElementById("brave-url-bar").blur();
        }
    }

    handleDisplayUrl = (e) => {
        this.setState({ display_url: e.target.value });
    }

    displayUrlBar = () => {
        return (
            <div className="w-full pt-1.5 pb-1.5 flex justify-start items-center text-white text-sm border-b border-gray-900 bg-ub-cool-grey">
                <div onClick={this.refreshBrave} className="ml-3 mr-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10 cursor-pointer p-1">
                    <img className="w-4" src="./themes/Yaru/status/chrome_refresh.svg" alt="Brave Refresh" />
                </div>
                <div onClick={this.goToHome} className="mr-3 ml-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10 cursor-pointer p-1">
                    <img className="w-4" src="./themes/Yaru/status/chrome_home.svg" alt="Brave Home" />
                </div>
                <input 
                    onKeyDown={this.checkKey} 
                    onChange={this.handleDisplayUrl} 
                    value={this.state.display_url} 
                    id="brave-url-bar" 
                    className="outline-none bg-ub-grey rounded-md pl-3 py-1 mr-3 w-5/6 text-gray-300 focus:text-white border border-transparent focus:border-ub-orange transition-all" 
                    type="url" 
                    spellCheck={false} 
                    autoComplete="off" 
                />
            </div>
        );
    }

    render() {
        return (
            <div className="h-full w-full flex flex-col bg-ub-cool-grey">
                {this.displayUrlBar()}
                <iframe src={this.state.url} className="flex-grow" id="brave-screen" frameBorder="0" title="Brave Browser"></iframe>
            </div>
        )
    }
}

export default Brave

export const displayBrave = () => {
    return <Brave> </Brave>;
}
