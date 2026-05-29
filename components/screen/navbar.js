import React, { Component } from 'react';
import Clock from '../util components/clock';
import Status from '../util components/status';
import StatusCard from '../util components/status_card';
import CalendarCard from '../util components/calendar_card';

export default class Navbar extends Component {
	constructor() {
		super();
		this.state = { 
			status_card: false,
			calendar_card: false 
		};
	}

	render() {
		return (
			<div className="main-navbar-vp absolute top-0 right-0 w-screen shadow-md flex flex-nowrap justify-between items-center bg-ub-grey text-ubt-grey text-sm select-none z-50">
				<div 
					tabIndex="0" 
					onClick={this.props.toggleActivities}
					className={'pl-3 pr-3 outline-none transition duration-100 ease-in-out border-b-2 border-transparent focus-accent-border py-1 flex items-center space-x-1.5 cursor-pointer select-none'}
					title="Workspace Indicator"
				>
					{/* Active Workspace Capsule */}
					<span className={`h-2 rounded-full transition-all duration-300 ${this.props.activities_overview ? 'w-4 bg-white/70' : 'w-7 bg-white'}`} />
					{/* Other Workspace Dot */}
					<span className="w-2 h-2 rounded-full bg-white opacity-40 hover:opacity-75 transition-all duration-300" />
				</div>
				<div 
					tabIndex="0" 
					onFocus={() => { this.setState({ calendar_card: true }); }}
					className={'relative pl-2 pr-2 text-xs md:text-sm outline-none transition duration-100 ease-in-out border-b-2 border-transparent focus-accent-border py-1 cursor-pointer'}
				>
					<Clock />
					<CalendarCard
						visible={this.state.calendar_card}
						toggleVisible={() => { this.setState({ calendar_card: false }); }}
					/>
				</div>
				<div
					id="status-bar"
					tabIndex="0"
					onFocus={() => { this.setState({ status_card: true }); }}
					className={'relative pr-3 pl-3 outline-none transition duration-100 ease-in-out border-b-2 border-transparent focus-accent-border py-1 '}
				>
					<Status />
					<StatusCard
						shutDown={this.props.shutDown}
						lockScreen={this.props.lockScreen}
						visible={this.state.status_card}
						toggleVisible={() => { this.setState({ status_card: false }); }}
						dark_mode={this.props.dark_mode}
						toggleDarkMode={this.props.toggleDarkMode}
					/>
				</div>
			</div>
		);
	}
}
