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
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
        }
    };

    const handlePromptClick = (promptText) => {
        setInput(promptText);
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.style.height = 'auto';
            setTimeout(() => {
                textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
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
                await new Promise(resolve => setTimeout(resolve, 1500));
                aiResponse = "I'm currently running in demo mode. Please connect my FastAPI backend to enable full capabilities.";
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

    // Helper to render basic formatting (bold, code, lines)
    const renderFormattedContent = (content) => {
        if (!content) return null;
        
        const lines = content.split('\n');
        return lines.map((line, lIdx) => {
            // Process bold formatting **text**
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
        <div className="flex flex-col h-full w-full bg-[#020617] text-gray-100 font-sans overflow-hidden relative selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[55%] h-[55%] bg-blue-900/15 blur-[120px] rounded-full animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-[45%] h-[45%] bg-indigo-900/15 blur-[120px] rounded-full animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-purple-900/15 blur-[120px] rounded-full animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* Header */}
            <div className="flex-none flex items-center justify-between px-4 py-3 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 shadow-md z-10 relative">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <img src="./images/logos/varshion.png" alt="Varshion" className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20 shadow-md" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#020617] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-sm font-semibold tracking-wide text-white">Varshion AI</h2>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Groq Llama 3.1</span>
                        </div>
                        <p className="text-[11px] text-gray-400">Praneeth Reddy's Portfolio Assistant</p>
                    </div>
                </div>

                {messages.length > 0 && (
                    <button 
                        onClick={clearChat}
                        className="text-xs text-gray-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center space-x-1"
                        title="Clear conversation"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        <span className="hidden sm:inline">Reset</span>
                    </button>
                )}
            </div>

            {/* Chat Area — Fixed padding for unmaximized windows */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto w-full px-4 sm:px-6 md:px-8 py-6 scrollbar-thin scrollbar-thumb-slate-700/50 scrollbar-track-transparent z-10 relative">
                <div className="max-w-3xl mx-auto w-full space-y-6">
                    
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-20 h-20 mb-5 rounded-2xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)] border border-white/10">
                                <img src="./images/logos/varshion.png" alt="Varshion" className="w-12 h-12 object-cover rounded-xl shadow-inner" />
                            </div>
                            
                            <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight text-center">
                                Meet Varshion AI 👋
                            </h1>
                            <p className="text-sm text-gray-400 max-w-md text-center mb-8 leading-relaxed">
                                Ask anything about Praneeth's projects, patents, research papers, tech stack, or professional background!
                            </p>

                            {/* Quick Suggestion Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                                {suggestedPrompts.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePromptClick(item.query)}
                                        className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-blue-500/40 text-left transition-all duration-300 group shadow-sm"
                                    >
                                        <span className="text-lg p-2 rounded-lg bg-white/5 group-hover:bg-blue-500/10 transition-colors">{item.icon}</span>
                                        <div>
                                            <div className="text-xs font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">{item.label}</div>
                                            <div className="text-[11px] text-gray-400 truncate max-w-[180px]">{item.query}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 mr-3 flex-shrink-0 mt-1 shadow-sm">
                                        <img src="./images/logos/varshion.png" alt="Varshion" className="w-5 h-5 rounded object-cover" />
                                    </div>
                                )}
                                <div 
                                    className={`max-w-[88%] sm:max-w-[80%] px-4 sm:px-5 py-3.5 text-sm sm:text-[15px] leading-relaxed shadow-md ${
                                        msg.role === 'user' 
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-xs shadow-blue-500/10' 
                                            : 'bg-slate-900/80 text-gray-200 rounded-2xl rounded-tl-xs border border-white/10 backdrop-blur-md'
                                    }`}
                                >
                                    {renderFormattedContent(msg.content)}
                                </div>
                            </div>
                        ))
                    )}

                    {isTyping && (
                        <div className="flex w-full justify-start animate-in fade-in duration-300">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 mr-3 flex-shrink-0 mt-1 shadow-sm">
                                <img src="./images/logos/varshion.png" alt="Varshion" className="w-5 h-5 rounded object-cover opacity-80" />
                            </div>
                            <div className="bg-slate-900/80 px-4 py-3.5 rounded-2xl rounded-tl-xs border border-white/10 backdrop-blur-md flex items-center space-x-1.5">
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area — Fixed horizontal margins and padding */}
            <div className="flex-none w-full bg-[#020617]/90 backdrop-blur-xl border-t border-white/10 py-3 px-4 sm:px-6 md:px-8 z-20 relative">
                <div className="max-w-3xl mx-auto w-full">
                    <div className="relative flex items-end bg-slate-900/70 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-lg focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all duration-300">
                        <textarea 
                            ref={textareaRef}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Varshion about Praneeth's experience, projects..."
                            className="w-full max-h-[180px] bg-transparent text-gray-100 py-3.5 pl-4 pr-12 outline-none resize-none scrollbar-thin scrollbar-thumb-slate-700 text-sm leading-relaxed"
                            rows={1}
                            style={{ minHeight: '50px' }}
                        />
                        
                        <div className="absolute right-2 bottom-2">
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:bg-gray-800 disabled:text-gray-500 transition-all duration-200 shadow-md flex items-center justify-center active:scale-95"
                                title="Send Message"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-in-from-bottom-2 { from { transform: translateY(0.5rem); } to { transform: translateY(0); } }
                @keyframes slide-in-from-bottom-4 { from { transform: translateY(1rem); } to { transform: translateY(0); } }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -40px) scale(1.08); }
                    66% { transform: translate(-20px, 20px) scale(0.92); }
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
