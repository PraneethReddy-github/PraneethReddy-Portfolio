/*
 * ContextMenu — iOS Haptic-Touch style menu for home-screen / dock icons.
 *
 * <ContextMenu anchor={rect} app={{ id, name, Icon }} actions={[...]} onClose={...} />
 *   anchor : DOMRect-like { top, left, width, height }
 *   actions: [{ label, icon (svg path d), destructive?, onSelect }]
 *
 * Portaled to <body>, fixed overlay, so it floats above everything.
 */
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { haptic } from './haptics';

const MENU_W = 250;
const ROW_H = 44;
const GAP = 12;
const MARGIN = 12;
const ICON = 60; // home-screen icon size

export const MENU_ICONS = {
    open:     'M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
    newTab:   'M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7ZM14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3h-7Z',
    link:     'M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12ZM8 13h8v-2H8v2Zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10Z',
    copy:     'M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z',
    share:    'M12 2 7.5 6.5l1.4 1.4L11 5.8V15h2V5.8l2.1 2.1 1.4-1.4L12 2ZM5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10h-2v10H7V10H5Z',
    remove:   'M6 7h12l-1 14H7L6 7Zm3-4h6l1 2h4v2H4V5h4l1-2Z',
    info:     'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z',
};

export default function ContextMenu({ anchor, app, actions = [], onClose }) {
    const [shown, setShown] = useState(false);
    const [above, setAbove] = useState(false);
    const [pos, setPos] = useState({ left: 0, top: 0 });
    const menuRef = useRef(null);
    const closingRef = useRef(false);
    const pendingRef = useRef(null);

    const a = anchor || { top: 0, left: 0, width: ICON, height: ICON };
    const iconLeft = a.left;
    const iconTop = a.top;
    const iconW = a.width || ICON;
    const iconH = a.height || ICON;

    // Position the menu once we know its height
    useLayoutEffect(() => {
        if (typeof window === 'undefined') return;
        const menuH = menuRef.current ? menuRef.current.offsetHeight : actions.length * ROW_H;
        const vh = window.innerHeight, vw = window.innerWidth;
        const labelSpace = 22; // room for the label under the lifted icon
        const fitsBelow = iconTop + iconH + labelSpace + GAP + menuH + MARGIN < vh;
        const top = fitsBelow ? iconTop + iconH + labelSpace + GAP : iconTop - GAP - menuH;
        const left = Math.max(MARGIN, Math.min(iconLeft, vw - MENU_W - MARGIN));
        setAbove(!fitsBelow);
        setPos({ left, top: Math.max(MARGIN, top) });
    }, [iconTop, iconLeft, iconH, actions.length]);

    useEffect(() => {
        const r = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(r);
    }, []);

    const close = (after) => {
        if (closingRef.current) return;
        closingRef.current = true;
        pendingRef.current = after || null;
        setShown(false);
        setTimeout(() => {
            if (onClose) onClose();
            if (pendingRef.current) pendingRef.current();
        }, 180);
    };

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') close(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (typeof document === 'undefined') return null;

    const Icon = app && app.Icon;
    const spring = 'cubic-bezier(0.34,1.56,0.64,1)';
    const exit = 'cubic-bezier(0.4,0,1,1)';

    return createPortal(
        <div
            className="fixed inset-0 z-[110] ios-font"
            onClick={() => close()}
            onContextMenu={(e) => e.preventDefault()}
            style={{
                background: 'rgba(0,0,0,0.35)',
                backdropFilter: shown ? 'blur(24px) saturate(1.2)' : 'blur(0px)',
                WebkitBackdropFilter: shown ? 'blur(24px) saturate(1.2)' : 'blur(0px)',
                opacity: shown ? 1 : 0,
                transition: `opacity ${shown ? 260 : 180}ms ease, backdrop-filter 260ms ease, -webkit-backdrop-filter 260ms ease`,
            }}
        >
            {/* Lifted icon + label */}
            <div
                className="fixed flex flex-col items-center pointer-events-auto"
                onClick={(e) => { e.stopPropagation(); close(); }}
                style={{
                    left: iconLeft, top: iconTop, width: iconW,
                    transform: shown ? 'scale(1.12)' : 'scale(1)',
                    transformOrigin: 'center center',
                    transition: `transform 280ms ${shown ? spring : exit}`,
                }}
            >
                <div
                    style={{
                        width: iconW, height: iconH,
                        filter: shown ? 'drop-shadow(0 18px 28px rgba(0,0,0,0.55))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                        transition: 'filter 280ms ease',
                    }}
                >
                    {Icon && <Icon />}
                </div>
                {app && app.name && (
                    <span className="text-white text-[11px] mt-1.5 font-medium drop-shadow-md whitespace-nowrap">
                        {app.name}
                    </span>
                )}
            </div>

            {/* Menu */}
            <div
                ref={menuRef}
                className="fixed overflow-hidden rounded-[16px] shadow-2xl ring-1 ring-white/10"
                onClick={(e) => e.stopPropagation()}
                style={{
                    left: pos.left, top: pos.top, width: MENU_W,
                    background: 'rgba(30,30,32,0.85)',
                    backdropFilter: 'blur(30px) saturate(1.4)',
                    WebkitBackdropFilter: 'blur(30px) saturate(1.4)',
                    transformOrigin: above ? 'bottom left' : 'top left',
                    transform: shown ? 'scale(1)' : 'scale(0.6)',
                    opacity: shown ? 1 : 0,
                    transition: shown
                        ? `transform 280ms ${spring}, opacity 200ms ease`
                        : `transform 180ms ${exit}, opacity 160ms ease`,
                }}
            >
                {actions.map((act, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            haptic('light');
                            close(act.onSelect);
                        }}
                        className="w-full flex items-center justify-between px-4 text-left active:bg-white/10 transition-colors"
                        style={{
                            height: ROW_H,
                            color: act.destructive ? '#ff453a' : '#fff',
                            borderTop: i > 0 ? '0.5px solid rgba(255,255,255,0.1)' : 'none',
                        }}
                    >
                        <span className="text-[16px] font-normal truncate pr-3">{act.label}</span>
                        {act.icon && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                                <path d={act.icon} />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>,
        document.body
    );
}

/* ---------- Default action sets ---------- */

const EXTERNAL = {
    github:   { url: 'https://github.com/PraneethReddy-github',              label: 'GitHub' },
    linkedin: { url: 'https://www.linkedin.com/in/connectwithpraneeth/',      label: 'LinkedIn' },
};

const PORTFOLIO_APPS = new Set([
    'portfolio', 'about', 'resume', 'projects', 'skills', 'education',
    'certifications', 'publications', 'learning', 'phone', 'mail',
]);

async function copyText(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
        else {
            const ta = document.createElement('textarea');
            ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
        }
        haptic('success');
    } catch {}
}

async function shareUrl(url, title) {
    if (typeof navigator !== 'undefined' && navigator.share) {
        try { await navigator.share({ title, url }); return; } catch {}
    }
    await copyText(url);
}

/**
 * defaultActionsFor(app, helpers?) → actions[]
 *   app     : { id, name }
 *   helpers : { open(id), share(url, title), copy(text), openExternal(url), remove(id) }  (all optional)
 */
export function defaultActionsFor(app, helpers = {}) {
    const id = app && app.id;
    const name = (app && app.name) || id;
    const open = helpers.open || (() => {});
    const share = helpers.share || shareUrl;
    const copy = helpers.copy || copyText;
    const openExternal = helpers.openExternal || ((url) => window.open(url, '_blank', 'noopener'));
    const siteUrl = () => (typeof window !== 'undefined' ? window.location.href : '');

    const actions = [];

    if (EXTERNAL[id]) {
        const ext = EXTERNAL[id];
        actions.push({ label: 'Open in New Tab', icon: MENU_ICONS.newTab, onSelect: () => openExternal(ext.url) });
        actions.push({ label: 'Copy Link',        icon: MENU_ICONS.link,   onSelect: () => copy(ext.url) });
        actions.push({ label: `Share ${ext.label}`, icon: MENU_ICONS.share, onSelect: () => share(ext.url, `${ext.label} — Praneeth`) });
    } else {
        actions.push({ label: `Open ${name}`, icon: MENU_ICONS.open, onSelect: () => open(id) });
        if (PORTFOLIO_APPS.has(id)) {
            actions.push({ label: 'Share Portfolio', icon: MENU_ICONS.share, onSelect: () => share(siteUrl(), "Praneeth's Portfolio") });
            actions.push({ label: 'Copy Link',       icon: MENU_ICONS.copy,  onSelect: () => copy(siteUrl()) });
        } else {
            actions.push({ label: 'Share Portfolio', icon: MENU_ICONS.share, onSelect: () => share(siteUrl(), "Praneeth's Portfolio") });
        }
    }

    if (helpers.remove) {
        actions.push({ label: 'Remove from Home Screen', icon: MENU_ICONS.remove, destructive: true, onSelect: () => helpers.remove(id) });
    }
    return actions;
}
