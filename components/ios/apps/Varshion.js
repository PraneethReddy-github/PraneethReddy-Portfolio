import React, { useState, useEffect, useRef } from 'react';
import ReactGA from 'react-ga4';

export default function Varshion() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleInput = (e) => {
        setInput(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    };

    const handlePromptClick = (promptText) => {
        setInput(promptText);
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.style.height = 'auto';
            setTimeout(() => {
                textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
            }, 0);
        }
    };

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        ReactGA.event({
            category: "Varshion Chat",
            action: `User asked: ${userMsg}`
        });

        try {
            const apiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL;
            let aiResponse = "";

            if (apiUrl) {
                const chatHistory = [...messages, { role: 'user', content: userMsg }].slice(-10);
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: chatHistory })
                });

                if (!response.ok) throw new Error('API error');
                const data = await response.json();
                aiResponse = data.response || "I received your message, but the server didn't send a valid response.";
            } else {
                await new Promise(resolve => setTimeout(resolve, 2000));
                aiResponse = "I'm currently running in demo mode. Please connect my FastAPI backend to enable full capabilities. You can configure the `NEXT_PUBLIC_CHAT_API_URL` environment variable.";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        } catch (error) {
            console.error("Chat API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "I'm having trouble connecting to my knowledge base right now. Please try again later." 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestedQuestions = [
        "Summarize the resume",
        "Where did Praneeth go to school?",
        "What does he do for fun?"
    ];

    return (
        <div className="ios-font h-full w-full flex flex-col bg-[#0a0f1e] text-gray-100 overflow-hidden relative selection:bg-[#0A84FF]/30">
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[#0A84FF]/5 blur-[120px] rounded-full"></div>
            </div>

            <div
                className="flex-none flex items-center gap-3 px-4 py-2.5 bg-[#0a0f1e]/70 backdrop-blur-2xl border-b border-white/10"
                style={{ zIndex: 2, position: 'relative' }}
            >
                <div className="relative flex-shrink-0">
                    <img
                        src="./images/logos/varshion.png"
                        alt="Varshion"
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10"
                    />
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-[16px] font-semibold text-white tracking-tight truncate">Varshion</span>
                    <span className="text-[12px] text-gray-400 font-medium">AI assistant</span>
                </div>
            </div>

            <div
                ref={chatContainerRef}
                className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden w-full px-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                style={{ zIndex: 1, position: 'relative' }}
            >
                <div className="w-full pt-4 pb-2">

                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center min-h-[45vh] animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out text-center">
                            <div className="w-20 h-20 mb-5 rounded-full bg-gradient-to-br from-[#0A84FF]/25 to-[#5E5CE6]/25 flex items-center justify-center shadow-[0_0_40px_rgba(10,132,255,0.2)] border border-white/10">
                                <img src="./images/logos/varshion.png" alt="Varshion" className="w-12 h-12 object-cover rounded-full" />
                            </div>
                            <h1 className="text-[22px] font-semibold text-white tracking-tight px-6">
                                Curious about Praneeth?
                            </h1>
                            <p className="text-[15px] text-gray-400 mt-1.5 px-8">
                                Ask me anything and I&apos;ll answer.
                            </p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex w-full items-end gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                                msg.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            {msg.role === 'assistant' && (
                                <img src="./images/logos/varshion.png" alt="Varshion" className="w-6 h-6 rounded-full object-cover flex-shrink-0 mb-0.5 ring-1 ring-white/10" />
                            )}
                            <div
                                className={`max-w-[78%] px-4 py-2.5 text-[15px] leading-[1.4] break-words ${
                                    msg.role === 'user'
                                        ? 'text-white rounded-[20px] rounded-br-[6px] shadow-[0_2px_10px_rgba(10,132,255,0.25)]'
                                        : 'bg-[#1c1f2b] text-gray-100 rounded-[20px] rounded-bl-[6px] border border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.25)]'
                                }`}
                                style={
                                    msg.role === 'user'
                                        ? { background: 'linear-gradient(180deg, #0A84FF 0%, #0061cf 100%)' }
                                        : undefined
                                }
                            >
                                {msg.content.split('\n').map((text, i) => (
                                    <React.Fragment key={i}>
                                        {text}
                                        {i !== msg.content.split('\n').length - 1 && <br />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex w-full items-end gap-2 mb-1.5 justify-start animate-in fade-in duration-300">
                            <img src="./images/logos/varshion.png" alt="Varshion" className="w-6 h-6 rounded-full object-cover flex-shrink-0 mb-0.5 opacity-80" />
                            <div className="bg-[#1c1f2b] px-4 py-3.5 rounded-[20px] rounded-bl-[6px] border border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.25)] flex items-center space-x-1.5">
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div className="h-2" />
                </div>
            </div>

            <div
                className="flex-none w-full bg-[#0a0f1e]/80 backdrop-blur-2xl border-t border-white/10 px-3 pt-2.5"
                style={{ zIndex: 2, position: 'relative', paddingBottom: '22px' }}
            >
                {messages.length === 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2.5 -mx-3 px-3 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {suggestedQuestions.map((question, i) => (
                            <button
                                key={i}
                                onClick={() => handlePromptClick(question)}
                                className="flex-shrink-0 whitespace-nowrap text-[14px] text-[#0A84FF] bg-[#0A84FF]/10 border border-[#0A84FF]/25 rounded-full px-3.5 py-1.5 active:bg-[#0A84FF]/20 transition-colors duration-200 font-medium"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <div className="flex-1 flex items-end bg-[#1c1f2b] rounded-full border border-white/10 transition-colors duration-200 focus-within:border-[#0A84FF]/60 min-h-[40px]">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Message"
                            className="w-full max-h-[120px] bg-transparent text-gray-100 placeholder-gray-500 py-2 px-4 outline-none resize-none scrollbar-thin scrollbar-thumb-white/10 text-[16px] leading-snug"
                            rows={1}
                            style={{ minHeight: '40px' }}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        aria-label="Send message"
                        className="flex-shrink-0 w-[34px] h-[34px] mb-[3px] rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 active:scale-95"
                        style={{
                            background: (!input.trim() || isTyping) ? '#2c2c2e' : 'linear-gradient(180deg, #0A84FF 0%, #0066d6 100%)'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="19" x2="12" y2="5"></line>
                            <polyline points="5 12 12 5 19 12"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-in-from-bottom-2 { from { transform: translateY(0.5rem); } to { transform: translateY(0); } }
                @keyframes slide-in-from-bottom-4 { from { transform: translateY(1rem); } to { transform: translateY(0); } }
                .animate-in { animation-fill-mode: forwards; }
                .fade-in { animation-name: fade-in; }
                .slide-in-from-bottom-2 { animation-name: fade-in, slide-in-from-bottom-2; }
                .slide-in-from-bottom-4 { animation-name: fade-in, slide-in-from-bottom-4; }
            `}} />
        </div>
    );
}

export const displayVarshion = () => {
    return <Varshion />;
}
