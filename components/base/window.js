import React, { Component } from 'react';
import Draggable from 'react-draggable';
import Settings from '../apps/settings';
import ReactGA from 'react-ga4';
import { displayTerminal } from '../apps/terminal'

export class Window extends Component {
    constructor(props) {
        super(props);
        this.id = props.id;
        if (this.id === "terminal") {
            this.startX = 500;
            this.startY = 80;
        } else {
            this.startX = 60;
            this.startY = 10;
        }
        this.state = {
            cursorType: "cursor-default",
            width: 60,
            height: 85,
            closed: false,
            maximized: false,
            parentSize: {
                height: 100,
                width: 100
            }
        }
    }

    componentDidMount() {
        this.id = this.props.id;
        this.setDefaultWindowDimenstion();
        ReactGA.send({ hitType: "pageview", page: `/${this.id}`, title: "Custom Title" });
        window.addEventListener('resize', this.resizeBoundries);
        if (this.id === "doom") {
            setTimeout(() => {
                this.maximizeWindow();
            }, 50);
        }
    }

    componentWillUnmount() {
        ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });
        window.removeEventListener('resize', this.resizeBoundries);
    }

    setDefaultWindowDimenstion = () => {
        if (window.innerWidth < 640) {
            if (this.id === "calc") {
                this.setState({ height: 60, width: 80 }, this.resizeBoundries);
            } else if (this.id === "terminal") {
                this.setState({ height: 60, width: 80 }, this.resizeBoundries);
            } else {
                this.setState({ height: 60, width: 85 }, this.resizeBoundries);
            }
        } else {
            if (this.id === "calc") {
                this.setState({ height: 65, width: 25 }, this.resizeBoundries);
            } else if (this.id === "terminal") {
                this.setState({ height: 65, width: 45 }, this.resizeBoundries);
            } else {
                this.setState({ height: 85, width: 60 }, this.resizeBoundries);
            }
        }
    }

    resizeBoundries = () => {
        this.setState({
            parentSize: {
                height: window.innerHeight - (window.innerHeight * (this.state.height / 100.0)) - 28,
                width: window.innerWidth - (window.innerWidth * (this.state.width / 100.0))
            }
        });
    }

    changeCursorToMove = () => {
        this.focusWindow();
        if (this.state.maximized) { this.restoreWindow(); }
        this.setState({ cursorType: "cursor-move" })
    }

    changeCursorToDefault = () => { this.setState({ cursorType: "cursor-default" }) }

    handleVerticleResize = () => { this.setState({ height: this.state.height + 0.1 }, this.resizeBoundries); }
    handleHorizontalResize = () => { this.setState({ width: this.state.width + 0.1 }, this.resizeBoundries); }

    setWinowsPosition = () => {
        var r = document.querySelector("#" + this.id);
        var rect = r.getBoundingClientRect();
        r.style.setProperty('--window-transform-x', rect.x.toFixed(1).toString() + "px");
        r.style.setProperty('--window-transform-y', (rect.y.toFixed(1) - 32).toString() + "px");
    }

    checkOverlap = () => {
        this.props.hideSideBar(this.id, false);
    }

    focusWindow = () => { this.props.focus(this.id); }

    minimizeWindow = () => {
        this.setWinowsPosition();
        var r = document.querySelector("#" + this.id);
        let posx = r.style.getPropertyValue("--window-transform-x");
        let posy = r.style.getPropertyValue("--window-transform-y");
        r.style.transform = `translate(${posx},${posy}) scale(0.2)`;
        this.props.hasMinimised(this.id);
    }

    restoreWindow = () => {
        var r = document.querySelector("#" + this.id);
        this.setDefaultWindowDimenstion();
        let posx = r.style.getPropertyValue("--window-transform-x");
        let posy = r.style.getPropertyValue("--window-transform-y");
        r.style.transform = `translate(${posx},${posy})`;
        setTimeout(() => { this.setState({ maximized: false }); this.checkOverlap(); }, 300);
    }

    maximizeWindow = () => {
        if (this.state.maximized) { this.restoreWindow(); }
        else {
            this.focusWindow();
            var r = document.querySelector("#" + this.id);
            this.setWinowsPosition();
            r.style.transform = `translate(-1pt,-2pt)`;
            this.setState({ maximized: true, height: 96.3, width: 100.2 });
            this.props.hideSideBar(this.id, true);
        }
    }

    closeWindow = () => {
        this.setWinowsPosition();
        this.setState({ closed: true }, () => {
            this.props.hideSideBar(this.id, false);
            setTimeout(() => { this.props.closed(this.id) }, 300)
        });
    }

    render() {
        return (
            <Draggable
                axis="both"
                handle=".window-title"
                grid={[1, 1]}
                scale={1}
                onStart={this.changeCursorToMove}
                onStop={this.changeCursorToDefault}
                onDrag={this.checkOverlap}
                allowAnyClick={false}
                defaultPosition={{ x: this.startX, y: this.startY }}
                bounds={{ left: 0, top: 0, right: this.state.parentSize.width, bottom: this.state.parentSize.height }}
            >
                <div style={{ width: `${this.state.width}%`, height: `${this.state.height}%`, zIndex: this.props.zIndex }}
                    className={this.state.cursorType + " " + (this.state.closed ? " closed-window " : "") + (this.state.maximized ? " duration-300 rounded-none" : " rounded-2xl") + (this.props.minimized ? " opacity-0 invisible duration-200 " : "") + (this.props.isFocused ? "" : " notFocused") + " opened-window overflow-hidden min-w-1/4 min-h-1/4 main-window absolute window-shadow border-opacity-40 border border-t-0 flex flex-col " + (this.props.dark_mode ? "border-black" : "border-gray-300")}
                    id={this.id}
                    onClick={this.focusWindow}
                >
                    <WindowYBorder resize={this.handleHorizontalResize} />
                    <WindowXBorder resize={this.handleVerticleResize} />
                    <WindowTopBar title={this.props.title} dark_mode={this.props.dark_mode} />
                    <WindowEditButtons minimize={this.minimizeWindow} maximize={this.maximizeWindow} isMaximised={this.state.maximized} close={this.closeWindow} id={this.id} dark_mode={this.props.dark_mode} />
                    {(this.id === "settings"
                        ? <Settings changeBackgroundImage={this.props.changeBackgroundImage} currBgImgName={this.props.bg_image_name} dark_mode={this.props.dark_mode} toggleDarkMode={this.props.toggleDarkMode} />
                        : <WindowMainScreen screen={this.props.screen} title={this.props.title}
                            addFolder={this.props.id === "terminal" ? this.props.addFolder : null}
                            openApp={this.props.openApp} dark_mode={this.props.dark_mode} />)}
                    
                    {/* Transparent overlay to intercept clicks for iframes when the window is unfocused */}
                    {!this.props.isFocused ? <div className="absolute inset-x-0 bottom-0 top-8 z-40 bg-transparent" onClick={this.focusWindow}></div> : null}
                </div>
            </Draggable >
        )
    }
}

