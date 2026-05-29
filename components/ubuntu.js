import React, { Component } from 'react';
import BootingScreen from './screen/booting_screen';
import Desktop from './screen/desktop';
import LockScreen from './screen/lock_screen';
import Navbar from './screen/navbar';
import ReactGA from 'react-ga4';

export default class Ubuntu extends Component {
	constructor() {
		super();
		this.state = {
			screen_locked: true,
			bg_image_name: 'wall-9',
			booting_screen: true,
			shutDownScreen: false,
			dark_mode: true,
			activities_overview: false,
		};
	}

	componentDidMount() {
		this.getLocalData();
		this.setTimeOutBootScreen();
		window.addEventListener('portfolio-settings-changed', this.handleSettingsChange);
	}

	componentWillUnmount() {
		window.removeEventListener('portfolio-settings-changed', this.handleSettingsChange);
	}

	handleSettingsChange = (e) => {
		if (e.detail.key === 'yaru-accent') {
			this.applyAccentColor(e.detail.value);
		}
	};

	applyAccentColor = (colorName) => {
		const accentColors = {
			orange:  '#e95420',
			olive:   '#6d8a34',
			green:   '#35a854',
			teal:    '#008080',
			cyan:    '#11a0f0',
			blue:    '#1c71d8',
			purple:  '#7b1fa2',
			magenta: '#c2185b',
			red:     '#e01b24',
		};
		const hex = accentColors[colorName] || '#e95420';
		document.documentElement.style.setProperty('--ubuntu-accent-color', hex);
	};

	setTimeOutBootScreen = () => {
		setTimeout(() => {
			this.setState({ booting_screen: false });
		}, 3000);
	};

	getLocalData = () => {
		let bg_image_name = localStorage.getItem('bg-image');
		if (bg_image_name !== null && bg_image_name !== undefined) {
			if (bg_image_name === 'wall-2' || bg_image_name === 'wall-noble-numbat') {
				bg_image_name = 'wall-9';
				localStorage.setItem('bg-image', 'wall-9');
			}
			this.setState({ bg_image_name });
		}

		let dark_mode = localStorage.getItem('dark-mode');
		if (dark_mode !== null && dark_mode !== undefined) {
			this.setState({ dark_mode: dark_mode === 'true' });
		} else {
			this.setState({ dark_mode: true });
			localStorage.setItem('dark-mode', true);
		}

		let shut_down = localStorage.getItem('shut-down');
		if (shut_down !== null && shut_down !== undefined && shut_down === 'true') this.shutDown();
		else {
			this.setState({ screen_locked: true });
			localStorage.setItem('screen-locked', true);
		}

		let accentColor = localStorage.getItem('yaru-accent');
		if (accentColor) {
			this.applyAccentColor(accentColor);
		}
	};

	lockScreen = () => {
		ReactGA.send({ hitType: "pageview", page: "/lock-screen", title: "Lock Screen" });
		ReactGA.event({ category: `Screen Change`, action: `Set Screen to Locked` });
		document.getElementById('status-bar').blur();
		setTimeout(() => { this.setState({ screen_locked: true }); }, 100);
		localStorage.setItem('screen-locked', true);
	};

	unLockScreen = () => {
		ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });
		window.removeEventListener('click', this.unLockScreen);
		window.removeEventListener('keydown', this.unLockScreen);
		this.setState({ screen_locked: false });
		localStorage.setItem('screen-locked', false);
	};

	changeBackgroundImage = (img_name) => {
		this.setState({ bg_image_name: img_name });
		localStorage.setItem('bg-image', img_name);
	};

	shutDown = () => {
		ReactGA.send({ hitType: "pageview", page: "/switch-off", title: "Custom Title" });
		ReactGA.event({ category: `Screen Change`, action: `Switched off the Ubuntu` });
		document.getElementById('status-bar').blur();
		this.setState({ shutDownScreen: true });
		localStorage.setItem('shut-down', true);
	};

	turnOn = () => {
		ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });
		this.setState({ shutDownScreen: false, booting_screen: true, screen_locked: true });
		this.setTimeOutBootScreen();
		localStorage.setItem('shut-down', false);
		localStorage.setItem('screen-locked', true);
	};

	toggleDarkMode = (val) => {
		const isDark = val !== undefined ? val : !this.state.dark_mode;
		this.setState({ dark_mode: isDark });
		localStorage.setItem('dark-mode', isDark);

		// Automatically swap wallpaper if using theme-linked wallpapers
		const DARK_WALL = 'wall-9';
		const LIGHT_WALL = 'wall-10';
		const THEME_WALLS = [DARK_WALL, LIGHT_WALL];
		if (THEME_WALLS.includes(this.state.bg_image_name)) {
			this.changeBackgroundImage(isDark ? DARK_WALL : LIGHT_WALL);
		}
	};

	toggleActivities = () => {
		this.setState({ activities_overview: !this.state.activities_overview });
	};

	render() {
		return (
			<div className="w-screen h-screen overflow-hidden" id="monitor-screen">
				<LockScreen
					isLocked={this.state.screen_locked}
					bgImgName={this.state.bg_image_name}
					unLockScreen={this.unLockScreen}
				/>
				<BootingScreen
					visible={this.state.booting_screen}
					isShutDown={this.state.shutDownScreen}
					turnOn={this.turnOn}
				/>
				<Navbar 
					lockScreen={this.lockScreen} 
					shutDown={this.shutDown} 
					dark_mode={this.state.dark_mode}
					toggleDarkMode={this.toggleDarkMode}
					activities_overview={this.state.activities_overview}
					toggleActivities={this.toggleActivities}
				/>
				<Desktop 
					bg_image_name={this.state.bg_image_name} 
					changeBackgroundImage={this.changeBackgroundImage} 
					dark_mode={this.state.dark_mode}
					toggleDarkMode={this.toggleDarkMode}
					activities_overview={this.state.activities_overview}
					toggleActivities={this.toggleActivities}
				/>
			</div>
		);
	}
}
