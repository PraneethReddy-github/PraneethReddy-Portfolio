import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const ACCENT = '#007AFF';
const COOLDOWN = 180000; // 3 min, matches the desktop mailer

export default function MailApp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | sent | error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_USER_ID) emailjs.init(process.env.NEXT_PUBLIC_USER_ID);
    }, []);

    const valid = name.trim() && /\S+@\S+\.\S+/.test(email) && subject.trim() && message.trim();

    const send = async () => {
        if (!valid || status === 'sending') return;

        const serviceID = process.env.NEXT_PUBLIC_SERVICE_ID;
        const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
        const userID = process.env.NEXT_PUBLIC_USER_ID;
        if (!serviceID || !templateID || !userID) {
            setStatus('error');
            setErrorMsg('Mail service is not configured. Please email connectwithpraneeth@gmail.com directly.');
            return;
        }

        const lastSent = typeof window !== 'undefined' ? localStorage.getItem('last-msg-sent-time') : null;
        if (lastSent && Date.now() - parseInt(lastSent) < COOLDOWN) {
            const remaining = Math.ceil((COOLDOWN - (Date.now() - parseInt(lastSent))) / 1000);
            setStatus('error');
            setErrorMsg(`Please wait ${remaining}s before sending another message.`);
            return;
        }

        setStatus('sending');
        try {
            await emailjs.send(serviceID, templateID, {
                name: name.trim(),
                email: email.trim(),
                subject: subject.trim(),
                message: message.trim(),
            });
            localStorage.setItem('last-msg-sent-time', Date.now().toString());
            setStatus('sent');
        } catch {
            setStatus('error');
            setErrorMsg('Could not send right now. Please try again or email me directly.');
        }
    };

    const reset = () => {
        setName(''); setEmail(''); setSubject(''); setMessage('');
        setStatus('idle'); setErrorMsg('');
    };

    if (status === 'sent') {
        return (
            <div className="h-full bg-[#f2f2f7] ios-font flex flex-col items-center justify-center px-8 text-center animate-ios-rise">
                <div className="w-20 h-20 rounded-full bg-[#34c759] flex items-center justify-center shadow-lg mb-5 animate-ios-app-open">
                    <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" /></svg>
                </div>
                <h2 className="text-[22px] font-bold text-black">Message Sent!</h2>
                <p className="text-[15px] text-black/55 mt-2 leading-relaxed">
                    Thanks for reaching out, {name.split(' ')[0] || 'friend'}. I'll get back to you soon.
                </p>
                <button
                    onClick={reset}
                    className="mt-7 px-6 py-2.5 rounded-full text-white text-[15px] font-semibold active:scale-95 transition-transform"
                    style={{ background: ACCENT }}
                >
                    New Message
                </button>
            </div>
        );
    }

    const field = 'w-full bg-white text-[15px] text-black placeholder-black/30 px-4 py-3 outline-none';

    return (
        <div className="h-full bg-[#f2f2f7] ios-font flex flex-col animate-ios-rise">
            <div className="flex items-center justify-between px-5 pt-3 pb-2.5 flex-shrink-0">
                <span className="text-[20px] font-bold text-black">New Message</span>
                <button
                    onClick={send}
                    disabled={!valid || status === 'sending'}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-[14px] font-semibold transition-all active:scale-95 disabled:opacity-40"
                    style={{ background: ACCENT }}
                >
                    {status === 'sending' ? (
                        <>
                            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Sending
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M2 21 23 12 2 3v7l15 2-15 2v7Z" /></svg>
                            Send
                        </>
                    )}
                </button>
            </div>

            <div className="px-4 overflow-y-auto ios-scroll pb-8">
                <div className="bg-white rounded-[14px] overflow-hidden shadow-sm mb-4">
                    <div className="flex items-center px-4 py-3 border-b border-black/[0.06]">
                        <span className="text-[14px] text-black/40 w-16">To:</span>
                        <span className="text-[15px] font-medium" style={{ color: ACCENT }}>Praneeth Reddy</span>
                    </div>
                    <input className={`${field} border-b border-black/[0.06]`} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input className={field} type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="bg-white rounded-[14px] overflow-hidden shadow-sm">
                    <input className={`${field} border-b border-black/[0.06] font-medium`} placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                    <textarea
                        className={`${field} resize-none leading-relaxed`}
                        rows={8}
                        placeholder="Write your message…"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                {status === 'error' && (
                    <p className="text-[13px] text-[#ff3b30] mt-3 px-1 leading-snug">{errorMsg}</p>
                )}
                <p className="text-[12px] text-black/35 mt-4 px-1 text-center">
                    Your message goes straight to my inbox — no app required.
                </p>
            </div>
        </div>
    );
}
