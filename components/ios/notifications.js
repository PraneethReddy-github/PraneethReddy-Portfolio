
export const NOTIFICATIONS = [
    {
        id: 1,
        app: "Praneeth's Portfolio",
        icon: '🐧',
        color: '#E95420', // Ubuntu orange
        title: 'Psst… try the desktop view 💻',
        body: 'Open this portfolio on a laptop for a little Ubuntu surprise — the full experience lives on the big screen.',
        time: 0,
    },
    {
        id: 2,
        app: 'Certifications',
        icon: '🏆',
        color: '#34C759',
        title: 'New Certification Earned',
        body: 'AWS Academy Graduate — Cloud Architecting & Security Foundations (Jan 2025).',
        time: 12,
    },
    {
        id: 3,
        app: 'Publications',
        icon: '📄',
        color: '#8E8E93',
        title: 'Paper Accepted',
        body: 'Quantum Key Distribution — 16th ICCCNT, IIT Indore.',
        time: 34,
    },
];

export function formatRelativeTime(minutesAgo) {
    if (minutesAgo === 0) return 'now';
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    return `${Math.floor(minutesAgo / 60)}h ago`;
}
