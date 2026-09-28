/*
 * Haptic feedback helper. iOS Safari has no Vibration API, so this is a no-op
 * there, but Android Chrome (a large share of "mobile" visitors) gets real
 * taptic-style feedback. Respects the Haptics toggle in Settings.
 */
import { getSystem } from './system';

const PATTERNS = {
    light:     8,
    medium:    14,
    heavy:     22,
    selection: 5,
    success:   [10, 40, 14],
    warning:   [18, 50, 18],
    error:     [26, 40, 26, 40, 26],
    unlock:    [6, 30, 12],
};

export function haptic(kind = 'light') {
    if (typeof navigator === 'undefined' || !navigator.vibrate) return;
    if (!getSystem().haptics) return;
    try { navigator.vibrate(PATTERNS[kind] ?? PATTERNS.light); } catch {}
}

export default haptic;
