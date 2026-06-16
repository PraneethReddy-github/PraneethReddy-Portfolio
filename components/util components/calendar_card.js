import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';

class CalendarCard extends Component {
    constructor() {
        super();
        this.state = {
            dnd: false,
            today: new Date(),
            viewDate: new Date(),
        };
    }

    handleClickOutside = () => {
        this.props.toggleVisible();
    };

    handlePrevMonth = (e) => {
        e.stopPropagation();
        this.setState((prevState) => {
            const newDate = new Date(prevState.viewDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return { viewDate: newDate };
        });
    };

    handleNextMonth = (e) => {
        e.stopPropagation();
        this.setState((prevState) => {
            const newDate = new Date(prevState.viewDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return { viewDate: newDate };
        });
    };

    render() {
        const { today, viewDate, dnd } = this.state;
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth(); // 0-indexed
        
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const dayShorts = ["S", "M", "T", "W", "T", "F", "S"];
        
        // Show current today's day/date at the top
        const todayDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
        const todayFormatted = `${monthNames[today.getMonth()]} ${today.getDate()} ${today.getFullYear()}`;

        // Get calendar days for the viewed month
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Days from previous month to fill the first week
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const prevMonthDays = [];
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            prevMonthDays.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false
            });
        }

        // Current month days
        const currentMonthDays = [];
        for (let i = 1; i <= daysInMonth; i++) {
            currentMonthDays.push({
                day: i,
                isCurrentMonth: true
            });
        }

        // Next month days to fill the grid (total 42 cells)
        const totalCells = prevMonthDays.length + currentMonthDays.length;
        const nextMonthDays = [];
        const remainingCells = 42 - totalCells;
        for (let i = 1; i <= remainingCells; i++) {
            nextMonthDays.push({
                day: i,
                isCurrentMonth: false
            });
        }

        const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

        return (
            <div className={"absolute bg-ub-cool-grey rounded-md top-9 left-1/2 transform -translate-x-1/2 shadow-2xl border border-black border-opacity-30 text-white flex p-4 z-50 transition-all duration-300 ease-out calendar-card-panel " + (this.props.visible ? ' opacity-100 scale-100 visible' : ' opacity-0 scale-95 pointer-events-none invisible')} style={{ width: '560px' }}>
                {/* Left Side: Notifications */}
                <div className="w-1/2 flex flex-col justify-between pr-4 border-r border-gray-800">
                    <div className="flex-grow flex flex-col px-2 py-4 space-y-3 overflow-y-auto">
                        <div className="bg-gray-800 bg-opacity-60 rounded-md p-3 border border-gray-700 relative group">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white">
                                            <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
                                            <path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-200">System Hint</span>
                                </div>
                                <span className="text-[10px] text-gray-400">Just now</span>
                            </div>
                            <p className="text-xs text-gray-300 leading-tight">Curious about a different perspective? Try shrinking your browser window or viewing this portfolio on a mobile device for a surprise!</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-300">Do Not Disturb</span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); this.setState({ dnd: !dnd }); }}
                                className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-200 focus:outline-none flex items-center ${dnd ? 'bg-ub-orange justify-end' : 'bg-gray-600 justify-start'}`}
                            >
                                <div className="w-3 h-3 rounded-full bg-white" />
                            </button>
                        </div>
                        <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-xs rounded transition border border-transparent hover:border-gray-600">Clear</button>
                    </div>
                </div>

                {/* Right Side: Calendar */}
                <div className="w-1/2 pl-4 flex flex-col justify-between">
                    <div>
                        <div className="text-gray-400 text-xs">{todayDayName}</div>
                        <div className="text-lg font-bold mb-3">{todayFormatted}</div>
                        
                        {/* Month / Navigation */}
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-xs text-gray-300 font-medium">{monthNames[month]} {year}</span>
                            <div className="flex space-x-3 text-gray-400 text-xs">
                                <button onClick={this.handlePrevMonth} className="hover:text-white px-1.5 py-0.5 bg-gray-800 hover:bg-gray-700 rounded transition">&lt;</button>
                                <button onClick={this.handleNextMonth} className="hover:text-white px-1.5 py-0.5 bg-gray-800 hover:bg-gray-700 rounded transition">&gt;</button>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {dayShorts.map((d, index) => (
                                <div key={index} className="text-gray-500 font-bold py-1">{d}</div>
                            ))}
                            {allDays.map((cell, index) => {
                                const isToday = cell.isCurrentMonth && 
                                                cell.day === today.getDate() && 
                                                month === today.getMonth() && 
                                                year === today.getFullYear();
                                return (
                                    <div 
                                        key={index} 
                                        className={`py-1 rounded-full flex items-center justify-center h-6 w-6 mx-auto ${
                                            isToday 
                                                ? 'bg-ub-orange text-white font-bold' 
                                                : cell.isCurrentMonth 
                                                    ? 'text-gray-200 hover:bg-gray-800 cursor-pointer' 
                                                    : 'text-gray-600'
                                        }`}
                                    >
                                        {cell.day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-800">
                        <div className="text-xs text-gray-400 font-bold mb-1">Today</div>
                        <div className="text-xs text-gray-500 italic mb-2">No Events</div>
                        <div className="text-xs text-gray-400 hover:text-white cursor-pointer transition">Add world clocks...</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default onClickOutside(CalendarCard);
