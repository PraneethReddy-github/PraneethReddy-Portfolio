import React from 'react'

function BootingScreen(props) {
    const isShowing = props.visible || props.isShutDown;

    return (
        <div 
            style={isShowing 
                ? { zIndex: "100" } 
                : { zIndex: "-20", transition: "opacity 1200ms ease-in-out, z-index 0s 1200ms" }
            } 
            className={(isShowing ? "opacity-100" : "opacity-0 pointer-events-none") + " absolute transition-opacity duration-1000 ease-in-out select-none flex flex-col justify-around items-center top-0 right-0 overflow-hidden m-0 p-0 h-screen w-screen bg-black"}
        >
            <img width="400px" height="400px" className="md:w-1/4 w-1/2" src="./themes/Yaru/status/cof_orange_hex.svg" alt="Ubuntu Logo" />
            <div className="w-10 h-10 flex justify-center items-center rounded-full outline-none cursor-pointer" onClick={props.turnOn} >
                {(props.isShutDown
                    ? <div className="bg-white rounded-full flex justify-center items-center w-10 h-10 hover:bg-gray-300"><img width="32px" height="32px" className="w-8" src="./themes/Yaru/status/power-button.svg" alt="Power Button" /></div>
                    : <img width="40px" height="40px" className={" w-10 " + (props.visible ? " animate-spin " : "")} src="./themes/Yaru/status/process-working-symbolic.svg" alt="Ubuntu Process Symbol" />)}
            </div>
            <img width="200px" height="100px" className="md:w-1/5 w-1/2" src="./themes/Yaru/status/ubuntu_white_hex.svg" alt="Ubuntu Name" />
        </div>
    )
}

export default BootingScreen
