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

    return (
        <div className="flex flex-col h-full w-full bg-[#020617] text-gray-100 font-sans overflow-hidden relative selection:bg-blue-500/30">
            {/* Minimal Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/10 blur-[100px] rounded-full animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-900/10 blur-[100px] rounded-full animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-indigo-900/10 blur-[100px] rounded-full animate-blob animation-delay-4000"></div>
            </div>

            {/* Header — static flex-none, not absolute */}
            <div className="flex-none flex items-center justify-center p-4 bg-[#020617]/40 backdrop-blur-md border-b border-white/5 shadow-sm" style={{ zIndex: 1, position: 'relative' }}>
                <div className="flex items-center space-x-2">
                    <img src="./images/logos/varshion.png" alt="Varshion" className="w-6 h-6 rounded-md object-cover shadow-lg" />
                    <h2 className="text-sm font-medium tracking-wide text-gray-200">Varshion AI</h2>
                    <div className="flex items-center justify-center w-4 h-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                    </div>
                </div>
            </div>

            {/* Chat Area — flex-1 with its own scroll */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto w-full px-4 md:px-0 scrollbar-thin scrollbar-thumb-gray-700/50 scrollbar-track-transparent" style={{ zIndex: 1, position: 'relative' }}>
                <div className="max-w-[850px] mx-auto w-full space-y-8 py-8">
                    
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                            <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] border border-white/5">
                                <img src="./images/logos/varshion.png" alt="Varshion" className="w-10 h-10 object-cover rounded-xl" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight text-center">
                                Curious about Praneeth? Ask away!
                            </h1>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-white/5 mr-4 flex-shrink-0 mt-1">
                                        <img src="./images/logos/varshion.png" alt="Varshion" className="w-5 h-5 rounded object-cover" />
                                    </div>
                                )}
                                <div 
                                    className={`max-w-[85%] md:max-w-[75%] px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-blue-600/90 hover:bg-blue-600 text-white rounded-[20px] rounded-tr-[4px] backdrop-blur-sm' 
                                            : 'bg-[#111827]/80 text-gray-200 rounded-[20px] rounded-tl-[4px] border border-white/5 backdrop-blur-md'
                                    }`}
                                >
                                    {msg.content.split('\n').map((text, i) => (
                                        <React.Fragment key={i}>
                                            {text}
                                            {i !== msg.content.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}

                    {isTyping && (
                        <div className="flex w-full justify-start animate-in fade-in duration-300">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center border border-white/5 mr-4 flex-shrink-0 mt-1">
                                <img src="./images/logos/varshion.png" alt="Varshion" className="w-5 h-5 rounded object-cover opacity-70" />
                            </div>
                            <div className="bg-[#111827]/60 px-5 py-4 rounded-2xl border border-white/5 backdrop-blur-md flex items-center space-x-1.5 h-[52px]">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    )}
                    <div className="h-4" />
                </div>
            </div>

            {/* Input Area — static flex-none, not absolute */}
            <div className="flex-none w-full bg-[#020617] border-t border-white/5 pt-3 pb-4 px-4" style={{ zIndex: 2, position: 'relative' }}>
                <div className="max-w-[800px] mx-auto">
                    
                    {/* Floating Questions */}
                    {messages.length === 0 && (
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-3">
                            {[
                                "Summarize the resume",
                                "Where did Praneeth do his schooling?",
                                "What does he do in his free time?"
                            ].map((question, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePromptClick(question)}
                                    className="text-[13px] text-gray-400 hover:text-white transition-colors duration-300 hover:underline underline-offset-4 decoration-white/30 tracking-wide font-medium"
                                >
                                    "{question}"
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex items-end bg-[#1e293b]/50 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 focus-within:bg-[#1e293b]/70 focus-within:border-blue-500/30">
                        
                        <div className="w-4"></div> {/* padding-left replacing attachment icon */}

                        <textarea 
                            ref={textareaRef}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything about Praneeth..."
                            className="w-full max-h-[200px] bg-transparent text-gray-100 py-4 px-2 outline-none resize-none scrollbar-thin scrollbar-thumb-gray-600 text-[15px] leading-relaxed"
                            rows={1}
                            style={{ minHeight: '56px' }}
                        />
                        
                        <div className="flex items-center justify-center h-[56px] pr-3 pl-2">
                            {isTyping ? (
                                <button 
                                    onClick={() => {}}
                                    className="p-2.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
                                >
                                    <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                                </button>
                            ) : (
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="p-2.5 rounded-full bg-white text-black hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:bg-white disabled:text-black transition-all duration-300 shadow-md flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                                </button>
                            )}
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
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
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
