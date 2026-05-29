import React, { Component } from 'react';
import ReactGA from 'react-ga4';
import emailjs from '@emailjs/browser';

export class Gedit extends Component {
    constructor() {
        super();
        this.state = {
            step: 0, // 0: Name, 1: Subject, 2: Message, 3: Confirm, 4: Sending, 5: Success/Done
            name: '',
            subject: '',
            message: '',
            confirmInput: '',
            terminalLogs: [],
            countdown: 0
        }
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        if (process.env.NEXT_PUBLIC_USER_ID) {
            emailjs.init(process.env.NEXT_PUBLIC_USER_ID);
        }
        this.focusInput();
    }

    componentWillUnmount() {
        if (this.closeTimer) {
            clearInterval(this.closeTimer);
        }
    }

    componentDidUpdate() {
        this.focusInput();
        // Scroll to bottom of terminal content automatically
        const terminal = document.getElementById("sendmail-terminal");
        if (terminal) {
            terminal.scrollTop = terminal.scrollHeight;
        }
    }

    focusInput = () => {
        if (this.inputRef.current) {
            this.inputRef.current.focus();
        }
    }

    handleInputChange = (e) => {
        const value = e.target.value;
        const { step } = this.state;
        if (step === 0) this.setState({ name: value });
        else if (step === 1) this.setState({ subject: value });
        else if (step === 2) this.setState({ message: value });
        else if (step === 3) this.setState({ confirmInput: value });
    }

    handleKeyDown = (e, isTextArea = false) => {
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            this.abortDispatch();
            return;
        }

