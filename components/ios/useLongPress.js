/*
 * useLongPress — iOS "Haptic Touch" gesture hook.
 *
 *   const lp = useLongPress({ onLongPress: (e, rect) => ..., onClick: () => ... });
 *   <div {...lp.handlers} style={{ ...lp.style }} />
 *
 * Returns { handlers, style }. `handlers` also works when spread directly
 * (it only contains event props), so `<div {...lp} />` is NOT intended —
 * spread `lp.handlers` and `lp.style` separately.
 *
 * - Pointer events → works for touch + mouse.
 * - Timer cancels if the pointer moves > moveTolerance or leaves/cancels.
 * - The synthetic click that follows a long press is swallowed.
 * - onContextMenu is prevented so Android/desktop don't show a native menu.
 */
import { useRef, useCallback, useEffect, useMemo } from 'react';
import { haptic } from './haptics';

export default function useLongPress({ onLongPress, onClick, delay = 420, moveTolerance = 10 } = {}) {
    const timerRef = useRef(null);
    const startRef = useRef(null);      // { x, y }
    const firedRef = useRef(false);     // long press fired for this gesture
    const targetRef = useRef(null);     // element rect source
    const cbRef = useRef({ onLongPress, onClick });
    cbRef.current = { onLongPress, onClick };

    const clear = useCallback(() => {
        if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
        startRef.current = null;
    }, []);

    useEffect(() => clear, [clear]);

    const onPointerDown = useCallback((e) => {
        // Only primary button / primary touch
        if (e.button !== undefined && e.button !== 0) return;
        if (e.isPrimary === false) return;
        clear();
        firedRef.current = false;
        startRef.current = { x: e.clientX, y: e.clientY };
        targetRef.current = e.currentTarget;
        timerRef.current = setTimeout(() => {
            timerRef.current = null;
            firedRef.current = true;
            haptic('medium');
            const el = targetRef.current;
            const rect = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
            if (cbRef.current.onLongPress) cbRef.current.onLongPress(e, rect);
        }, delay);
    }, [clear, delay]);

    const onPointerMove = useCallback((e) => {
        const s = startRef.current;
        if (!s || !timerRef.current) return;
        const dx = e.clientX - s.x, dy = e.clientY - s.y;
        if (Math.abs(dx) > moveTolerance || Math.abs(dy) > moveTolerance) clear();
    }, [clear, moveTolerance]);

    const onPointerUp = useCallback(() => { clear(); }, [clear]);
    const onPointerCancel = useCallback(() => { clear(); firedRef.current = false; }, [clear]);
    const onPointerLeave = useCallback(() => { clear(); }, [clear]);

    const onContextMenu = useCallback((e) => { e.preventDefault(); }, []);

    const handleClick = useCallback((e) => {
        if (firedRef.current) {
            // swallow the click that trails a long press
            firedRef.current = false;
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (cbRef.current.onClick) cbRef.current.onClick(e);
    }, []);

    const handlers = useMemo(() => ({
        onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onPointerLeave,
        onContextMenu, onClick: handleClick,
    }), [onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onPointerLeave, onContextMenu, handleClick]);

    const style = useMemo(() => ({
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        touchAction: 'manipulation',
    }), []);

    return { handlers, style };
}
