import React from 'react';
import UbuntuApp from '../base/ubuntu_app';
import BackgroundImage from '../util components/background-image';

export class AllApplications extends React.Component {
    constructor() {
        super();
        this.state = {
            query: "",
            apps: [],
            isClosing: false,
        }
        this._closeTimer = null;
    }

    componentDidMount() {
        this.setState({ apps: this.props.apps })
    }

    componentWillUnmount() {
        if (this._closeTimer) clearTimeout(this._closeTimer);
    }

    handleClose = () => {
        if (this.state.isClosing) return;
        this.setState({ isClosing: true });
        this._closeTimer = setTimeout(() => {
            this.props.showAllApps();
        }, 240);
    }

    handleChange = (e) => {
        const query = e.target.value;
        this.setState({
            query: query,
            apps: query === "" || query === null ?
                this.props.apps : this.props.apps.filter(
                    (app) => app.title.toLowerCase().includes(query.toLowerCase())
                )
        });
    }

    renderApps = () => {
        let appsJsx = [];
        let apps = [...this.state.apps];
        apps.forEach((app, index) => {
            const props = { 
                name: app.title, 
                id: app.id, 
                icon: app.icon, 
                openApp: this.props.openApp,
                isAllApps: true,
                isExternalApp: app.isExternalApp,
                url: app.url
            };
            appsJsx.push(<UbuntuApp key={index} {...props} />);
        });
        return appsJsx;
    }

    render() {
        const { isClosing } = this.state;
        return (
            <div 
                onClick={this.handleClose}
                className={`fixed inset-0 top-7 w-full z-[9999] pl-12 justify-center md:pl-20 ${isClosing ? 'animateFadeOut' : 'animateFadeIn'} flex flex-col justify-start items-center select-none overflow-hidden`}
            >
                {/* Blurred desktop wallpaper background */}
                <div className="absolute inset-0 z-0">
                    <BackgroundImage img={this.props.bg_image_name} />
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-md" />
                </div>

                {/* Search Bar */}
                <div className="flex pt-12 pb-6 w-full justify-center relative z-10">
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="w-[420px] flex items-center bg-[#252525]/90 border border-white/10 px-4 py-2.5 rounded-2xl text-gray-300 focus-within:bg-[#2c2c2c] search-bar-focus transition-all shadow-2xl"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
                        </svg>
                        <input 
                            className="bg-transparent outline-none w-full text-sm placeholder-gray-500 text-white font-sans"
                            placeholder="Type to search..."
                            value={this.state.query}
                            onChange={this.handleChange} 
                            autoFocus
                        />
                    </div>
                </div>

                {/* Applications Grid */}
                <div className="relative z-10 grid md:grid-cols-5 md:grid-rows-3 grid-cols-3 grid-rows-6 md:gap-8 gap-4 px-6 pt-12 justify-center items-center justify-items-center w-full max-w-4xl overflow-y-auto max-h-[70%] scrollbar-none pb-20">
                    {this.renderApps()}
                </div>
            </div>
        )
    }
}

export default AllApplications;
