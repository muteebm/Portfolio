/**
 * Live GitHub signal for the backdrop. Public events need no auth (60 req/h),
 * so we cache for 30 minutes in sessionStorage and fail silently.
 *
 * @returns {Promise<{repo: string, url: string, lastAt: number, count: number, kinds: string[]}[]>}
 */
const KEY = 'gh-activity:muteebm';
const TTL = 30 * 60 * 1000;

export async function fetchGithubActivity(user = 'muteebm', max = 5) {
    try {
        const cached = sessionStorage.getItem(KEY);
        if (cached) {
            const { ts, data } = JSON.parse(cached);
            if (Date.now() - ts < TTL) return data;
        }
    } catch { /* storage unavailable */ }

    try {
        const res = await fetch(`https://api.github.com/users/${user}/events/public?per_page=100`, {
            headers: { Accept: 'application/vnd.github+json' },
        });
        if (!res.ok) return [];
        const events = await res.json();
        const byRepo = new Map();
        for (const ev of events) {
            if (!['PushEvent', 'CreateEvent', 'ReleaseEvent', 'PullRequestEvent'].includes(ev.type)) continue;
            const name = ev.repo?.name?.split('/')[1];
            if (!name) continue;
            const at = Date.parse(ev.created_at);
            const cur = byRepo.get(name) || { repo: name, url: `https://github.com/${ev.repo.name}`, lastAt: 0, count: 0, kinds: [] };
            cur.count += ev.type === 'PushEvent' ? (ev.payload?.size || 1) : 1;
            cur.lastAt = Math.max(cur.lastAt, at);
            if (!cur.kinds.includes(ev.type)) cur.kinds.push(ev.type);
            byRepo.set(name, cur);
        }
        const data = [...byRepo.values()].sort((a, b) => b.lastAt - a.lastAt).slice(0, max);
        try { sessionStorage.setItem(KEY, JSON.stringify({ ts: Date.now(), data })); } catch { /* noop */ }
        return data;
    } catch {
        return [];
    }
}

export function ageLabel(ts) {
    const d = Math.max(0, Date.now() - ts);
    const h = Math.floor(d / 3.6e6);
    if (h < 1) return 'just now';
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
}