        if (e.key === 'Enter') {
            if (isTextArea && e.shiftKey) return;
            e.preventDefault();
            this.advanceStep();
        }
    }

    abortDispatch = () => {
        if (this.closeTimer) {
            clearInterval(this.closeTimer);
        }

        this.setState(prevState => ({
            terminalLogs: [
                ...prevState.terminalLogs,
                "^C",
                "Session aborted by user. [SIGINT]",
                "Exiting mail client... [rc=130]"
            ],
            step: 5,
            countdown: 0
        }));

        setTimeout(() => {
            const closeBtn = document.getElementById("close-gedit");
            if (closeBtn) closeBtn.click();
        }, 2000);
    }

    advanceStep = () => {
        const { step, name, subject, message, confirmInput } = this.state;
        
        if (step === 0) {
            if (!name.trim()) return;
            this.setState({ step: 1 });
        } else if (step === 1) {
            if (!subject.trim()) return;
            this.setState({ step: 2 });
        } else if (step === 2) {
            if (!message.trim()) return;
            this.setState({ step: 3 });
        } else if (step === 3) {
            const cmd = confirmInput.toLowerCase().trim();
            if (cmd === 'y' || cmd === 'yes') {
                this.setState({ step: 4 }, this.transmitMail);
            } else if (cmd === 'n' || cmd === 'no') {
                this.setState({
                    step: 0,
                    name: '',
                    subject: '',
                    message: '',
                    confirmInput: ''
                });
            } else {
                this.setState({ confirmInput: '' }); 
            }
        }
    }

    transmitMail = async () => {
        const { name, subject, message } = this.state;
        
        // Simulated SMTP server logs
        const logs = [
            "Initializing connection to SMTP relay...",
            "Resolving MX records for gmail.com... [OK]",
            "Connecting to connectwithpraneeth@gmail.com server... [OK]",
            "Sending message credentials...",
            "Transmitting packet payload..."
        ];

        for (let i = 0; i < logs.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            this.setState(prevState => ({
                terminalLogs: [...prevState.terminalLogs, logs[i]]
            }));
        }

        const serviceID = process.env.NEXT_PUBLIC_SERVICE_ID;
        const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
        const userID = process.env.NEXT_PUBLIC_USER_ID;

        // Check if environment variables are configured
        if (!serviceID || !templateID || !userID) {
            await new Promise(resolve => setTimeout(resolve, 300));
            this.setState(prevState => ({
                terminalLogs: [
                    ...prevState.terminalLogs,
                    "CRITICAL ERROR: Environment configuration variables missing.",
                    "Please configure NEXT_PUBLIC_USER_ID, SERVICE_ID, and TEMPLATE_ID in .env.local",
                    "For details, read: /home/praneeth/Portfolio/Praneeth-Portfolio/README.md",
                    "Mail delivery failed. [rc=3]"
                ],
                step: 5
            }));
            return;
        }

        // Rate limit: 1 message per 3 minutes (180000 ms)
        if (typeof window !== 'undefined') {
            const lastSent = localStorage.getItem("last-msg-sent-time");
            if (lastSent) {
                const elapsed = Date.now() - parseInt(lastSent);
                const cooldown = 180000;
                if (elapsed < cooldown) {
                    const remaining = Math.ceil((cooldown - elapsed) / 1000);
                    this.setState(prevState => ({
                        terminalLogs: [
                            ...prevState.terminalLogs,
                            `CRITICAL EXCEPTION: Rate limit cooldown active.`,
                            `Please wait ${remaining} seconds before sending another message.`,
                            `Mail delivery aborted. [rc=1]`
                        ],
                        step: 5
                    }));
                    return;
                }
            }
        }

        const templateParams = {
            'name': name.trim(),
            'email': name.trim(), // Maps to input name/email to populate the template's Reply-To field
            'subject': subject.trim(),
            'message': message.trim(),
        }

        try {
            await emailjs.send(serviceID, templateID, templateParams);
            
            if (typeof window !== 'undefined') {
                localStorage.setItem("last-msg-sent-time", Date.now().toString());
            }

            // Track GA event
            ReactGA.event({
                category: "Send Message",
                action: `${name}, ${subject}, ${message}`
            });

            this.setState(prevState => ({
                terminalLogs: [
                    ...prevState.terminalLogs,
                    "SMTP Server response: 250 OK - Message accepted for delivery.",
                    "Message successfully dispatched! [OK]",
                    "Direct copy stored in logs: connectwithpraneeth@gmail.com",
                    "Closing mail client connection... [rc=0]"
                ],
                step: 5,
                countdown: 4
            }));

            // Close app window after a real-time countdown
            this.closeTimer = setInterval(() => {
                this.setState(prevState => {
                    if (prevState.countdown <= 1) {
                        clearInterval(this.closeTimer);
                        const closeBtn = document.getElementById("close-gedit");
                        if (closeBtn) closeBtn.click();
                        return { countdown: 0 };
                    }
                    return { countdown: prevState.countdown - 1 };
                });
            }, 1000);

        } catch (err) {
            this.setState(prevState => ({
                terminalLogs: [
                    ...prevState.terminalLogs,
                    "CRITICAL ERROR: Failed to route to SMTP server.",
                    "Please send email directly to: connectwithpraneeth@gmail.com",
                    "Mail delivery failed. [rc=2]"
                ],
                step: 5
            }));
        }
    }

    render() {
        const { step, name, subject, message, confirmInput, terminalLogs } = this.state;
        
        return (
            <div 
                onClick={this.focusInput}
                id="sendmail-terminal"
                className="w-full h-full bg-[#1c0817] text-[#dfdbd2] font-mono p-4 overflow-y-auto select-text text-xs md:text-sm leading-relaxed"
            >
                {/* Header Comments */}
                <div className="text-[#8c6081] select-none mb-4">
                    <p># SMTP Mail Dispatch Client (v1.4.2-release)</p>
                    <p># Destination Address: connectwithpraneeth@gmail.com</p>
                    <p># Press Ctrl+C or close the window to abort dispatch.</p>
                    <p># ----------------------------------------------------</p>
                </div>

                <div className="space-y-3">
                    {/* Command invocation */}
                    <div className="flex items-center space-x-2">
                        <span className="text-[#8ae234] font-bold">praneeth@ubuntu:~$</span>
                        <span>mail -t connectwithpraneeth@gmail.com</span>
                    </div>

                    {/* Step 0: Name Input */}
                    {step >= 0 && (
                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                            <span className="text-orange-400 font-semibold select-none">[1] From (Name / Email):</span>
                            {step > 0 ? (
                                <span className="text-white font-medium">{name}</span>
                            ) : (
                                <div className="flex items-center flex-grow">
                                    <input 
                                        ref={this.inputRef}
                                        type="text"
                                        value={name}
                                        onChange={this.handleInputChange}
                                        onKeyDown={this.handleKeyDown}
                                        className="bg-transparent text-white outline-none border-none p-0 flex-grow font-medium"
                                        autoFocus
                                        spellCheck={false}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 1: Subject Input */}
                    {step >= 1 && (
                        <div className="flex flex-col md:flex-row md:items-center gap-1">
                            <span className="text-orange-400 font-semibold select-none">[2] Subject:</span>
                            {step > 1 ? (
                                <span className="text-white font-medium">{subject}</span>
                            ) : (
                                <div className="flex items-center flex-grow">
                                    <input 
                                        ref={this.inputRef}
                                        type="text"
                                        value={subject}
                                        onChange={this.handleInputChange}
                                        onKeyDown={this.handleKeyDown}
                                        className="bg-transparent text-white outline-none border-none p-0 flex-grow font-medium"
                                        spellCheck={false}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Message Input */}
                    {step >= 2 && (
                        <div className="flex flex-col gap-1">
                            <span className="text-orange-400 font-semibold select-none">[3] Message Body:</span>
                            {step > 2 ? (
                                <p className="text-white bg-[#2e1227] p-2 rounded border border-purple-950/20 whitespace-pre-wrap">{message}</p>
                            ) : (
                                <div className="flex items-start flex-grow">
                                    <span className="text-[#8ae234] mr-2">&gt;</span>
                                    <textarea 
                                        ref={this.inputRef}
                                        value={message}
                                        onChange={this.handleInputChange}
                                        onKeyDown={(e) => this.handleKeyDown(e, true)}
                                        rows={4}
                                        className="bg-transparent text-white outline-none border-none p-0 flex-grow resize-none font-medium h-24"
                                        spellCheck={false}
                                        placeholder="(Press Enter to submit, Shift+Enter for new line)"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step >= 3 && (
                        <div className="flex flex-col gap-2 pt-2 border-t border-purple-950/30">
                            <div className="text-amber-400 font-semibold select-none">Confirm Message Dispatch? (y/n):</div>
                            {step > 3 ? (
                                <span className="text-white font-medium">{confirmInput}</span>
                            ) : (
                                <div className="flex items-center">
                                    <span className="text-orange-400 mr-2 select-none">Choice:</span>
                                    <input 
                                        ref={this.inputRef}
                                        type="text"
                                        maxLength={3}
                                        value={confirmInput}
                                        onChange={this.handleInputChange}
                                        onKeyDown={this.handleKeyDown}
                                        className="bg-transparent text-white outline-none border-none p-0 w-16 font-medium capitalize"
                                        spellCheck={false}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4 & 5: Logs Output */}
                    {terminalLogs.length > 0 && (
                        <div className="space-y-1.5 pt-4 border-t border-purple-950/30 select-none text-[11px] md:text-xs">
                            {terminalLogs.map((log, index) => {
                                const isError = log.includes("ERROR") || log.includes("failed") || log.includes("EXCEPTION");
                                const isOk = log.includes("[OK]") || log.includes("success") || log.includes("response");
                                const colorClass = isError ? "text-red-500 font-bold" : isOk ? "text-[#8ae234] font-semibold" : "text-gray-400";
                                return (
                                    <p key={index} className={colorClass}>
                                        &gt;&gt;&gt; {log}
                                    </p>
                                );
                            })}
                        </div>
                    )}

                    {/* Step 5 Autoclose Indicator */}
                    {step === 5 && this.state.countdown > 0 && (
                        <p className="text-amber-500 font-bold animate-pulse text-[11px] md:text-xs pt-2 select-none">
                            &gt;&gt;&gt; Closing window in {this.state.countdown} second{this.state.countdown !== 1 ? 's' : ''}...
                        </p>
                    )}
                </div>
            </div>
        )
    }
}

export default Gedit;

export const displayGedit = () => {
    return <Gedit> </Gedit>;
}
