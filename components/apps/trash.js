import React, { Component } from 'react';
import $ from 'jquery';

export class Trash extends Component {
    constructor() {
        super();
        this.state = {
            trashItems: [],
        }
    }

    componentDidMount() {
        this.loadTrashItems();
        window.addEventListener('ubuntu-trash-changed', this.loadTrashItems);
    }

    componentWillUnmount() {
        window.removeEventListener('ubuntu-trash-changed', this.loadTrashItems);
    }

    loadTrashItems = () => {
        try {
            const stored = localStorage.getItem("trash_items");
            if (stored) {
                this.setState({ trashItems: JSON.parse(stored) });
            } else {
                this.setState({ trashItems: [] });
            }
        } catch(e) {}
    }

    focusFile = (e) => {
        // icon
        $(e.target).children().get(0).classList.toggle("opacity-60");
        // file name
        $(e.target).children().get(1).classList.toggle("bg-ub-orange");
    }

    emptyTrash = () => {
        this.setState({ trashItems: [] });
        localStorage.setItem("trash_items", JSON.stringify([]));
    };

    restoreTrash = () => {
        const { trashItems } = this.state;
        if (trashItems.length === 0) return;

        let new_folders = [];
        let deleted_apps = [];

        try {
            new_folders = JSON.parse(localStorage.getItem('new_folders')) || [];
            deleted_apps = JSON.parse(localStorage.getItem("deleted_default_apps")) || [];
        } catch(e){}

        trashItems.forEach(item => {
            if (item.id.startsWith("new-folder-")) {
                new_folders.push({ id: item.id.replace('new-folder-', ''), name: item.name });
            } else {
                deleted_apps = deleted_apps.filter(appId => appId !== item.id);
            }
        });

        localStorage.setItem("new_folders", JSON.stringify(new_folders));
        localStorage.setItem("deleted_default_apps", JSON.stringify(deleted_apps));
        
        // Clear trash
        this.emptyTrash();

        // Tell desktop to refresh
        window.dispatchEvent(new Event('ubuntu-trash-restored'));
    };

    emptyScreen = () => {
        return (
            <div className="flex-grow flex flex-col justify-center items-center">
                <img className=" w-24" src="./themes/Yaru/status/user-trash-symbolic.svg" alt="Ubuntu Trash" />
                <span className="font-bold mt-4 text-xl px-1 text-gray-400">Trash is Empty</span>
            </div>
        );
    }

    showTrashItems = () => {
        return (
            <div className="flex-grow ml-4 flex flex-wrap items-start content-start justify-start overflow-y-auto windowMainScreen">
                {
                    this.state.trashItems.map((item, index) => {
                        return (
                            <div key={index} tabIndex="1" onFocus={this.focusFile} onBlur={this.focusFile} className="flex flex-col items-center text-sm outline-none w-16 my-2 mx-4">
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <img src={item.icon} alt="Ubuntu File Icons" />
                                </div>
                                <span className="text-center rounded px-0.5 whitespace-nowrap overflow-hidden overflow-ellipsis w-24">{item.name}</span>
                            </div>
                        )
                    })
                }
            </div>
        );
    }

    render() {
        return (
            <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none">
                <div className="flex items-center justify-between w-full bg-ub-warm-grey bg-opacity-40 text-sm">
                    <span className="font-bold ml-2">Trash</span>
                    <div className="flex">
                        <div onClick={this.restoreTrash} className="border border-black bg-black bg-opacity-50 px-3 py-1 my-1 mx-1 rounded hover:bg-opacity-80 cursor-pointer">Restore</div>
                        <div onClick={this.emptyTrash} className="border border-black bg-black bg-opacity-50 px-3 py-1 my-1 mx-1 rounded hover:bg-opacity-80 cursor-pointer">Empty</div>
                    </div>
                </div>
                {
                    (this.state.trashItems.length === 0
                        ? this.emptyScreen()
                        : this.showTrashItems()
                    )
                }
            </div>
        )
    }
}

export default Trash;

export const displayTrash = () => {
    return <Trash> </Trash>;
}
