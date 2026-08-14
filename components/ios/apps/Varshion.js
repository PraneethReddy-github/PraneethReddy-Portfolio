import React, { useState, useEffect, useRef } from 'react';
import ReactGA from 'react-ga4';
import { fetchVarshionResponse } from '../../util components/varshionChat';

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
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
        }
    };

    const handlePromptClick = (promptText) => {
        setInput(promptText);
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.style.height = 'auto';
            setTimeout(() => {
                textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
            }, 0);
        }
    };

    const clearChat = () => {
        setMessages([]);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = input.trim();
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        
        const newHistory = [...messages, { role: 'user', content: userMsg }];
        setMessages(newHistory);
        setIsTyping(true);

        ReactGA.event({
            category: "Varshion Chat",
            action: `User asked: ${userMsg}`
        });

        try {
            const aiResponse = await fetchVarshionResponse(newHistory);
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

    // Helper to render basic formatting (bold, code, lines)
    const renderFormattedContent = (content) => {
        if (!content) return null;
        
        const lines = content.split('\n');
        return lines.map((line, lIdx) => {
            const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
            const formattedLine = parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={pIdx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
                } else if (part.startsWith('`') && part.endsWith('`')) {
                    return <code key={pIdx} className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-blue-300 font-mono">{part.slice(1, -1)}</code>;
                }
                return part;
            });

            return (
                <React.Fragment key={lIdx}>
                    {formattedLine}
                    {lIdx !== lines.length - 1 && <br />}
                </React.Fragment>
            );
        });
    };

    const suggestedPrompts = [
        { icon: "⚡", label: "Summarize Profile", query: "Summarize Praneeth's resume and background" },
        { icon: "📜", label: "Patents & Research", query: "What patents and IEEE research papers has he published?" },
        { icon: "🛠️", label: "Tech Stack & Skills", query: "What programming languages and cloud tools does he use?" },
        { icon: "🎓", label: "Education & Campus", query: "Tell me about his education, college, and club activities" }
    ];

    return (
        <div className="ios-font h-full w-full flex flex-col bg-[#020617] text-gray-100 overflow-hidden relative selection:bg-blue-500/30">
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[15%] -left-[15%] w-[70%] h-[50%] bg-blue-900/20 blur-[100px] rounded-full animate-blob"></div>
                <div className="absolute top-[25%] -right-[15%] w-[60%] h-[50%] bg-indigo-900/20 blur-[100px] rounded-full animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[15%] left-[10%] w-[65%] h-[50%] bg-purple-900/20 blur-[100px] rounded-full animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            </div>

            {/* iOS App Header */}
            <div className="flex-none flex items-center justify-between px-4 py-3 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 shadow-md z-10 relative">
                <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="relative flex-shrink-0">
                        <img src="./images/logos/varshion.png" alt="Varshion" className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20 shadow-md" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#020617] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    </div>
                    <div className="flex flex-col min-w-0 leading-tight">
                        <div className="flex items-center space-x-1.5 truncate">
                            <span className="text-[15px] font-semibold text-white tracking-tight truncate">Varshion AI</span>
                        </div>
                        <span className="text-[11px] text-gray-400 truncate">Praneeth's Portfolio Assistant</span>
                    </div>
                </div>

                {messages.length > 0 && (
                    <button 
                        onClick={clearChat}
                        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center space-x-1 flex-shrink-0 ml-2"
                        title="Clear conversation"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        <span className="text-[11px]">Reset</span>
                    </button>
                )}
            </div>

            {/* Chat Body */}
            <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden w-full px-3.5 py-4 scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent z-10 relative">
                <div className="w-full space-y-4">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.25)] border border-white/10">
                                <img src="./images/logos/varshion.png" alt="Varshion" className="w-10 h-10 object-cover rounded-xl shadow-inner" />
                            </div>
                            
                            <h1 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight">
                                Meet Varshion AI 👋
                            </h1>
                            <p className="text-xs text-gray-400 max-w-xs text-center mb-6 leading-relaxed px-2">
                                Ask anything about Praneeth's projects, patents, research papers, tech stack, or background!
                            </p>

                            {/* Quick Suggestion Grid for Mobile */}
                            <div className="grid grid-cols-1 gap-2.5 w-full max-w-xs">
                                {suggestedPrompts.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePromptClick(item.query)}
                                        className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/60 active:bg-slate-800 border border-white/10 active:border-blue-500/40 text-left transition-all duration-200 group shadow-sm"
                                    >
                                        <span className="text-base p-1.5 rounded-lg bg-white/5 group-hover:bg-blue-500/10 transition-colors flex-shrink-0">{item.icon}</span>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-semibold text-gray-200 group-hover:text-blue-400 transition-colors truncate">{item.label}</div>
                                            <div className="text-[11px] text-gray-400 truncate">{item.query}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 mr-2 flex-shrink-0 mt-0.5 shadow-sm">
                                        <img src="./images/logos/varshion.png" alt="Varshion" className="w-4 h-4 rounded-full object-cover" />
                                    </div>
                                )}
                                <div 
                                    className={`max-w-[85%] px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                                        msg.role === 'user' 
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[18px] rounded-br-[4px] shadow-blue-500/10' 
                                            : 'bg-slate-900/90 text-gray-200 rounded-[18px] rounded-bl-[4px] border border-white/10 backdrop-blur-md'
                                    }`}
                                >
                                    {renderFormattedContent(msg.content)}
                                </div>
                            </div>
                        ))
                    )}

                    {isTyping && (
                        <div className="flex w-full justify-start animate-in fade-in duration-300">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 mr-2 flex-shrink-0 mt-0.5 shadow-sm">
                                <img src="./images/logos/varshion.png" alt="Varshion" className="w-4 h-4 rounded-full object-cover opacity-80" />
                            </div>
                            <div className="bg-slate-900/90 px-3.5 py-3 rounded-[18px] rounded-bl-[4px] border border-white/10 backdrop-blur-md flex items-center space-x-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Controls & Input */}
            <div 
                className="flex-none w-full bg-[#020617]/90 backdrop-blur-xl border-t border-white/10 pt-2.5 px-3"
                style={{ zIndex: 10, position: 'relative', paddingBottom: '20px' }}
            >
                {messages.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-3 px-3 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
                        {suggestedPrompts.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handlePromptClick(item.query)}
                                className="flex-shrink-0 whitespace-nowrap text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/25 rounded-full px-2.5 py-1 active:bg-blue-500/20 transition-colors duration-200 font-medium"
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <div className="flex-1 flex items-end bg-slate-900/80 rounded-2xl border border-white/10 transition-colors duration-200 focus-within:border-blue-500/50 min-h-[42px]">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Varshion..."
                            className="w-full max-h-[140px] bg-transparent text-gray-100 placeholder-gray-500 py-2.5 px-3.5 outline-none resize-none scrollbar-thin scrollbar-thumb-slate-700 text-xs sm:text-sm leading-snug"
                            rows={1}
                            style={{ minHeight: '42px' }}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        aria-label="Send message"
                        className="flex-shrink-0 w-[38px] h-[38px] mb-[2px] rounded-xl flex items-center justify-center bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:bg-gray-800 disabled:text-gray-500 transition-all duration-200 active:scale-95 shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(20px, -30px) scale(1.08); }
                    66% { transform: translate(-15px, 15px) scale(0.92); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-in { animation-fill-mode: forwards; }
                .fade-in { animation-name: fade-in; }
                .slide-in-from-bottom-2 { animation-name: fade-in, slide-in-from-bottom-2; }
                .slide-in-from-bottom-4 { animation-name: fade-in, slide-in-from-bottom-4; }
                .animate-blob { animation: blob 15s infinite alternate ease-in-out; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}} />
        </div>
    );
}

export const displayVarshion = () => {
    return <Varshion />;
}