export default Window

export function WindowTopBar(props) {
    const bgStyle = props.dark_mode ? "bg-ub-window-title text-white" : "bg-[#f3f3f3] text-[#333333] border-b border-gray-300";
    return (
        <div className={`relative window-title ${bgStyle} border-t-2 border-white border-opacity-5 py-1.5 px-3 w-full select-none rounded-b-none`}>
            <div className="flex justify-center text-sm font-bold">{props.title}</div>
        </div>
    )
}

export class WindowYBorder extends Component {
    componentDidMount() {
        this.trpImg = new Image(0, 0);
        this.trpImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        this.trpImg.style.opacity = 0;
    }
    render() {
        return (
            <div className=" window-y-border border-transparent border-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" onDragStart={(e) => { e.dataTransfer.setDragImage(this.trpImg, 0, 0) }} onDrag={this.props.resize}>
            </div>
        )
    }
}

export class WindowXBorder extends Component {
    componentDidMount() {
        this.trpImg = new Image(0, 0);
        this.trpImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        this.trpImg.style.opacity = 0;
    }
    render() {
        return (
            <div className=" window-x-border border-transparent border-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" onDragStart={(e) => { e.dataTransfer.setDragImage(this.trpImg, 0, 0) }} onDrag={this.props.resize}>
            </div>
        )
    }
}

export function WindowEditButtons(props) {
    const iconStyle = props.dark_mode ? {} : { filter: "invert(0.8) brightness(0.2)" };
    return (
        <div className="absolute select-none right-0 top-0 mt-1 mr-1 flex justify-center items-center">
            <span className="mx-1.5 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.minimize}>
                <img src="./themes/Yaru/window/window-minimize-symbolic.svg" alt="minimize" style={iconStyle} className="h-5 w-5 inline" />
            </span>
            {
                (props.isMaximised
                    ?
                    <span className="mx-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.maximize}>
                        <img src="./themes/Yaru/window/window-restore-symbolic.svg" alt="restore" style={iconStyle} className="h-5 w-5 inline" />
                    </span>
                    :
                    <span className="mx-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.maximize}>
                        <img src="./themes/Yaru/window/window-maximize-symbolic.svg" alt="maximize" style={iconStyle} className="h-5 w-5 inline" />
                    </span>
                )
            }
            <button tabIndex="-1" id={`close-${props.id}`} className="mx-1.5 focus:outline-none cursor-default bg-ub-orange bg-opacity-90 hover:bg-opacity-100 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.close}>
                <img src="./themes/Yaru/window/window-close-symbolic.svg" alt="close" className="h-5 w-5 inline" />
            </button>
        </div>
    )
}

export class WindowMainScreen extends Component {
    constructor() {
        super();
        this.state = { setDarkBg: false }
    }
    componentDidMount() {
        setTimeout(() => { this.setState({ setDarkBg: true }); }, 3000);
    }
    render() {
        const { dark_mode } = this.props;
        const bgStyle = dark_mode 
            ? (this.state.setDarkBg ? " bg-ub-drk-abrgn text-white " : " bg-ub-cool-grey text-white") 
            : " bg-white text-gray-800 ";
        
        let screenElement = null;
        if (this.props.addFolder) {
            const child = displayTerminal(this.props.addFolder, this.props.openApp);
            screenElement = React.isValidElement(child) ? React.cloneElement(child, { dark_mode }) : child;
        } else {
            const child = this.props.screen();
            screenElement = React.isValidElement(child) ? React.cloneElement(child, { dark_mode }) : child;
        }

        return (
            <div className={"w-full flex-grow z-20 max-h-full overflow-y-auto windowMainScreen" + bgStyle}>
                {screenElement}
            </div>
        )
    }
}
