import React, { Component } from 'react'

export class UbuntuApp extends Component {

    openApp = (e) => {
        if (e) e.stopPropagation();
        if (this.props.isExternalApp && this.props.url) {
            window.open(this.props.url, "_blank", "noopener,noreferrer");
        } else {
            this.props.openApp(this.props.id);
        }
    }

    render() {
        const isAllApps = this.props.isAllApps;
        const isSelected = this.props.isSelected;
        return (
            <div
                className={
                    isAllApps 
                    ? "p-3 m-2 z-10 bg-white bg-opacity-0 hover:bg-opacity-10 focus:bg-ub-orange focus:bg-opacity-30 border border-transparent outline-none rounded-2xl select-none w-32 h-32 flex flex-col justify-center items-center text-center text-sm font-normal text-white relative transition-all duration-200 hover:scale-105 cursor-pointer"
                    : `p-1 m-px z-0 ${isSelected ? "bg-ub-orange bg-opacity-30 border-yellow-700 border-opacity-100" : "bg-white bg-opacity-0 hover:bg-opacity-20 border-transparent"} focus:bg-ub-orange focus:bg-opacity-30 focus:border-yellow-700 focus:border-opacity-100 border outline-none rounded select-none w-24 h-20 flex flex-col justify-start items-center text-center text-xs font-normal text-white relative`
                }
                id={"app-" + this.props.id}
                onDoubleClick={!isAllApps ? this.openApp : undefined}
                onClick={isAllApps ? this.openApp : undefined}
                onContextMenu={(e) => { if (this.props.onContextMenu) this.props.onContextMenu(e, this.props.id); }}
                tabIndex={0}
            >
                <div className="relative">
                    <img 
                        className={(isAllApps ? "mb-2 w-16 h-16 object-contain" : "mb-1 w-10 h-10 object-contain") + (this.props.id === 'calc' ? ' scale-125' : '')} 
                        src={this.props.icon} 
                        alt={"App " + this.props.name} 
                    />
                    {this.props.isExternalApp && (
                        <img
                            src="./themes/Yaru/status/arrow-up-right.svg"
                            alt="External Link"
                            className={isAllApps ? "w-4 h-4 absolute -bottom-0.5 -right-0.5" : "w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5"}
                        />
                    )}
                </div>
                <span className="truncate w-full">{this.props.name}</span>
            </div>
        )
    }
}

export default UbuntuApp
