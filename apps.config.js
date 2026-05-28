import { displayDoom } from './components/apps/doom';
import { displayGame2048 } from './components/apps/game2048';
import displayVsCode from './components/apps/vscode';
import { displayTerminal } from './components/apps/terminal';
import { displaySettings } from './components/apps/settings';
import { displayChrome } from './components/apps/chrome';
import { displayTrash } from './components/apps/trash';
import { displayGedit } from './components/apps/gedit';
import { displayAboutPraneeth } from './components/apps/praneeth';
import { displayTerminalCalc } from './components/apps/calculator';

const apps = [
    {
        id: "about-praneeth",
        title: "About Praneeth",
        icon: './themes/Yaru/system/user-home.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayAboutPraneeth,
    },
    {
        id: "vscode",
        title: "Visual Studio Code",
        icon: './themes/Yaru/apps/vscode.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayVsCode,
    },
    {
        id: "github",
        title: "GitHub",
        icon: './themes/Yaru/apps/github.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        isExternalApp: true,
        url: "https://github.com/PraneethReddy-github",
        screen: () => {},
    },
    {
        id: "terminal",
        title: "Terminal",
        icon: './themes/Yaru/apps/bash.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayTerminal,
    },
    {
        id: "doom",
        title: "Doom",
        icon: './themes/Yaru/apps/doom.svg',
        disabled: false,
        favourite: false,
        desktop_shortcut: false,
        screen: displayDoom,
    },
    {
        id: "game-2048",
        title: "2048",
        icon: './themes/Yaru/apps/game2048.svg',
        disabled: false,
        favourite: false,
        desktop_shortcut: false,
        screen: displayGame2048,
    },
    {
        id: "settings",
        title: "Settings",
        icon: './themes/Yaru/apps/gnome-control-center.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displaySettings,
    },
    {
        id: "chrome",
        title: "Google Chrome",
        icon: './themes/Yaru/apps/chrome.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: false,
        screen: displayChrome,
    },
    {
        id: "calc",
        title: "Calculator",
        icon: './themes/Yaru/apps/calc.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: false,
        screen: displayTerminalCalc,
    },
    {
        id: "trash",
        title: "Trash",
        icon: './themes/Yaru/system/user-trash-full.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayTrash,
    },
    {
        id: "gedit",
        title: "Contact Me",
        icon: './themes/Yaru/apps/gedit.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayGedit,
    },
    {
        id: "linkedin",
        title: "LinkedIn",
        icon: './themes/Yaru/apps/linkedin.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: false,
        isExternalApp: true,
        url: "https://www.linkedin.com/in/connectwithpraneeth/",
        screen: () => {},
    },
    {
        id: "instagram",
        title: "Instagram",
        icon: './themes/Yaru/apps/instagram.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: false,
        isExternalApp: true,
        url: "https://www.instagram.com/prx.reddy/",
        screen: () => {},
    },
    {
        id: "ieee",
        title: "IEEE Profile",
        icon: './images/logos/IEEE.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: false,
        isExternalApp: true,
        url: "https://ieeexplore.ieee.org/author/677775936439100",
        screen: () => {},
    }
]

export default apps;
