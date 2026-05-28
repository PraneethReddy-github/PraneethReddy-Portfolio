import { Component } from 'react'

export default class Clock extends Component {
    constructor() {
        super();
        this.month_list = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.day_list = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        this.state = {
            hour_12: true,
            time_zone: 'Local',
            current_time: new Date(),
            mounted: false
        };
    }

    componentDidMount() {
        const savedFormat = localStorage.getItem('time-format');
        const savedZone = localStorage.getItem('time-zone');
        
        this.setState({
            mounted: true,
            current_time: new Date(),
            hour_12: savedFormat !== null ? savedFormat === '12' : true,
            time_zone: savedZone !== null ? savedZone : 'Local'
        });

        // Listen for changes from the Settings app
        window.addEventListener('portfolio-settings-changed', this.handleSettingsChange);

        this.update_time = setInterval(() => {
            this.setState({ current_time: new Date() });
        }, 10 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.update_time);
        window.removeEventListener('portfolio-settings-changed', this.handleSettingsChange);
    }

    handleSettingsChange = (e) => {
        if (e.detail.key === 'time-format') {
            this.setState({ hour_12: e.detail.value === '12' });
        }
        if (e.detail.key === 'time-zone') {
            this.setState({ time_zone: e.detail.value });
        }
    }

    render() {
        if (!this.state.mounted) {
            return <span suppressHydrationWarning={true}></span>;
        }

        const { current_time } = this.state;

        let options = {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: this.state.hour_12 ? 'numeric' : '2-digit', 
            minute: '2-digit', 
            hour12: this.state.hour_12
        };
        if (this.state.time_zone && this.state.time_zone !== 'Local') {
            options.timeZone = this.state.time_zone;
        }

        let parts;
        try {
            parts = new Intl.DateTimeFormat('en-US', options).formatToParts(current_time);
        } catch (error) {
            // Fallback if timezone is invalid
            options.timeZone = undefined;
            parts = new Intl.DateTimeFormat('en-US', options).formatToParts(current_time);
        }

        const p = {};
        parts.forEach(part => p[part.type] = part.value);

        // Native Intl sometimes gives "24" instead of "00" for hour12: false, so we fix it if needed,
        // but 'en-US' with hourCycle: h23 handles 00-23
        const timeString = `${p.hour}:${p.minute}${p.dayPeriod ? ' ' + p.dayPeriod : ''}`;

        let display_time;
        if (this.props.onlyTime) {
            display_time = timeString;
        }
        else if (this.props.onlyDay) {
            display_time = `${p.weekday} ${p.month} ${p.day}`;
        }
        else display_time = `${p.weekday} ${p.month} ${p.day} ${timeString}`;
        
        return <span>{display_time}</span>;
    }
}
