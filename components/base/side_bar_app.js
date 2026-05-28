import React, { Component } from "react";

export class SideBarApp extends Component {
    constructor() {
        super();
        this.id = null;
        this.state = {
            showTitle: false,
            scaleImage: false,
        };
    }

    componentDidMount() {
        this.id = this.props.id;
    }

    scaleImage = () => {
        setTimeout(() => { this.setState({ scaleImage: false }); }, 1000);
        this.setState({ scaleImage: true });
    }

    openApp = () => {
        if (!this.props.isMinimized[this.id] && this.props.isClose[this.id]) {
            this.scaleImage();
        }
        if (this.props.isExternalApp && this.props.url) {
            window.open(this.props.url, "_blank", "noopener,noreferrer");
        } else {
            this.props.openApp(this.id);
        }
        this.setState({ showTitle: false });
    };

    render() {
        return (
            <div
                tabIndex="0"
                onClick={this.openApp}
                onMouseEnter={() => { this.setState({ showTitle: true }); }}
                onMouseLeave={() => { this.setState({ showTitle: false }); }}
                className={`dock-app-enter ${(this.props.isClose[this.id] === false && this.props.isFocus[this.id] ? "bg-white bg-opacity-10 " : "")} w-12 h-12 outline-none relative transition hover:bg-white hover:bg-opacity-10 rounded-xl m-1 flex items-center justify-center cursor-pointer group active:scale-95`}
                id={"sidebar-" + this.props.id}
            >
                <img width="28px" height="28px" className={`w-8 h-8 object-contain ${this.props.id === 'calc' ? 'scale-125' : ''}`} src={this.props.icon} alt="App Icon" />
                <img className={(this.state.scaleImage ? " scale " : "") + ` scalable-app-icon w-8 h-8 object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${this.props.id === 'calc' ? 'scale-125' : ''}`} src={this.props.icon} alt="" />
                {
                    (
                        this.props.isClose[this.id] === false
                            ? <div className="w-1.5 h-1.5 absolute bottom-0.5 left-1/2 transform -translate-x-1/2 bg-ub-orange rounded-full shadow-lg"></div>
                            : null
                    )
                }
                <div
                    className={
                        (this.state.showTitle ? " visible " : " invisible ") +
                        " w-max py-1 px-2.5 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 text-ubt-grey text-opacity-95 text-xs bg-ub-grey bg-opacity-95 border-gray-450 border border-opacity-40 rounded-md shadow-2xl z-30 font-sans"
                    }
                >
                    {this.props.title}
                </div>
            </div>
        );
    }
}

export default SideBarApp;
