import React, { Component } from 'react';

export class Calc extends Component {
    constructor() {
        super();
        this.state = {
            expression: "",
            result: ""
        };
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        // Only trigger if we are inside the active app context
        const key = e.key;
        if (/[0-9]/.test(key)) {
            this.handleInput(key);
        } else if (['+', '-', '*', '/', '%', '.', '(', ')'].includes(key)) {
            this.handleInput(key);
        } else if (key === 'Enter' || key === '=') {
            this.calculate();
        } else if (key === 'Backspace') {
            this.handleDelete();
        } else if (key === 'Escape') {
            this.handleClear();
        }
    }

    handleInput = (val) => {
        this.setState((prevState) => {
            let expr = prevState.expression;
            
            // Prevent multiple consecutive operators
            const lastChar = expr.slice(-1);
            const operators = ['+', '-', '*', '/', '%', '.'];
            if (operators.includes(lastChar) && operators.includes(val)) {
                expr = expr.slice(0, -1);
            }
            
            return {
                expression: expr + val
            };
        });
    }

    handleClear = () => {
        this.setState({ expression: "", result: "" });
    }

    handleDelete = () => {
        this.setState((prevState) => ({
            expression: prevState.expression.slice(0, -1)
        }));
    }

    calculate = () => {
        try {
            let expr = this.state.expression;
            if (!expr) return;
            
            // Safe evaluation using standard JS eval with sanitized input
            // Only allow digits, standard operators, parentheses, and spaces
            const sanitized = expr.replace(/[^0-9+\-*/%().\s]/g, '');
            // eslint-disable-next-line no-eval
            let evalResult = eval(sanitized);
            
            if (evalResult === undefined || isNaN(evalResult)) {
                this.setState({ result: "Error" });
            } else {
                // Round to 8 decimal places if float
                if (evalResult % 1 !== 0) {
                    evalResult = parseFloat(evalResult.toFixed(8));
                }
                this.setState({ result: String(evalResult) });
            }
        } catch (err) {
            this.setState({ result: "Error" });
        }
    }

    render() {
        const buttons = [
            { label: "C", action: this.handleClear, className: "bg-red-500 hover:bg-red-600 text-white font-bold" },
            { label: "(", action: () => this.handleInput("("), className: "bg-gray-800 hover:bg-gray-700 text-gray-200" },
            { label: ")", action: () => this.handleInput(")"), className: "bg-gray-800 hover:bg-gray-700 text-gray-200" },
            { label: "÷", action: () => this.handleInput("/"), className: "bg-ub-orange hover:bg-orange-600 text-white font-bold" },
            
            { label: "7", action: () => this.handleInput("7"), className: "bg-gray-900 hover:bg-gray-800 text-white" },
            { label: "8", action: () => this.handleInput("8"), className: "bg-gray-900 hover:bg-gray-800 text-white" },
            { label: "9", action: () => this.handleInput("9"), className: "bg-gray-900 hover:bg-gray-800 text-white" },
            { label: "×", action: () => this.handleInput("*"), className: "bg-ub-orange hover:bg-orange-600 text-white font-bold" },
            
            { label: "4", action: () => this.handleInput("4"), className: "bg-gray-900 hover:bg-gray-800 text-white" },
            { label: "5", action: () => this.handleInput("5"), className: "bg-gray-900 hover:bg-gray-800 text-white" },
            { label: "6", action: () => this.handleInput("6"), className: "bg-gray-900 hover:bg-gray-800 text-white" },
            { label: "−", action: () => this.handleInput("-"), className: "bg-ub-orange hover:bg-orange-600 text-white font-bold" },
            
            { label: "1", action: () => this.handleInput("1"), className: "bg-gray-900 hover:bg-gray-800 text-white" },
            { label: "2", action: () => this.handleInput("2"), className: "bg-gray-900 hover:bg-gray-800 text-white" },
            { label: "3", action: () => this.handleInput("3"), className: "bg-gray-900 hover:bg-gray-800 text-white" },
            { label: "+", action: () => this.handleInput("+"), className: "bg-ub-orange hover:bg-orange-600 text-white font-bold" },
            
            { label: "0", action: () => this.handleInput("0"), className: "bg-gray-900 hover:bg-gray-800 text-white col-span-1" },
            { label: ".", action: () => this.handleInput("."), className: "bg-gray-900 hover:bg-gray-800 text-white" },
            { label: "⌫", action: this.handleDelete, className: "bg-gray-800 hover:bg-gray-700 text-white font-bold" },
            { label: "=", action: this.calculate, className: "bg-ub-orange hover:bg-orange-600 text-white font-bold" }
        ];

        return (
            <div className="h-full w-full flex flex-col bg-black p-4 select-none">
                {/* Calculator Screen */}
                <div className="h-24 flex flex-col justify-end items-end bg-gray-950 p-3 rounded-lg mb-3 border border-gray-900">
                    <div className="text-gray-500 text-sm overflow-x-auto whitespace-nowrap max-w-full tracking-wider scrollbar-none mb-1">
                        {this.state.expression || "0"}
                    </div>
                    <div className="text-white text-2xl font-bold overflow-x-auto whitespace-nowrap max-w-full scrollbar-none">
                        {this.state.result || "0"}
                    </div>
                </div>

                {/* Calculator Keypad */}
                <div className="flex-grow grid grid-cols-4 gap-2">
                    {buttons.map((btn, index) => (
                        <button
                            key={index}
                            onClick={btn.action}
                            className={`h-full text-base rounded-md transition-all duration-100 flex items-center justify-center outline-none ${btn.className} ${btn.label === "0" ? "" : ""}`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>
        )
    }
}

export default Calc;

export const displayTerminalCalc = () => {
    return <Calc> </Calc>;
}
