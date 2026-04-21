import { useState, useRef, useEffect } from 'react';
import { Pin, MoreHorizontal } from 'lucide-react';

function normalizeUrl(link) {
    if (!link) return "";
    return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}

function getFaviconUrl(link) {
    try {
        const { hostname } = new URL(normalizeUrl(link));
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch {
        return null;
    }
}

export default function LinkCard({ id, type, title, link, roomid, color, icon, pinned, folderid, createdAt, colorMap, viewMode, onEdit, onDelete }) {
    const bgStyle = colorMap?.[color] ?? {backgroundColor: 'white'};
    const [faviconError, setFaviconError] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const normalizedLink = normalizeUrl(link);
    const faviconUrl = getFaviconUrl(link);

    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    return (
        <div className="relative min-w-0">
            <a
                className={`${viewMode ? `flex-col h-30 p-3` : `gap-3 w-full px-4 py-3`} rounded-xl shadow-sm flex justify-between cursor-pointer transition-transform hover:scale-[1.02] min-w-0 overflow-hidden`}
                style={bgStyle}
                title={title}
                href={normalizedLink}
                target="_blank"
            >
                {/* Icon, title, and actions row */}
                <div className="flex items-center justify-between gap-2 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                        {faviconUrl && !faviconError && (
                            <img
                                src={faviconUrl}
                                width={16}
                                height={16}
                                className="shrink-0 rounded-sm"
                                onError={() => setFaviconError(true)}
                                alt=""
                            />
                        )}
                        <h3 className="text-lg font-bold shrink-0" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                            {title}
                        </h3>

                        {/* Display link section (list view) */}
                        {!viewMode && (
                            <>
                                <span className="text-sm opacity-90 shrink-0">|</span>
                                <p className="text-sm opacity-90 truncate flex-1 min-w-0" title={link ?? ''}>{link}</p>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                        {pinned && <Pin size={16} className="fill-current opacity-90" />}
                        {/* spacer so the ... button outside doesn't overlap pin */}
                        {(onEdit || onDelete) && <span className="w-5" />}
                    </div>
                </div>

                {/* Display link section (tile view) */}
                {viewMode && (
                    <div className="text-sm opacity-90 w-full overflow-hidden whitespace-nowrap truncate" title={link ?? ''}>
                        <span>{link}</span>
                    </div>
                )}
            </a>

            {/* ... menu — outside <a> so it isn't clipped and clicks work */}
            {(onEdit || onDelete) && (
                <div ref={menuRef} className="absolute top-2 right-2 z-10">
                    <button
                        className="p-1 rounded-md hover:bg-black/20 transition-colors"
                        onClick={(e) => { e.preventDefault(); setMenuOpen((o) => !o); }}
                        title="Options"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-full mt-1 bg-[#1a1d1a] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden min-w-27.5">
                            {onEdit && (
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                                    onClick={() => { setMenuOpen(false); onEdit({ id, title, link, color, pinned }); }}
                                >
                                    Edit
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                                    onClick={() => { setMenuOpen(false); onDelete(id); }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
