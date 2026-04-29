import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Pin, MoreHorizontal } from 'lucide-react';
import ConfirmPopup from './popups/ConfirmPopup';

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
    const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const btnRef = useRef(null);
    const dropdownRef = useRef(null);
    const normalizedLink = normalizeUrl(link);
    const faviconUrl = getFaviconUrl(link);

    const openMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const r = btnRef.current.getBoundingClientRect();
        setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
        setMenuOpen(true);
    };

    // Close on click outside the dropdown
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                btnRef.current && !btnRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        // Use capture so we intercept before anything else
        document.addEventListener('click', handler, true);
        return () => document.removeEventListener('click', handler, true);
    }, [menuOpen]);

    return (
        <div className="relative min-w-0">
            <a
                className={`${viewMode ? `flex-col h-28 lg:h-30 p-2 lg:p-3` : `gap-3 w-full px-4 py-3`} rounded-xl shadow-sm flex justify-between cursor-pointer transition-transform hover:scale-[1.02] min-w-0 overflow-hidden`}
                style={bgStyle}
                title={title}
                href={normalizedLink}
                target="_blank"
            >
                {/* Mobile tile layout */}
                {viewMode && (
                    <div className="flex flex-col justify-between h-full lg:hidden">
                        <div className="flex items-start gap-1.5 min-w-0">
                            {faviconUrl && !faviconError && (
                                <img src={faviconUrl} width={14} height={14} className="shrink-0 rounded-sm mt-0.5" onError={() => setFaviconError(true)} alt="" />
                            )}
                            <h3 className="text-sm font-bold leading-tight" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {title}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                            <p className="text-xs opacity-70 truncate flex-1 min-w-0">{link}</p>
                            <div className="flex items-center gap-1 shrink-0">
                                {pinned && <Pin size={12} className="fill-current opacity-90" />}
                                {(onEdit || onDelete) && <span className="w-4" />}
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop tile layout */}
                {viewMode && (
                    <>
                        <div className="hidden lg:flex items-center justify-between gap-2 min-w-0 overflow-hidden">
                            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                                {faviconUrl && !faviconError && (
                                    <img src={faviconUrl} width={16} height={16} className="shrink-0 rounded-sm" onError={() => setFaviconError(true)} alt="" />
                                )}
                                <h3 className="text-lg font-bold shrink-0" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {title}
                                </h3>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                {pinned && <Pin size={16} className="fill-current opacity-90" />}
                                {(onEdit || onDelete) && <span className="w-5" />}
                            </div>
                        </div>
                        <div className="hidden lg:block text-sm opacity-90 w-full overflow-hidden whitespace-nowrap truncate" title={link ?? ''}>
                            <span>{link}</span>
                        </div>
                    </>
                )}

                {/* List view */}
                {!viewMode && (
                    <div className="flex items-center justify-between gap-2 min-w-0 overflow-hidden w-full">
                        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                            {faviconUrl && !faviconError && (
                                <img src={faviconUrl} width={16} height={16} className="shrink-0 rounded-sm" onError={() => setFaviconError(true)} alt="" />
                            )}
                            <h3 className="text-lg font-bold shrink-0" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {title}
                            </h3>
                            <span className="text-sm opacity-90 shrink-0">|</span>
                            <p className="text-sm opacity-90 truncate flex-1 min-w-0" title={link ?? ''}>{link}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            {pinned && <Pin size={16} className="fill-current opacity-90" />}
                            {(onEdit || onDelete) && <span className="w-5" />}
                        </div>
                    </div>
                )}
            </a>

            {/* ... button — always outside <a> so clicks never navigate */}
            {(onEdit || onDelete) && (
                <button
                    ref={btnRef}
                    className="absolute bottom-1.5 right-1.5 lg:top-2 lg:bottom-auto lg:right-2 p-0.5 rounded-md hover:bg-black/20 transition-colors z-10"
                    onClick={openMenu}
                    title="Options"
                >
                    <MoreHorizontal size={16} />
                </button>
            )}

            {/* Portal dropdown — rendered in body so it's never clipped */}
            {menuOpen && (onEdit || onDelete) && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed bg-[#1a1d1a] border border-white/10 rounded-xl shadow-xl z-9999 overflow-hidden min-w-27.5"
                    style={{ top: menuPos.top, right: menuPos.right }}
                >
                    {onEdit && (
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit({ id, title, link, color, pinned }); }}
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setConfirmOpen(true); }}
                        >
                            Delete
                        </button>
                    )}
                </div>,
                document.body
            )}

            <ConfirmPopup
                isOpen={confirmOpen}
                title="Delete link?"
                message={`"${title}" will be permanently deleted.`}
                confirmLabel="Delete"
                onConfirm={() => { setConfirmOpen(false); onDelete(id); }}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}
